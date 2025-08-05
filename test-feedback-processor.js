#!/usr/bin/env node

/**
 * Community Feedback Processing System - Local Test
 * 
 * This script tests the feedback classification and routing logic
 * without requiring GitHub Actions to run.
 */

// Test feedback samples
const testFeedback = [
  {
    content: `## 🔧 Improvement Suggestion

**Current challenge:** Finding specific templates for hybrid methodologies is difficult
**Proposed solution:** Add a template search/filter functionality with AI-powered recommendations
**Expected benefit:** Faster template discovery and adoption, reducing time-to-value for new users
**Priority:** High`,
    expected: { category: 'process-improvements', priority: 'S4' }
  },
  {
    content: `## 💡 Feature Request

**Feature description:** AI-powered template recommendation engine
**Use case:** When starting a new project, automatically get template recommendations
**Success criteria:** 90% accuracy in template recommendations`,
    expected: { category: 'feature-ideas', priority: 'S3' }
  },
  {
    content: `## 🐛 Issues & Bugs

**Issue description:** Critical bug in risk register template causing data loss
**Expected behavior:** Data should be saved automatically
**Priority:** Urgent - blocking production use`,
    expected: { category: 'bug-reports', priority: 'S1' }
  },
  {
    content: `## 🎉 Positive Feedback

**What I love:** The automated workflow health monitoring is fantastic!
**Use case:** Managing multiple projects with different teams
**Impact:** Reduced our workflow debugging time by 80%`,
    expected: { category: 'performance-automation', priority: 'S3' }
  }
];

// Classification logic (copied from workflow)
function classifyFeedback(feedbackContent) {
  const content = feedbackContent.toLowerCase();
  let category = 'general';
  let priority = 'S3';

  // Detect feedback type
  const feedbackTypes = {
    'positive': /## 🎉 Positive Feedback/i,
    'improvement': /## 🔧 Improvement Suggestion/i,
    'feature': /## 💡 Feature Request/i,
    'bug': /## 🐛 Issues & Bugs/i,
    'documentation': /## 📚 Documentation Feedback/i
  };

  let detectedType = 'general';
  for (const [type, regex] of Object.entries(feedbackTypes)) {
    if (regex.test(feedbackContent)) {
      detectedType = type;
      break;
    }
  }

  // Category classification - prioritize type-based classification first
  if (detectedType === 'bug') {
    category = 'bug-reports';
    priority = 'S2';
  } else if (detectedType === 'feature') {
    category = 'feature-ideas';
  } else if (detectedType === 'improvement') {
    category = 'process-improvements';
  } else if (detectedType === 'documentation') {
    category = 'documentation-issues';
  } else if (content.includes('integration') || content.includes('jira') || content.includes('asana')) {
    category = 'integration-requests';
  } else if (content.includes('performance') || content.includes('slow') || content.includes('automation') || content.includes('workflow')) {
    category = 'performance-automation';
  } else if (content.includes('ui') || content.includes('ux') || content.includes('design') || content.includes('usability')) {
    category = 'ux-usability';
  } else if (content.includes('template') || content.includes('example')) {
    category = 'template-requests';
  }

  // Priority scoring based on keywords
  if (content.includes('critical') || content.includes('urgent') || content.includes('blocking')) {
    priority = 'S1';
  } else if (content.includes('important') || content.includes('needed') || detectedType === 'bug') {
    priority = 'S2';
  } else if (content.includes('nice to have') || content.includes('suggestion')) {
    priority = 'S4';
  }

  return {
    type: detectedType,
    category: category,
    priority: priority,
    confidence: 0.8
  };
}

// Epic mapping (copied from workflow)
function routeToEpic(classification) {
  const epicMapping = {
    'template-requests': { epic: 323, theme: 'User Experience & Interface Enhancement' },
    'bug-reports': { epic: 307, theme: 'Technical Debt & Quality' },
    'integration-requests': { epic: 325, theme: 'Integration & Automation Platform' },
    'documentation-issues': { epic: 323, theme: 'User Experience & Interface Enhancement' },
    'performance-automation': { epic: 329, theme: 'Quality & Operations Excellence' },
    'ux-usability': { epic: 323, theme: 'User Experience & Interface Enhancement' },
    'feature-ideas': { epic: 317, theme: 'AI & Data Science Intelligence' },
    'process-improvements': { epic: 322, theme: 'Quality & Operations Excellence' }
  };

  return epicMapping[classification.category] || { epic: 198, theme: 'General Feedback' };
}

// Run tests
console.log('🤖 Community Feedback Processing System - Local Test\n');

let passedTests = 0;
let totalTests = testFeedback.length;

testFeedback.forEach((test, index) => {
  console.log(`\n📋 Test ${index + 1}:`);
  console.log(`Input: ${test.content.substring(0, 100)}...`);
  
  const classification = classifyFeedback(test.content);
  const routing = routeToEpic(classification);
  
  console.log(`\n🔍 Classification Results:`);
  console.log(`  Type: ${classification.type}`);
  console.log(`  Category: ${classification.category}`);
  console.log(`  Priority: ${classification.priority}`);
  console.log(`  Confidence: ${(classification.confidence * 100).toFixed(0)}%`);
  
  console.log(`\n📍 Routing Decision:`);
  console.log(`  Epic: #${routing.epic} - ${routing.theme}`);
  
  // Validation
  const categoryMatch = classification.category === test.expected.category;
  const priorityMatch = classification.priority === test.expected.priority;
  
  if (categoryMatch && priorityMatch) {
    console.log(`\n✅ PASS - Classification matches expected results`);
    passedTests++;
  } else {
    console.log(`\n❌ FAIL - Classification mismatch:`);
    console.log(`  Expected: category=${test.expected.category}, priority=${test.expected.priority}`);
    console.log(`  Actual: category=${classification.category}, priority=${classification.priority}`);
  }
  
  console.log('\n' + '─'.repeat(60));
});

console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log(`🎉 All tests passed! The feedback processing system is working correctly.`);
  console.log(`\n🚀 Ready to test with real GitHub comments once the FEEDBACK_PROCESSOR_TOKEN is configured.`);
} else {
  console.log(`⚠️  Some tests failed. Review the classification logic.`);
}

console.log(`\n📋 Next Steps:`);
console.log(`1. Create GitHub Personal Access Token with 'repo' scope`);
console.log(`2. Add token as FEEDBACK_PROCESSOR_TOKEN secret in repository settings`);
console.log(`3. Test with real feedback comments on issue #198`);
console.log(`4. Monitor workflow runs and analytics data`);
