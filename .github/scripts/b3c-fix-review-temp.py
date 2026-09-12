import json
import pathlib
import subprocess

manifest = json.loads(pathlib.Path('meta/migration-waves/b3c.json').read_text())
review = subprocess.check_output(
    ['git', 'show', 'HEAD:meta/needs-review.md'],
    text=True,
)
for asset in manifest['assets']:
    review = review.replace(asset['source'], asset['destination'])
pathlib.Path('meta/needs-review.md').write_text(review)
