"""Synthetic fixtures test data handling, not predictive validity."""
import tempfile
from pathlib import Path
import unittest
from pipeline import DATE_FIELDS, evaluate, prepare, read_csv


def task(key, estimate='10', actual='20', **overrides):
    return dict(TaskNumber=key, ProjectCode='P1', HoursEstimate=estimate,
                HoursActual=actual, StatusCode='FINISHED', **overrides)


def dates(key, month='01', completed=None):
    start = f'2020-{month}-01'
    return dict(TaskNumber=key, EstimateOn=start, StartedOn=start, CompletedOn=completed or start)


def run(tasks, date_rows):
    return prepare(tasks, date_rows, completed_statuses={'FINISHED'},
                   validation_start='2020-02-01', test_start='2020-03-01')


class PipelineTests(unittest.TestCase):
    def test_join_by_id_and_collapse_developer_rows(self):
        result = run([task('a', DeveloperID='1'), task('a', DeveloperID='2'), task('b')],
                     [dates('b', '02'), dates('a'), dates('a')])
        self.assertEqual(len(result['splits']['train']), 1)
        self.assertEqual(result['splits']['train'][0]['actual_hours'], 20)
        self.assertEqual(result['splits']['validation'][0]['task_id'], 'b')
        self.assertEqual(result['splits']['train'][0]['features'], {'estimate_hours': 10})

    def test_conflicts_and_missing_joins_are_quarantined(self):
        result = run([task('a'), task('a', actual='21'), task('b'), task('c')],
                     [dates('a'), dates('b'), dates('b', '02'), dates('orphan')])
        self.assertEqual([x['reason'] for x in result['excluded']],
                         ['conflicting_task_or_date_rows'] * 2 + ['missing_dates'])
        self.assertEqual(result['orphan_date_tasks'], ['orphan'])

    def test_labels_must_be_available_before_next_split(self):
        result = run([task('a'), task('b')], [dates('a', completed='2020-02-01'),
                                             dates('b', '02', '2020-03-01')])
        self.assertEqual([r['reason'] for r in result['excluded']], ['label_unavailable_at_cutoff'] * 2)

    def test_invalid_effort_and_dates_excluded_zero_actual_retained(self):
        result = run([task('a', estimate='0'), task('b', actual='NaN'), task('c', actual='0'), task('d')],
                     [dates('a'), dates('b'), dates('c'), dates('d', completed='2019-01-01')])
        self.assertEqual(len(result['excluded']), 3)
        self.assertEqual(result['zero_actual_tasks'], ['c'])

    def test_holdout_labels_do_not_change_fitted_ratio(self):
        rows = [task('a'), task('b', actual='30'), task('c', actual='40')]
        date_rows = [dates('a'), dates('b', '02'), dates('c', '03')]
        first = evaluate(run(rows, date_rows))
        rows[2]['HoursActual'] = '1000'
        second = evaluate(run(rows, date_rows))
        self.assertEqual(first['ratio_fitted_on_train'], 2)
        self.assertEqual(second['ratio_fitted_on_train'], 2)
        self.assertEqual(first['evaluation']['test']['median_correction']['mae_hours'], 20)

    def test_csv_schema_and_explicit_encoding(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'dates.csv'
            path.write_text('TaskNumber,EstimateOn,StartedOn,CompletedOn\nx,01-Jan-20,01-Jan-20,02-Jan-20\n')
            rows, digest = read_csv(path, DATE_FIELDS)
            self.assertEqual(len(digest), 64)
            self.assertEqual(len(run([task('x')], rows)['splits']['train']), 1)
            path.write_text('TaskNumber\nx\n')
            with self.assertRaises(ValueError):
                read_csv(path, DATE_FIELDS)

    def test_empty_training_split_rejected(self):
        with self.assertRaises(ValueError):
            evaluate(run([task('x')], [dates('x', '03')]))


if __name__ == '__main__':
    unittest.main()
