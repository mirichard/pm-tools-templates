import copy
import tempfile
from pathlib import Path
import unittest
from josse_benchmark import make_manifest, fit, score, evaluate, load_rows


def fixture():
    return [{'id': f'P{g}-{i}', 'group': f'host/P{g}', 'estimate_hours': 1.0, 'actual_hours': 2.0}
            for g in range(10) for i in range(2)]


class JosseBenchmarkTests(unittest.TestCase):
    def test_project_assignment_is_order_independent_and_complete(self):
        rows = fixture()
        manifest = make_manifest(rows, [])
        self.assertEqual(manifest, make_manifest(list(reversed(rows)), []))
        self.assertEqual(manifest['task_counts'], {'train': 12, 'validation': 4, 'test': 4})
        self.assertEqual(set(manifest['groups']), {r['group'] for r in rows})

    def test_holdout_labels_never_change_fitted_parameters(self):
        rows = fixture()
        manifest = make_manifest(rows, [])
        before = evaluate(rows, [], manifest)
        for row in rows:
            if manifest['groups'][row['group']] != 'train':
                row['actual_hours'] = 999
        after = evaluate(rows, [], manifest)
        self.assertEqual(before['training_fit'], after['training_fit'])
        self.assertNotEqual(before['evaluation'], after['evaluation'])

    def test_altered_membership_or_protocol_rejected(self):
        rows = fixture()
        manifest = make_manifest(rows, [])
        changed = copy.deepcopy(manifest)
        changed['groups'][rows[0]['group']] = 'test'
        if changed == manifest:
            changed['groups'][rows[0]['group']] = 'train'
        with self.assertRaises(ValueError):
            evaluate(rows, [], changed)
        with self.assertRaises(ValueError):
            make_manifest(rows + [rows[0]], [])

    def test_scoring_uses_hours_and_prediction_minus_actual(self):
        train = [{'estimate_hours': 1, 'actual_hours': 2}]
        result = score([{'group': 'test', 'estimate_hours': 3, 'actual_hours': 5}], fit(train))
        self.assertEqual(result['original_estimate']['signed_error_hours'], -2)
        self.assertEqual(result['train_median_ratio']['task_mae_hours'], 1)
        self.assertEqual(result['train_median_actual']['task_mae_hours'], 3)

    def test_unreviewed_database_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'wrong.sqlite3'
            path.write_bytes(b'not the reviewed source')
            with self.assertRaisesRegex(ValueError, 'Unexpected source'):
                load_rows(path)


if __name__ == '__main__':
    unittest.main()
