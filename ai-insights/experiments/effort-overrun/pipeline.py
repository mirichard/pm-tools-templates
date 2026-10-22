"""Standalone effort-baseline preparation. No production model integration."""
import csv
from datetime import datetime
import hashlib
import math
from pathlib import Path
import statistics

TASK_FIELDS = ('TaskNumber', 'ProjectCode', 'HoursEstimate', 'HoursActual', 'StatusCode')
DATE_FIELDS = ('TaskNumber', 'EstimateOn', 'StartedOn', 'CompletedOn')


def read_csv(path, fields, encoding='utf-8'):
    """Read explicitly encoded input and retain its content hash for provenance."""
    path = Path(path)
    with path.open(encoding=encoding, newline='') as source:
        reader = csv.DictReader(source)
        if not set(fields).issubset(reader.fieldnames or []):
            raise ValueError(f'Missing required columns in {path.name}')
        rows = list(reader)
    return rows, hashlib.sha256(path.read_bytes()).hexdigest()


def parse_date(value):
    # Explicit century boundary avoids the platform-dependent two-digit-year pivot.
    for fmt in ('%Y-%m-%d', '%d-%b-%y'):
        try:
            result = datetime.strptime(value, fmt).date()
            if fmt == '%d-%b-%y' and result.year < 2000:
                raise ValueError('Two-digit dates before 2000 require clarification')
            return result
        except ValueError:
            continue
    raise ValueError('Invalid or ambiguous date')


def collapse(rows, fields):
    grouped = {}
    for row in rows:
        if any(field not in row for field in fields) or not row['TaskNumber'].strip():
            raise ValueError('Missing required field or task identifier')
        grouped.setdefault(row['TaskNumber'], []).append(row)
    unique, conflicts = {}, set()
    for key, values in grouped.items():
        if len({tuple(row[field] for field in fields) for row in values}) != 1:
            conflicts.add(key)
        else:
            unique[key] = {field: values[0][field] for field in fields}
    return unique, conflicts, set(grouped)


def prepare(tasks, dates, *, completed_statuses, validation_start, test_start):
    """Collapse task rows, join dates by ID, and enforce label-availability cutoffs.

    Status semantics and temporal cutoffs must be supplied from the approved
    protocol. Actual effort is an outcome only; it never enters feature records.
    """
    if not completed_statuses:
        raise ValueError('Explicit completed statuses are required')
    validation_start, test_start = map(parse_date, (validation_start, test_start))
    if validation_start >= test_start:
        raise ValueError('Validation must precede test')
    task_map, task_conflicts, task_ids = collapse(tasks, TASK_FIELDS)
    date_map, date_conflicts, date_ids = collapse(dates, DATE_FIELDS)
    splits = {'train': [], 'validation': [], 'test': []}
    excluded = []
    for key in sorted(task_ids):
        reason = None
        if key in task_conflicts or key in date_conflicts:
            reason = 'conflicting_task_or_date_rows'
        elif key not in date_map:
            reason = 'missing_dates'
        else:
            task, dates_row = task_map[key], date_map[key]
            if task['StatusCode'] not in completed_statuses:
                reason = 'status_not_eligible'
            elif not task['ProjectCode'].strip():
                reason = 'missing_project'
            else:
                try:
                    estimate, actual = float(task['HoursEstimate']), float(task['HoursActual'])
                    if not all(map(math.isfinite, (estimate, actual))) or estimate <= 0 or actual < 0:
                        raise ValueError('Invalid effort')
                    estimated, started, completed = (parse_date(dates_row[f]) for f in DATE_FIELDS[1:])
                    if not estimated <= started <= completed:
                        raise ValueError('Invalid date order')
                    split = 'train' if estimated < validation_start else 'validation' if estimated < test_start else 'test'
                    cutoff = validation_start if split == 'train' else test_start if split == 'validation' else None
                    if cutoff and completed >= cutoff:
                        reason = 'label_unavailable_at_cutoff'
                    else:
                        splits[split].append({'task_id': key, 'project': task['ProjectCode'],
                                              'features': {'estimate_hours': estimate},
                                              'actual_hours': actual,
                                              'estimate_date': estimated.isoformat(),
                                              'completion_date': completed.isoformat()})
                except (ValueError, TypeError):
                    reason = 'invalid_effort_or_dates'
        if reason:
            excluded.append({'task_id': key, 'reason': reason})
    return {'splits': splits, 'excluded': excluded,
            'orphan_date_tasks': sorted(date_ids - task_ids),
            'zero_actual_tasks': [r['task_id'] for rows in splits.values() for r in rows if r['actual_hours'] == 0]}


def fit_median_ratio(train):
    if not train:
        raise ValueError('Training split is empty')
    return statistics.median(row['actual_hours'] / row['features']['estimate_hours'] for row in train)


def score(rows, ratio):
    if not rows:
        raise ValueError('Evaluation split is empty')
    errors = [r['features']['estimate_hours'] * ratio - r['actual_hours'] for r in rows]
    return {'count': len(errors), 'mae_hours': statistics.mean(map(abs, errors)),
            'median_absolute_error_hours': statistics.median(map(abs, errors)),
            'signed_error_hours': statistics.mean(errors)}


def evaluate(prepared):
    """One fixed baseline; validation/test labels cannot tune the correction."""
    splits = prepared['splits']
    ratio = fit_median_ratio(splits['train'])
    return {'ratio_fitted_on_train': ratio,
            'evaluation': {name: {label: score(rows, factor) for label, factor in
                                 (('original_estimate', 1), ('median_correction', ratio))}
                           for name, rows in splits.items() if name != 'train'}}
