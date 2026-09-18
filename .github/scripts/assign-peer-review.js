#!/usr/bin/env node

/**
 * Peer Review Assignment Script
 * Assigns templates to community members for peer review
 */

const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  try {
    const token = core.getInput('github-token');
    const octokit = github.getOctokit(token);

    const context = github.context;
    const issueNumber = context.payload.issue.number;
    const issueBody = context.payload.issue.body || '';

    // Define peer reviewers
    const peerReviewers = [
      '@devAlice', '@devBob', '@devCharlie', '@devDana', '@devEli'
    ];

    // Randomly select 2 peers for review
    const selectedReviewers = peerReviewers
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    // Create peer review comment
    const reviewComment = `
    ## 🤝 Peer Review Assignment
    
    This template has been assigned for peer review.
    
    **Assigned Reviewers:** ${selectedReviewers.join(', ')}
    
    **Review Guidelines:**
    1. **Quality and Completeness** - Ensure the template meets quality standards and is complete.
    2. **Clarity and Usability** - Evaluate if the template is easy to understand and use.
    3. **Suggestions for Improvement** - Provide constructive feedback for enhancements.
    
    **Review Format:**
    Use the following template in your review comment:

    ```
    ## Peer Review: [Reviewer Name]
    
    **Quality and Completeness:** [Comments]
    **Clarity and Usability:** [Comments]
    **Suggestions for Improvement:** [Comments]
    
    **Final Recommendation:** [Approve/Needs Work]
    ```
    
    ---
    *Peer review requested on ${new Date().toDateString()}*
    `;

    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      body: reviewComment
    });

    console.log(`Assigned peer reviewers: ${selectedReviewers.join(', ')}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

