# Community Feedback Processing System

## Overview

The Community Feedback Processing System is an automated GitHub Actions workflow that intelligently processes, classifies, and routes community feedback to the appropriate development teams and epics. The system uses AI-powered classification to analyze feedback content and automatically assign labels, priorities, and routing decisions.

## Features

- 🤖 **Automated Classification**: Uses content analysis to categorize feedback into predefined categories
- 🎯 **Smart Routing**: Routes feedback to appropriate epics based on content and type
- 🏷️ **Intelligent Labeling**: Automatically adds relevant labels for filtering and organization
- 📊 **Priority Scoring**: Assigns priority levels (S1-S4) based on urgency keywords
- 🔄 **Rate Limit Resilience**: Built-in retry logic with exponential backoff to handle GitHub API limits
- 📈 **Analytics Tracking**: Collects processing metrics for continuous improvement
- 🔔 **Stakeholder Notifications**: Notifies epic owners when feedback is routed to their areas

## Workflow Triggers

The system activates on:
- **Issue Comments**: Any comment added to issue #198 or issues with the `community-feedback` label
- **New Issues**: Issues opened with structured feedback templates

## Feedback Templates

### 🎉 Positive Feedback
```markdown
## 🎉 Positive Feedback

**What I love:** [Describe what you appreciate]
**Use case:** [How you're using it]
**Impact:** [How it's helped your work]
```

### 🔧 Improvement Suggestions
```markdown
## 🔧 Improvement Suggestion

**Current challenge:** [What's not working optimally]
**Proposed solution:** [Your suggested improvement]
**Expected benefit:** [How this would help]
**Priority:** [High/Medium/Low]
```

### 💡 Feature Requests
```markdown
## 💡 Feature Request

**Feature description:** [What you'd like to see]
**Use case:** [When/how you'd use it]
**Current workaround:** [How you handle this now]
**Success criteria:** [What would make this successful]
```

### 🐛 Bug Reports
```markdown
## 🐛 Issues & Bugs

**Issue description:** [What's happening]
**Expected behavior:** [What should happen]
**Steps to reproduce:** [How to recreate]
**Environment:** [OS, tools, versions]
**Priority:** [Critical/High/Medium/Low]
```

### 📚 Documentation Feedback
```markdown
## 📚 Documentation Feedback

**Documentation area:** [Which docs/guides]
**Issue type:** [Missing/Unclear/Outdated]
**Specific feedback:** [What needs improvement]
**Suggested content:** [What should be added]
```

## Classification System

### Categories

| Category | Description | Routed to Epic |
|----------|-------------|----------------|
| `bug-reports` | Issues, errors, broken functionality | #307 - Technical Debt & Quality |
| `feature-ideas` | New feature requests | #317 - AI & Data Science Intelligence |
| `process-improvements` | Workflow and process enhancements | #322 - Quality & Operations Excellence |
| `template-requests` | Template-related requests | #323 - User Experience & Interface Enhancement |
| `integration-requests` | Tool integration requests | #325 - Integration & Automation Platform |
| `documentation-issues` | Documentation improvements | #323 - User Experience & Interface Enhancement |
| `performance-automation` | Performance and automation feedback | #329 - Quality & Operations Excellence |
| `ux-usability` | User experience improvements | #323 - User Experience & Interface Enhancement |

### Priority Levels

| Priority | Description | Trigger Keywords |
|----------|-------------|------------------|
| **S1** | Critical/Urgent | critical, urgent, blocking |
| **S2** | Important | important, needed, bug issues |
| **S3** | Standard | (default priority) |
| **S4** | Low Priority | nice to have, suggestion |

## Technical Implementation

### Workflow Steps

1. **Parse Feedback Content**: Extracts and structures feedback data
2. **AI Classification**: Analyzes content to determine category and priority
3. **Route to Epic**: Maps feedback to appropriate development themes
4. **Add Labels**: Applies classification labels for organization
5. **Notify Stakeholders**: Alerts epic owners of new feedback
6. **Update Analytics**: Tracks processing metrics

### Rate Limit Handling

The system includes robust retry logic to handle GitHub's secondary rate limits:

- **3 retry attempts** with exponential backoff (2s, 4s, 8s delays)
- **Jitter randomization** to prevent thundering herd effects
- **Graceful degradation** for non-critical operations
- **Detailed logging** for troubleshooting

### Required Permissions

The `FEEDBACK_PROCESSOR_TOKEN` requires:
- **Issues: Read and Write** - For reading comments and adding labels/comments
- **Pull requests: Read and Write** - For future PR-related feedback
- **Metadata: Read** - For repository metadata access
- **Contents: Read** - For workflow file access

## Usage

### For Community Members

1. Navigate to [Community Feedback Issue #198](https://github.com/mirichard/pm-tools-templates/issues/198)
2. Use one of the provided feedback templates
3. Submit your comment
4. The system will automatically:
   - Classify your feedback
   - Route it to the appropriate team
   - Add relevant labels
   - Notify stakeholders

### For Maintainers

Monitor processed feedback through:
- **Labels**: Filter issues by `community-feedback`, categories, and priorities
- **Epic Notifications**: Check routed epics for new feedback
- **Analytics Artifacts**: Review processing metrics from workflow runs

## Testing

### Local Testing

Run the local test script to validate classification logic:

```bash
node test-feedback-processor.js
```

This script tests:
- Template detection accuracy
- Category classification
- Priority assignment
- Epic routing decisions

### Integration Testing

Test the live system by:
1. Adding feedback comments to issue #198
2. Monitoring workflow runs in Actions tab
3. Verifying automated processing comments
4. Checking label assignments

## Monitoring & Analytics

### Workflow Runs
- Monitor in GitHub Actions: `/actions`
- Look for "Community Feedback Processor" workflows
- Check run status and logs for issues

### Processing Metrics
- Analytics data stored as workflow artifacts
- Retention: 30 days
- Format: JSON Lines (.jsonl)

### Key Metrics Tracked
- Processing time per feedback item
- Classification accuracy
- Category distribution
- Priority breakdown
- Author engagement patterns

## Troubleshooting

### Common Issues

**Rate Limit Errors**
- System includes automatic retry logic
- If persistent, check API usage in repository settings

**Misclassification**
- Review feedback content for missing keywords
- Update classification logic in workflow if needed
- Test changes with `test-feedback-processor.js`

**Missing Notifications**
- Check epic issue numbers in routing configuration
- Verify stakeholder notification delivery in logs

### Debug Mode

Enable verbose logging by checking workflow run logs:
1. Go to Actions tab
2. Select failed/completed run
3. Expand job steps for detailed logs

## Maintenance

### Regular Tasks
- **Monthly**: Review analytics data for improvement opportunities
- **Quarterly**: Update epic routing mappings as needed
- **As needed**: Adjust classification keywords based on feedback patterns

### Workflow Updates
1. Test changes locally with `test-feedback-processor.js`
2. Update workflow file in `.github/workflows/feedback-processor.yml`
3. Test with sample feedback on issue #198
4. Monitor for successful processing

## Contributing

### Adding New Categories
1. Update `epicMapping` in workflow
2. Add corresponding labels to repository
3. Update documentation
4. Test with sample feedback

### Improving Classification
1. Analyze misclassified feedback
2. Update keyword detection logic
3. Test with `test-feedback-processor.js`
4. Deploy and monitor accuracy

## Support

For issues with the Community Feedback Processing System:
1. Check workflow run logs for errors
2. Review this documentation for troubleshooting steps
3. Create a new issue with the `system-issue` label
4. Include relevant workflow run IDs and error messages

---

*Last updated: August 5, 2025*
*System version: 2.0 with Rate Limit Resilience*
