"""Exploratory explicit-constraint check; not a model or PM efficacy benchmark.

Run with Python 3: python ai-insights/research/1379-feasibility/check.py
The parser shares the assistant-produced task inventory, isolating edge extraction.
It was authored after viewing this development case. No held-out claim is made.
"""
import json
import re
from pathlib import Path
from graphlib import TopologicalSorter, CycleError

ROOT = Path(__file__).parent
case = json.loads((ROOT / 'case.json').read_text())
extracted = json.loads((ROOT / 'assistant-extraction.json').read_text())
lines = case['problem_text'].splitlines()
durations = {t['name']: t['duration'] for t in extracted['tasks']}
canonical = {name.lower(): name for name in durations}
names = re.compile('|'.join(re.escape(n) for n in sorted(durations, key=len, reverse=True)), re.I)


def parse_edges():
    """Recognize before/after wording, one-to-many lists, and case variants."""
    edges, unresolved = [], []
    for line_number, line in enumerate(lines, 1):
        mentioned = [canonical[m.group().lower()] for m in names.finditer(line)]
        if len(mentioned) < 2:
            continue
        forward = bool(re.match(r'^(Completion of|Prior completion of) ', line))
        reverse = bool(re.search(r'only after|until|only once|contingent on|requires prior completion|prior to the completion', line))
        if forward or ('before' in line and not line.startswith('Before ')):
            pairs = [(mentioned[0], successor) for successor in mentioned[1:]]
        elif reverse or line.startswith('Before '):
            pairs = [(mentioned[-1], successor) for successor in mentioned[:-1]]
        else:
            unresolved.append(line_number)
            continue
        edges.extend({'from': p, 'to': s, 'line': line_number, 'type': 'FS', 'lag': 0} for p, s in pairs)
    return edges, unresolved


def schedule(ds, edges):
    if any(not isinstance(v, (int, float)) or v < 0 for v in ds.values()):
        raise ValueError('Missing or invalid duration')
    graph = {n: set() for n in ds}
    for edge in edges:
        p, s = edge['from'], edge['to']
        if p not in graph or s not in graph:
            raise ValueError('Unknown activity')
        if edge['type'] != 'FS' or edge['lag'] != 0:
            raise ValueError('Unsupported relationship')
        graph[s].add(p)
    order = tuple(TopologicalSorter(graph).static_order())
    starts, paths = {}, {}
    for n in order:
        best = max(graph[n], key=lambda p: starts[p] + ds[p], default=None)
        starts[n] = starts[best] + ds[best] if best else 0
        paths[n] = paths[best] + [n] if best else [n]
    last = max(ds, key=lambda n: starts[n] + ds[n])
    return starts, starts[last] + ds[last], paths[last]


def independent_relaxation(ds, edges):
    starts = dict.fromkeys(ds, 0)
    for _ in ds:
        changed = False
        for e in edges:
            p, s = e['from'], e['to']
            if starts[s] < starts[p] + ds[p]:
                starts[s] = starts[p] + ds[p]
                changed = True
        if not changed:
            return starts
    raise ValueError('Did not converge')


baseline, unresolved = parse_edges()
key = lambda e: (e['from'], e['to'], e['line'])
ai_set, parser_set = set(map(key, extracted['edges'])), set(map(key, baseline))
for task in extracted['tasks']:
    source = lines[task['line'] - 1]
    assert task['name'].lower() in source.lower()
    assert re.search(r'(?:duration(?: of| is)?|takes|active for|executes for|processing time of|spans|runs for) ' + str(task['duration']) + r'\b', source) or re.search(r'duration of ' + re.escape(task['name']) + ' is ' + str(task['duration']) + r'\b', source)
for edge in extracted['edges']:
    source = lines[edge['line'] - 1].lower()
    assert edge['from'].lower() in source and edge['to'].lower() in source

starts, bound, path = schedule(durations, extracted['edges'])
assert starts == independent_relaxation(durations, extracted['edges'])
baseline_starts, baseline_bound, _ = schedule(durations, baseline)
# Independent, hand-solvable fork/join fixture: max(2+3, 2+5)+1 = 8.
fixture = [{'from': p, 'to': s, 'type': 'FS', 'lag': 0} for p, s in [('A','B'),('A','C'),('B','D'),('C','D')]]
assert schedule({'A':2,'B':3,'C':5,'D':1}, fixture)[1] == 8
guards = {}
for label, ds, edges in [
    ('cycle', durations, extracted['edges'] + [{'from': 'Final Handover','to':'Site Notice to Proceed','type':'FS','lag':0}]),
    ('unknown_activity', durations, extracted['edges'] + [{'from':'absent','to':'Final Handover','type':'FS','lag':0}]),
    ('missing_duration', {**durations, 'Site Survey':None}, extracted['edges']),
]:
    try:
        schedule(ds, edges)
    except (ValueError, CycleError):
        guards[label] = 'rejected'
    else:
        raise AssertionError(label)

report = {
    'instance_id': case['instance_id'], 'source_instance': case['source_instance'],
    'tasks': len(durations), 'assistant_edges':len(ai_set), 'parser_edges':len(parser_set),
    'assistant_only': sorted(ai_set-parser_set), 'parser_only': sorted(parser_set-ai_set),
    'unresolved_parser_lines':unresolved, 'source_span_checks':'passed (existence, not independent semantic validation)',
    'precedence_only_lower_bound':bound, 'parser_lower_bound':baseline_bound,
    'same_earliest_starts': starts == baseline_starts, 'critical_path':path,
    'independent_calculation':'topological pass matches iterative relaxation; fork/join fixture passed',
    'failure_guards':guards,
    'resource_constraints_enforced':False,
    'limitations':['One development case; assistant extraction is not an independently measured model run.',
      'Shared task inventory; edge parser authored after seeing case; no held-out accuracy or timing result.',
      'All dependencies are explicit; no inference of missing dependencies or PM comparison.',
      'CPM result is an unlimited-resource lower bound, not a feasible RCPSP schedule or comparison to bks.']
}
(ROOT/'results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
