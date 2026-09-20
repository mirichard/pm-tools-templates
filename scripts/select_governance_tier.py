#!/usr/bin/env python3
"""Recommend a governance tier from the decision engine's v1 context profile."""
import argparse
import json
from pathlib import Path
import sys

TIERS = ('light', 'standard', 'rigorous')
DIMENSIONS = {
    'size': ('small', 'medium', 'large', 'enterprise'),
    'methodology': ('traditional', 'agile', 'hybrid', 'unsure'),
    'risk_profile': ('low', 'medium', 'high', 'regulatory'),
    'team_size': ('solo', 'small', 'medium', 'large'),
    'industry': ('general', 'it', 'healthcare', 'financial', 'construction'),
    'phase': ('starting', 'planning', 'in_progress', 'closing'),
    'pm_experience': ('new', 'intermediate', 'advanced'),
}


def select_tier(profile, minimum_tier='light'):
    """Reject incomplete/invalid profiles; policy may raise, never lower, the tier."""
    if not isinstance(profile, dict) or profile.get('profile_version') != '1.0':
        raise ValueError('profile_version must be "1.0"')
    context = profile.get('project_context')
    if not isinstance(context, dict):
        raise ValueError('project_context must be an object')
    for field, values in DIMENSIONS.items():
        if context.get(field) not in values:
            raise ValueError(f'{field} must be one of: {", ".join(values)}')
    if minimum_tier not in TIERS:
        raise ValueError('minimum_tier must be light, standard, or rigorous')
    floors = [('light', 'Baseline for a complete small, low-risk context')]
    for field, rigorous, standard in (
        ('risk_profile', ('high', 'regulatory'), ('medium',)),
        ('size', ('large', 'enterprise'), ('medium',)),
        ('team_size', ('large',), ('medium',)),
    ):
        value = context[field]
        if value in rigorous:
            floors.append(('rigorous', f'{field}={value}'))
        elif value in standard:
            floors.append(('standard', f'{field}={value}'))
    floors.append((minimum_tier, f'Organization minimum={minimum_tier}'))
    tier = max((floor for floor, _ in floors), key=TIERS.index)
    return {
        'tier': tier,
        'reasons': [reason for floor, reason in floors if floor == tier],
        'approval_required': True,
        'guide': 'docs/governance/governance-decision-matrix.md',
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('profile', type=Path, help='Decision-engine v1 JSON profile')
    parser.add_argument('--minimum-tier', choices=TIERS, default='light')
    args = parser.parse_args()
    try:
        result = select_tier(json.loads(args.profile.read_text()), args.minimum_tier)
    except (OSError, ValueError) as exc:
        print(f'No tier selected: {exc}', file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main())
