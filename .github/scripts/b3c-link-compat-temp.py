import json
import os
import pathlib
import re
import subprocess

root = pathlib.Path('.').resolve()
manifest = json.loads(pathlib.Path('meta/migration-waves/b3c.json').read_text())
source_to_dest = {a['source']: a['destination'] for a in manifest['assets']}

# Restore historical archive material: migration should not rewrite archived snapshots.
archive = pathlib.Path('docs/archive/README-20250805.md')
if archive.exists():
    archive.write_text(subprocess.check_output(['git', 'show', 'HEAD:docs/archive/README-20250805.md'], text=True))

# Correct the one mutable inbound relative reference affected by B3C. Keep it canonical,
# but recompute the relative path from the referring file rather than string-splicing.
test_plan = pathlib.Path('industry-specializations/information-technology/software-development/test_plan_template.md')
if test_plan.exists():
    text = test_plan.read_text()
    dest = source_to_dest['methodology-frameworks/agile-scrum/scaling-frameworks/safe/metrics_dashboard_template.md']
    rel = os.path.relpath(dest, start=str(test_plan.parent)).replace(os.sep, '/')
    text = re.sub(
        r'(\]\()[^)]*metrics_dashboard_template\.md(\))',
        rf'\g<1>{rel}\g<2>',
        text,
    )
    test_plan.write_text(text)

# Immutable migrated bodies retain their bytes. Supply filesystem compatibility only for
# sibling/root links that were valid before relocation and would otherwise break solely
# because the body moved. Symlinks are deliberately outside template discovery because
# Dirent.isFile() is false for symlinks; validators will prove this assumption.
links = {
    'domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/less/less_retrospective_template.md':
        'domains/team/methodology-frameworks/agile-scrum/scaling-frameworks/less/less_retrospective_template.md',
    'domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/safe/pi_planning_template.md':
        'methodology-frameworks/agile-scrum/scaling-frameworks/safe/pi_planning_template.md',
    'domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/safe/portfolio_kanban_template.md':
        'methodology-frameworks/agile-scrum/scaling-frameworks/safe/portfolio_kanban_template.md',
    'domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/safe/safe_program_increment_planning_template.md':
        'methodology-frameworks/agile-scrum/scaling-frameworks/safe/safe_program_increment_planning_template.md',
    'domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/safe/safe_portfolio_kanban_template.md':
        'methodology-frameworks/agile-scrum/scaling-frameworks/safe/safe_portfolio_kanban_template.md',
    'domains/delivery/README.md': 'README.md',
}
for link_name, target in links.items():
    link = pathlib.Path(link_name)
    link.parent.mkdir(parents=True, exist_ok=True)
    if link.exists() or link.is_symlink():
        raise SystemExit(f'compatibility path already exists: {link_name}')
    relative_target = os.path.relpath(target, start=str(link.parent)).replace(os.sep, '/')
    link.symlink_to(relative_target)

for link_name, target in links.items():
    link = pathlib.Path(link_name)
    if not link.is_symlink() or not link.exists():
        raise SystemExit(f'broken compatibility symlink: {link_name} -> {os.readlink(link)}')
print(f'Created and resolved {len(links)} B3C compatibility symlinks.')
