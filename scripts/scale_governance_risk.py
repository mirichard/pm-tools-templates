#!/usr/bin/env python3
"""Recommend governance scaling from five assessed risk dimensions (#747)."""
import argparse
import copy
import json
from pathlib import Path
import sys

if __package__:
    from .select_governance_tier import select_tier
else:
    from select_governance_tier import select_tier

RISK_DIMENSIONS = ('technical', 'schedule', 'budget', 'organizational', 'compliance')
LEVELS = ('low', 'medium', 'high', 'unknown')
RANKS = {'low': 0, 'medium': 1, 'high': 2, 'regulatory': 3}


def scale_risk(profile, risk_dimensions, minimum_tier='light'):
    """Retain context/policy floors; unknown exposure requires interim high controls."""
    select_tier(profile, minimum_tier)  # Validate before copying or modifying context.
    if not isinstance(risk_dimensions, dict) or set(risk_dimensions) != set(RISK_DIMENSIONS):
        raise ValueError('risk_dimensions must contain exactly: ' + ', '.join(RISK_DIMENSIONS))
    for dimension, level in risk_dimensions.items():
        if level not in LEVELS:
            raise ValueError(f'{dimension} must be low, medium, high, or unknown')
    unknown = [name for name in RISK_DIMENSIONS if risk_dimensions[name] == 'unknown']
    assessed = max(('high' if value == 'unknown' else value for value in risk_dimensions.values()), key=RANKS.get)
    updated = copy.deepcopy(profile)
    original = updated['project_context']['risk_profile']
    effective = max((original, assessed), key=RANKS.get)
    updated['project_context']['risk_profile'] = effective
    selection = select_tier(updated, minimum_tier)
    return {
        'assessed_risk': assessed,
        'effective_risk_profile': effective,
        'tier': selection['tier'],
        'reasons': selection['reasons'],
        'risk_dimensions': dict(risk_dimensions),
        'provisional': bool(unknown),
        'unresolved_dimensions': unknown,
        'approval_required': True,
        'guide': 'docs/governance/risk-based-scaling.md',
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('assessment', type=Path, help='JSON with profile and risk_dimensions')
    parser.add_argument('--minimum-tier', choices=('light', 'standard', 'rigorous'), default='light')
    args = parser.parse_args()
    try:
        data = json.loads(args.assessment.read_text())
        if not isinstance(data, dict):
            raise ValueError('assessment must be an object')
        result = scale_risk(data.get('profile'), data.get('risk_dimensions'), args.minimum_tier)
    except (OSError, ValueError) as exc:
        print(f'No scaling recommendation: {exc}', file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main())
