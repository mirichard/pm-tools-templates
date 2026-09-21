"""Integration tests for PR ranges and the issue-review script, without API writes."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/validate-expert-review.py"
VALID = "# Template\n\n" + "Useful guidance. " * 5


class ChangedFilesTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.git("init", "-q")
        self.git("config", "user.email", "test@example.com")
        self.git("config", "user.name", "Test")
        self.write("unrelated.md", "invalid existing file")
        self.write("removed.md", "invalid removed file")
        self.base = self.commit()

    def git(self, *args):
        return subprocess.check_output(["git", *args], cwd=self.root, stderr=subprocess.PIPE).decode().strip()

    def write(self, name, content):
        (self.root / name).write_text(content)

    def commit(self):
        self.git("add", "--all")
        self.git("commit", "-qm", "fixture")
        return self.git("rev-parse", "HEAD")

    def run_check(self, head, base=None, event="pull_request"):
        payload = self.root / "event.json"
        payload.write_text(json.dumps({"pull_request": {
            "base": {"sha": base or self.base}, "head": {"sha": head},
        }}))
        env = dict(os.environ, GITHUB_EVENT_NAME=event, GITHUB_EVENT_PATH=str(payload))
        return subprocess.run(["python3", str(SCRIPT)], cwd=self.root, env=env,
                              text=True, capture_output=True, check=False)

    def test_multiple_commits_spaces_renames_and_deletions(self):
        self.write("first file.md", VALID)
        self.commit()
        self.write("second.markdown", VALID)
        (self.root / "removed.md").unlink()
        self.git("mv", "first file.md", "renamed file.md")
        result = self.run_check(self.commit())
        self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
        self.assertIn("2 changed Markdown files", result.stdout)
        self.assertIn("renamed file.md", result.stdout)
        self.assertNotIn("unrelated.md", result.stdout)
        self.assertNotIn("removed.md", result.stdout)

    def test_no_markdown_has_no_fallback(self):
        self.write("code.txt", "change")
        result = self.run_check(self.commit())
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("not applicable", result.stdout)

    def test_invalid_changed_content_fails(self):
        self.write("bad.md", "no title")
        self.assertEqual(self.run_check(self.commit()).returncode, 1)

    def test_base_changes_are_excluded(self):
        self.write("pr.md", VALID)
        head = self.commit()
        self.git("checkout", "-q", "--detach", self.base)
        self.write("base-only.md", "invalid unrelated base content")
        result = self.run_check(head, base=self.commit())
        self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
        self.assertNotIn("base-only.md", result.stdout)
        self.assertIn("pr.md", result.stdout)

    def test_missing_history_fails_without_fallback(self):
        result = self.run_check("0" * 40)
        self.assertEqual(result.returncode, 1)
        self.assertNotIn("unrelated.md", result.stdout)

    def test_issue_event_fails_explicitly(self):
        result = self.run_check(self.base, event="issues")
        self.assertEqual(result.returncode, 1)
        self.assertIn("requires a pull_request", result.stderr)


class ReviewScriptTests(unittest.TestCase):
    def test_review_processing_and_api_errors(self):
        workflow = (ROOT / ".github/workflows/expert-review.yml").read_text()
        script = textwrap.dedent(workflow.split("  process-expert-reviews:", 1)[1].split("          script: |\n", 1)[1])
        harness = r'''
const assert = require('node:assert/strict');
const run = new (Object.getPrototypeOf(async function(){}).constructor)('github', 'context', SCRIPT);
async function scenario(body, status) {
  const calls = [];
  const github = {rest: {issues: {
    addLabels: async () => calls.push('add'),
    removeLabel: async () => { calls.push('remove'); if (status) throw Object.assign(new Error('API error'), {status}); }
  }}};
  const context = {repo: {owner: 'owner', repo: 'repo'}, payload: {issue: {number: 1}, comment: {body}}};
  await run(github, context);
  return calls;
}
(async () => {
  assert.deepEqual(await scenario('Ordinary comment'), []);
  assert.deepEqual(await scenario('## Expert Review:\nReviewed'), ['add', 'remove']);
  assert.deepEqual(await scenario('## Expert Review:', 404), ['add', 'remove']);
  await assert.rejects(scenario('## Expert Review:', 403));
})();
'''.replace("SCRIPT", json.dumps(script))
        result = subprocess.run(["node", "-e", harness], text=True, capture_output=True, check=False)
        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
