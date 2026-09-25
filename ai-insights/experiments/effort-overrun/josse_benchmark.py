"""Pinned, retrospective project-held-out effort baselines; no production model."""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
import math
from pathlib import Path
import random
import re
import sqlite3
import statistics
from urllib.parse import urlparse

from profile_josse import SOURCE_SHA256

PROTOCOL = {
    'version': 'josse-retrospective-v1',
    'database_sha256': SOURCE_SHA256,
    'source_unit': 'seconds', 'report_unit': 'person-hours',
    'group_key': 'source host / issue-key project prefix',
    'split_salt': 'pm-tools-josse-v1-2026-09-25',
    'train_fraction': 0.6, 'validation_fraction': 0.2,
    'baselines': ['original_estimate', 'train_median_ratio', 'train_median_actual'],
    'primary_metric': 'project_macro_mae_hours',
    'secondary_metrics': ['task_mae_hours', 'median_absolute_error_hours', 'signed_error_hours'],
    'bootstrap_seed': 20260925, 'bootstrap_draws': 2000,
    'outlier_filter': None, 'promotion_threshold': None,
}


def load_rows(path):
    path = Path(path).resolve(strict=True)
    if hashlib.sha256(path.read_bytes()).hexdigest() != SOURCE_SHA256:
        raise ValueError('Unexpected source database hash')
    with sqlite3.connect(path.as_uri() + '?mode=ro', uri=True) as conn:
        if conn.execute('pragma integrity_check').fetchone() != ('ok',):
            raise ValueError('Source database integrity failure')
        raw = conn.execute('select id, reference, expert_estimated_effort, actual_effort from "case" order by id').fetchall()
    rows, excluded = [], []
    for key, reference, estimate, actual in raw:
        reason = None
        if not re.fullmatch(r'[A-Za-z][A-Za-z0-9_]*-\d+', key or ''):
            reason = 'invalid_issue_key'
        elif not all(isinstance(x, (int, float)) and math.isfinite(x) and x > 0 for x in (estimate, actual)):
            reason = 'missing_or_nonpositive_effort_pair'
        elif not urlparse(reference or '').hostname:
            reason = 'missing_source_host'
        if reason:
            excluded.append({'id': key, 'reason': reason})
        else:
            rows.append({'id': key, 'group': urlparse(reference).hostname + '/' + key.rsplit('-', 1)[0],
                         'estimate_hours': estimate / 3600, 'actual_hours': actual / 3600})
    return rows, excluded


def stable_hash(value):
    return hashlib.sha256(value.encode()).hexdigest()


def make_manifest(rows, excluded):
    if len({row['id'] for row in rows}) != len(rows):
        raise ValueError('Duplicate task IDs')
    groups = sorted({row['group'] for row in rows}, key=lambda g: stable_hash(PROTOCOL['split_salt'] + ':' + g))
    if len(groups) < 5:
        raise ValueError('Insufficient groups for three splits')
    train_end = int(len(groups) * PROTOCOL['train_fraction'])
    validation_end = train_end + int(len(groups) * PROTOCOL['validation_fraction'])
    assignments = {g: 'train' if i < train_end else 'validation' if i < validation_end else 'test'
                   for i, g in enumerate(groups)}
    task_ids = {split: sorted(r['id'] for r in rows if assignments[r['group']] == split)
                for split in ('train', 'validation', 'test')}
    return {'protocol': PROTOCOL, 'groups': dict(sorted(assignments.items())),
            'task_counts': {s: len(ids) for s, ids in task_ids.items()},
            'task_id_sha256': {s: stable_hash('\n'.join(ids)) for s, ids in task_ids.items()},
            'excluded_counts': dict(sorted(Counter(r['reason'] for r in excluded).items())),
            'excluded_ids_sha256': stable_hash(json.dumps(excluded, sort_keys=True))}


def fit(train):
    if not train:
        raise ValueError('Empty training set')
    return {'ratio': statistics.median(r['actual_hours'] / r['estimate_hours'] for r in train),
            'constant_hours': statistics.median(r['actual_hours'] for r in train)}


def score(rows, fitted):
    if not rows:
        raise ValueError('Empty evaluation set')
    scores = {}
    for name in PROTOCOL['baselines']:
        groups = defaultdict(list)
        for row in rows:
            prediction = (row['estimate_hours'] if name == 'original_estimate' else
                          row['estimate_hours'] * fitted['ratio'] if name == 'train_median_ratio' else
                          fitted['constant_hours'])
            groups[row['group']].append(prediction - row['actual_hours'])
        errors = [e for values in groups.values() for e in values]
        project_mae = {g: statistics.mean(map(abs, values)) for g, values in sorted(groups.items())}
        scores[name] = {'task_count': len(errors), 'project_count': len(groups),
                        'task_mae_hours': statistics.mean(map(abs, errors)),
                        'median_absolute_error_hours': statistics.median(map(abs, errors)),
                        'signed_error_hours': statistics.mean(errors),
                        'project_macro_mae_hours': statistics.mean(project_mae.values()),
                        'per_project_mae_hours': project_mae}
    return scores


def comparisons(scores):
    original = scores['original_estimate']['per_project_mae_hours']
    result = {}
    for name in PROTOCOL['baselines'][1:]:
        differences = [value - original[g] for g, value in scores[name]['per_project_mae_hours'].items()]
        rng = random.Random(PROTOCOL['bootstrap_seed'])
        samples = sorted(statistics.mean(rng.choices(differences, k=len(differences)))
                         for _ in range(PROTOCOL['bootstrap_draws']))
        low, high = samples[49], samples[1949]
        result[name] = {'projects_better': sum(d < 0 for d in differences),
                        'projects_worse': sum(d > 0 for d in differences),
                        'projects_tied': sum(d == 0 for d in differences),
                        'macro_mae_difference_hours': statistics.mean(differences),
                        'project_bootstrap_95_interval_hours': [low, high],
                        'direction': 'lower_error' if high < 0 else 'higher_error' if low > 0 else 'inconclusive'}
    return result


def evaluate(rows, excluded, manifest):
    # Recreate assignments and membership digests; reject changed protocol/source membership.
    if make_manifest(rows, excluded) != manifest:
        raise ValueError('Frozen manifest does not match inputs or protocol')
    splits = {s: [r for r in rows if manifest['groups'][r['group']] == s]
              for s in ('train', 'validation', 'test')}
    fitted = fit(splits['train'])
    evaluations = {s: score(splits[s], fitted) for s in ('validation', 'test')}
    return {'protocol': PROTOCOL, 'manifest_sha256': stable_hash(json.dumps(manifest, sort_keys=True)),
            'training_fit': fitted, 'evaluation': evaluations,
            'comparison_to_original': {s: comparisons(v) for s, v in evaluations.items()},
            'limitations': ['Retrospective project transfer, not temporal forecasting',
                            'Recorded effort and estimates may be incomplete or revised',
                            'No four-level project-risk validation or production promotion']}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['prepare', 'evaluate'])
    parser.add_argument('database', type=Path)
    parser.add_argument('manifest', type=Path)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    rows, excluded = load_rows(args.database)
    if args.mode == 'prepare':
        with args.manifest.open('x') as target:
            json.dump(make_manifest(rows, excluded), target, indent=2, sort_keys=True)
            target.write('\n')
    else:
        if args.output is None:
            parser.error('--output is required for evaluation')
        report = evaluate(rows, excluded, json.loads(args.manifest.read_text()))
        with args.output.open('x') as target:
            json.dump(report, target, indent=2, sort_keys=True)
            target.write('\n')


if __name__ == '__main__':
    main()
