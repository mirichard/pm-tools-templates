from pathlib import Path

path = Path('.github/workflows/visual-regression-testing.yml')
text = path.read_text()


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 anchor, found {count}')
    text = text.replace(old, new, 1)


replace_once(
    '          import glob\n          from concurrent.futures import ThreadPoolExecutor',
    '          import glob\n          import hashlib\n          from concurrent.futures import ThreadPoolExecutor',
    'import anchor',
)

helper = '''          def screenshot_identity(file_path, dark_theme=False):
              normalized = file_path.replace('\\\\', '/')
              digest = hashlib.sha256(normalized.encode()).hexdigest()[:12]
              suffix = '_dark' if dark_theme else ''
              return f"{Path(normalized).stem}-{digest}{suffix}"

          def build_migration_visual_aliases():
              inventory_path = Path('meta/migration-inventory.json')
              if not inventory_path.exists():
                  return {}, set()
              inventory = json.loads(inventory_path.read_text())
              aliases = {}
              legacy_pointer_keys = set()
              for move in inventory.get('moves', []):
                  if move.get('action') != 'executed-move-with-legacy-pointer':
                      continue
                  source = move.get('source')
                  destination = move.get('destination')
                  if not source or not destination:
                      continue
                  for dark_theme in (False, True):
                      source_key = screenshot_identity(source, dark_theme)
                      destination_key = screenshot_identity(destination, dark_theme)
                      aliases[destination_key] = source_key
                      legacy_pointer_keys.add(source_key)
              return aliases, legacy_pointer_keys

'''
replace_once(
    '          # Main comparison process\n',
    helper + '          # Main comparison process\n',
    'helper insertion',
)

replace_once(
    '          baseline_screenshots = find_baseline_files()\n          print(f"Found baseline sets: {list(baseline_screenshots.keys())}")\n\n          comparison_results = []',
    '          baseline_screenshots = find_baseline_files()\n          print(f"Found baseline sets: {list(baseline_screenshots.keys())}")\n\n          migration_aliases, legacy_pointer_keys = build_migration_visual_aliases()\n          print(f"Loaded {len(migration_aliases)} migration baseline aliases")\n\n          comparison_results = []',
    'alias initialization',
)

replace_once(
    '              for current_file in current_files:\n                  filename = os.path.basename(current_file)\n                  baseline_file = baseline_file_map.get(Path(filename).stem)\n                  \n                  result = {',
    '''              for current_file in current_files:
                  filename = os.path.basename(current_file)
                  current_key = Path(filename).stem
                  if current_key in legacy_pointer_keys:
                      print(f"  POINTER: {filename} - intentional migration compatibility page")
                      comparison_results.append({
                          'browser_resolution': browser_resolution,
                          'filename': filename,
                          'current_file': current_file,
                          'baseline_file': None,
                          'has_baseline': False,
                          'status': 'migration_legacy_pointer',
                          'timestamp': datetime.now().isoformat()
                      })
                      continue
                  baseline_key = migration_aliases.get(current_key, current_key)
                  baseline_file = baseline_file_map.get(baseline_key)
                  
                  result = {''',
    'comparison loop',
)

replace_once(
    "                      'baseline_file': baseline_file,\n                      'has_baseline': baseline_file is not None,",
    "                      'baseline_file': baseline_file,\n                      'baseline_key': baseline_key,\n                      'has_baseline': baseline_file is not None,",
    'result baseline key',
)

replace_once(
    "              'new_screenshots': len(comparison_results) - total_comparisons,\n              'regression_rate':",
    "              'new_screenshots': sum(1 for result in comparison_results if result.get('status') == 'new_screenshot'),\n              'migration_pointer_screenshots': sum(1 for result in comparison_results if result.get('status') == 'migration_legacy_pointer'),\n              'regression_rate':",
    'summary classification',
)

replace_once(
    "          print(f\"  New screenshots: {summary['new_screenshots']}\")\n          print(f\"  Regression rate: {summary['regression_rate']}%\")",
    "          print(f\"  New screenshots: {summary['new_screenshots']}\")\n          print(f\"  Migration pointer screenshots: {summary['migration_pointer_screenshots']}\")\n          print(f\"  Regression rate: {summary['regression_rate']}%\")",
    'summary output',
)

path.write_text(text)
print('Migration-aware visual comparator patch assembled successfully.')
