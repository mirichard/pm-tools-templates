#!/usr/bin/env bash
set -euo pipefail

test -s "reports/status/${REPORT_TYPE}-status-$(date +%Y-%m-%d).md"
mkdir -p ./email

# Get the latest status report content
REPORT_FILE="reports/status/${REPORT_TYPE}-status-$(date +%Y-%m-%d).md"

# Generate Issue #314 compliant program-level email
cat > ./email/status-email.html << EOF
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>📊 Program Status Update - $(date +"%B %d, %Y")</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      margin: -30px -30px 30px -30px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 25px 0;
    }
    .metric-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #007bff;
      text-align: center;
    }
    .metric-card h3 {
      margin: 0 0 10px 0;
      color: #495057;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .metric-value {
      font-size: 32px;
      font-weight: bold;
      margin: 10px 0;
    }
    .status-good { color: #28a745; }
    .status-warning { color: #ffc107; }
    .status-danger { color: #dc3545; }
    .status-info { color: #17a2b8; }
    .content-section {
      margin: 25px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .content-section h2 {
      color: #495057;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .content-section h3 {
      color: #6c757d;
      margin-top: 20px;
    }
    .status-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    .status-table th,
    .status-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }
    .status-table th {
      background-color: #e9ecef;
      font-weight: 600;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      text-align: center;
      color: #6c757d;
      font-size: 12px;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Program Status Update</h1>
      <p>Weekly Executive Report - $(date +"%B %d, %Y")</p>
      <p style="font-size: 14px;">Enhanced Clean Status Workflow - Issue #314</p>
    </div>

    <!-- Executive Summary (1-3 min read) -->
    <div style="padding: 25px 20px; background: #f8f9fa; border-bottom: 1px solid #e9ecef;">
      <h2 style="margin: 0 0 15px 0; color: #495057; font-size: 18px;">🎯 Executive Summary</h2>
      <div style="font-size: 16px; line-height: 1.7; color: #495057;">
        Program completion at <strong>${COMPLETION_RATE}%</strong> with <strong>${HIGH_PRIORITY}</strong> high-priority items requiring attention.
        Strategic progress at <strong>${STRATEGIC_PROGRESS}%</strong>.
        ${CRITICAL_RISKS} critical risks identified.
      </div>
    </div>

    <!-- Program-Level Component Overview -->
    <div style="padding: 20px;">
      <h3 style="margin: 0 0 15px 0; color: #495057;">📋 PM Tools Templates Program Overview</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; color: #495057; font-size: 14px; line-height: 1.6;">
          <strong>Program Mission:</strong> Transform from static template library into the world's most intelligent project management ecosystem through AI, blockchain, and data science innovations.
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background: #e9ecef;">
            <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #495057;">Program Component</th>
            <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #495057;">Status</th>
            <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #495057;">Progress</th>
            <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #495057;">Key Focus</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;"><strong>📊 Overall Program</strong></td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">$([ ${COMPLETION_RATE} -ge 75 ] && echo "🟢 On Track" || echo "🟡 Attention")</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">${COMPLETION_RATE}%</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">35 revolutionary enhancements across 5 phases</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;"><strong>🎯 Phase 1: Foundation</strong></td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">✅ Complete</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">100%</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">Quick Start Kits, Template Selector, Complexity Framework</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;"><strong>🚀 Q3 2025 Delivery Cycle</strong></td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">$([ ${STRATEGIC_PROGRESS} -ge 50 ] && echo "🟢 Active" || echo "🔴 Behind")</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">${STRATEGIC_PROGRESS}%</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">Executive Dashboards, Template Selector, Community Platform</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;"><strong>🧠 Phase 2: Intelligence</strong></td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">🔄 Planning</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">0%</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">AI Insights, Advanced Workflows, Multi-Platform</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;"><strong>🌟 Phase 3: Ecosystem</strong></td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">📋 Roadmap</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">0%</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e9ecef;">Template Marketplace, Certification, Enterprise Features</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Q3 2025 Delivery Timeline -->
    <div style="padding: 20px; background: #e7f3ff; border-left: 4px solid #007bff; margin: 20px 0;">
      <h3 style="margin: 0 0 20px 0; color: #004085; font-size: 16px;">📅 Q3 2025 Delivery Timeline</h3>

      <!-- Timeline visualization -->
      <div style="position: relative; padding: 20px 0; margin: 20px 0;">
        <div style="position: absolute; left: 50px; top: 0; bottom: 0; width: 2px; background: #e9ecef;"></div>

        <div style="position: relative; margin: 15px 0; padding-left: 80px;">
          <div style="position: absolute; left: 41px; top: 8px; width: 18px; height: 18px; border-radius: 50%; background: #28a745; border: 3px solid #fff; box-shadow: 0 0 0 2px #28a745;"></div>
          <div style="background: #f8f9fa; padding: 12px 15px; border-radius: 6px; border-left: 3px solid #28a745;">
            <div style="font-size: 11px; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Jul 1-15, 2025</div>
            <div style="font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">✅ Foundation Phase Complete</div>
            <div style="font-size: 12px; color: #6c757d; margin: 0; line-height: 1.4;">Template selector framework, complexity assessment tools, and quick-start kits delivered.</div>
          </div>
        </div>

        <div style="position: relative; margin: 15px 0; padding-left: 80px;">
          <div style="position: absolute; left: 41px; top: 8px; width: 18px; height: 18px; border-radius: 50%; background: #007bff; border: 3px solid #fff; box-shadow: 0 0 0 2px #007bff;"></div>
          <div style="background: #e7f3ff; padding: 12px 15px; border-radius: 6px; border-left: 3px solid #007bff;">
            <div style="font-size: 11px; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Jul 16-31, 2025</div>
            <div style="font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">🚀 Executive Dashboard Development</div>
            <div style="font-size: 12px; color: #6c757d; margin: 0; line-height: 1.4;">Enterprise reporting suite, advanced analytics, and stakeholder communication tools. <strong>In Progress: 65%</strong></div>
          </div>
        </div>

        <div style="position: relative; margin: 15px 0; padding-left: 80px;">
          <div style="position: absolute; left: 41px; top: 8px; width: 18px; height: 18px; border-radius: 50%; background: #f8f9fa; border: 3px solid #fff; box-shadow: 0 0 0 2px #dee2e6;"></div>
          <div style="background: #f8f9fa; padding: 12px 15px; border-radius: 6px; border-left: 3px solid #dee2e6;">
            <div style="font-size: 11px; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Aug 1-20, 2025</div>
            <div style="font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">🎨 Template Selector Enhancement</div>
            <div style="font-size: 12px; color: #6c757d; margin: 0; line-height: 1.4;">Interactive onboarding, guided template selection, and UX improvements. <strong>Starting Soon</strong></div>
          </div>
        </div>

        <div style="position: relative; margin: 15px 0; padding-left: 80px;">
          <div style="position: absolute; left: 41px; top: 8px; width: 18px; height: 18px; border-radius: 50%; background: #f8f9fa; border: 3px solid #fff; box-shadow: 0 0 0 2px #dee2e6;"></div>
          <div style="background: #f8f9fa; padding: 12px 15px; border-radius: 6px; border-left: 3px solid #dee2e6;">
            <div style="font-size: 11px; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Aug 21-31, 2025</div>
            <div style="font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">🤝 Community Platform Integration</div>
            <div style="font-size: 12px; color: #6c757d; margin: 0; line-height: 1.4;">User feedback systems, community engagement tools, and collaborative features.</div>
          </div>
        </div>

        <div style="position: relative; margin: 15px 0; padding-left: 80px;">
          <div style="position: absolute; left: 41px; top: 8px; width: 18px; height: 18px; border-radius: 50%; background: #f8f9fa; border: 3px solid #fff; box-shadow: 0 0 0 2px #dee2e6;"></div>
          <div style="background: #f8f9fa; padding: 12px 15px; border-radius: 6px; border-left: 3px solid #dee2e6;">
            <div style="font-size: 11px; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Sep 1-15, 2025</div>
            <div style="font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">🧪 Beta Testing & Refinement</div>
            <div style="font-size: 12px; color: #6c757d; margin: 0; line-height: 1.4;">User acceptance testing, performance optimization, and final preparations for launch.</div>
          </div>
        </div>

        <div style="position: relative; margin: 15px 0; padding-left: 80px;">
          <div style="position: absolute; left: 41px; top: 8px; width: 18px; height: 18px; border-radius: 50%; background: #f8f9fa; border: 3px solid #fff; box-shadow: 0 0 0 2px #dee2e6;"></div>
          <div style="background: #f8f9fa; padding: 12px 15px; border-radius: 6px; border-left: 3px solid #dee2e6;">
            <div style="font-size: 11px; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Sep 16-30, 2025</div>
            <div style="font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">🎉 Q3 Launch & Documentation</div>
            <div style="font-size: 12px; color: #6c757d; margin: 0; line-height: 1.4;">Public release, comprehensive documentation, and transition to Phase 2 planning.</div>
          </div>
        </div>
      </div>

      <!-- Data-dense delivery metrics table -->
      <div style="margin-top: 25px; padding: 15px; background: white; border-radius: 6px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #495057;">Q3 2025 Delivery Metrics</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 15px 0;">
          <thead>
            <tr>
              <th style="background: none; border: none; border-bottom: 1px solid #333; padding: 8px 12px 6px 0; text-align: left; font-weight: 600; color: #333;">Milestone</th>
              <th style="background: none; border: none; border-bottom: 1px solid #333; padding: 8px 12px 6px 0; text-align: left; font-weight: 600; color: #333;">Progress</th>
              <th style="background: none; border: none; border-bottom: 1px solid #333; padding: 8px 12px 6px 0; text-align: left; font-weight: 600; color: #333;">Risk</th>
              <th style="background: none; border: none; border-bottom: 1px solid #333; padding: 8px 12px 6px 0; text-align: left; font-weight: 600; color: #333;">Est. Completion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;">Executive Dashboards</td>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;">65% <div style="width: 60px; height: 3px; margin: 2px 0; background: #e9ecef; border-radius: 2px; overflow: hidden;"><div style="height: 100%; background: #28a745; width: 65%;"></div></div></td>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;"><span style="color: #28a745;">●</span> Low</td>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;">Jul 31</td>
            </tr>
            <tr>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;">Template Selector</td>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;">15% <div style="width: 60px; height: 3px; margin: 2px 0; background: #e9ecef; border-radius: 2px; overflow: hidden;"><div style="height: 100%; background: #ffc107; width: 15%;"></div></div></td>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;"><span style="color: #ffc107;">●</span> Med</td>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;">Aug 20</td>
            </tr>
            <tr>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;">Community Platform</td>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;">5% <div style="width: 60px; height: 3px; margin: 2px 0; background: #e9ecef; border-radius: 2px; overflow: hidden;"><div style="height: 100%; background: #dc3545; width: 5%;"></div></div></td>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;"><span style="color: #dc3545;">●</span> High</td>
              <td style="border: none; padding: 6px 12px 6px 0; border-bottom: 1px solid #f0f0f0;">Aug 31</td>
            </tr>
            <tr>
              <td style="border: none; padding: 6px 12px 6px 0;">Beta Testing</td>
              <td style="border: none; padding: 6px 12px 6px 0;">0% <div style="width: 60px; height: 3px; margin: 2px 0; background: #e9ecef; border-radius: 2px; overflow: hidden;"><div style="height: 100%; background: #e9ecef; width: 0%;"></div></div></td>
              <td style="border: none; padding: 6px 12px 6px 0;"><span style="color: #6c757d;">●</span> TBD</td>
              <td style="border: none; padding: 6px 12px 6px 0;">Sep 15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Critical Actions with Owners and Due Dates -->
    <div style="padding: 20px; background: #fff5f5; border-left: 4px solid #dc3545; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #721c24; font-size: 16px;">🚨 Critical Actions Required</h3>
      $([ ${HIGH_PRIORITY} -gt 10 ] && echo "<div style='padding: 8px 0; border-bottom: 1px solid #f5c6cb;'><div>• Prioritize resource allocation for ${HIGH_PRIORITY} high-priority items</div><div><span style='font-weight: 600; color: #495057;'>Owner: Program Manager</span> | <span style='color: #dc3545; font-weight: 600;'>Due: $(date -d '+3 days' '+%B %d')</span></div></div>" || echo "<div>• No critical actions at this time</div>")
      $([ ${STRATEGIC_PROGRESS} -lt 50 ] && echo "<div style='padding: 8px 0; border-bottom: 1px solid #f5c6cb;'><div>• Review strategic initiative blockers and resource constraints</div><div><span style='font-weight: 600; color: #495057;'>Owner: Executive Sponsor</span> | <span style='color: #dc3545; font-weight: 600;'>Due: $(date -d '+2 days' '+%B %d')</span></div></div>" || echo "")
      $([ ${CRITICAL_RISKS} -gt 0 ] && echo "<div style='padding: 8px 0;'><div>• Address ${CRITICAL_RISKS} critical program risks immediately</div><div><span style='font-weight: 600; color: #495057;'>Owner: Risk Manager</span> | <span style='color: #dc3545; font-weight: 600;'>Due: $(date -d '+1 day' '+%B %d')</span></div></div>" || echo "")
    </div>

    <!-- Dashboard Links -->
    <div style="padding: 20px; background: #e7f3ff; border-left: 4px solid #007bff;">
      <h3 style="margin: 0 0 15px 0; color: #004085; font-size: 16px;">🔗 Detailed Reports & Dashboards</h3>
      <div style="margin: 8px 0;"><a href="${PROGRAM_DASHBOARD_URL}" style="color: #007bff; text-decoration: none; font-weight: 500;">📊 Program Dashboard (Real-time)</a></div>
      <div style="margin: 8px 0;"><a href="${DETAILED_REPORTS_URL}" style="color: #007bff; text-decoration: none; font-weight: 500;">📈 Individual Project Reports</a></div>
      <div style="margin: 8px 0;"><a href="https://github.com/${GITHUB_REPOSITORY}/issues?q=is%3Aissue+is%3Aopen+label%3Acritical" style="color: #007bff; text-decoration: none; font-weight: 500;">⚠️ Critical Issues Tracker</a></div>
    </div>

    <div class="metrics">
      <div class="metric-card">
        <h3>📊 Completion</h3>
        <div class="metric-value status-good">${COMPLETION_RATE}%</div>
        <p>Overall Progress</p>
      </div>
      <div class="metric-card">
        <h3>🎯 Strategic</h3>
        <div class="metric-value status-danger">${STRATEGIC_PROGRESS}%</div>
        <p>Strategic Goals</p>
      </div>
      <div class="metric-card">
        <h3>⚠️ Priorities</h3>
        <div class="metric-value status-warning">${HIGH_PRIORITY}</div>
        <p>High Priority Items</p>
      </div>
      <div class="metric-card">
        <h3>🚨 Risks</h3>
        <div class="metric-value status-good">${CRITICAL_RISKS}</div>
        <p>Critical Issues</p>
      </div>
    </div>
EOF

# Add the full report content
if [ -f "$REPORT_FILE" ]; then
  echo '              <div class="content-section">' >> ./email/status-email.html
  echo '                <h2>📋 Full Status Report</h2>' >> ./email/status-email.html

  # Convert markdown sections to HTML
  sed -n '/## Executive Summary/,/## Key Highlights/p' "$REPORT_FILE" | \
  sed 's/## \(.*\)/<h3>\1<\/h3>/g' | \
  sed 's/| \(.*\) |/<tr><td>\1<\/td><\/tr>/g' | \
  sed 's/|--------|-------|--------|/<\/thead><tbody>/g' | \
  sed 's/| Metric | Value | Status |/<table class="status-table"><thead><tr><th>Metric<\/th><th>Value<\/th><th>Status<\/th><\/tr>/g' | \
  sed 's/^- /<li>/g' | \
  sed 's/^\*\*\(.*\):\*\* /<strong>\1:<\/strong> /g' >> ./email/status-email.html

  echo '                </tbody></table>' >> ./email/status-email.html
  echo '              </div>' >> ./email/status-email.html

  # Add Key Highlights section
  echo '              <div class="content-section">' >> ./email/status-email.html
  echo '                <h2>✨ Key Highlights</h2>' >> ./email/status-email.html
  sed -n '/### Accomplishments This Period/,/### Current Focus Areas/p' "$REPORT_FILE" | \
  sed 's/### \(.*\)/<h3>\1<\/h3>/g' | \
  sed 's/^- /<li>/g' | \
  sed 's/<li>\(.*\)/<ul><li>\1<\/li><\/ul>/g' >> ./email/status-email.html
  echo '              </div>' >> ./email/status-email.html

  # Add Current Focus section
  echo '              <div class="content-section">' >> ./email/status-email.html
  echo '                <h2>🎯 Current Focus Areas</h2>' >> ./email/status-email.html
  sed -n '/### Current Focus Areas/,/### Risks and Issues/p' "$REPORT_FILE" | \
  sed 's/### \(.*\)/<h3>\1<\/h3>/g' | \
  sed 's/^- /<li>/g' | \
  sed 's/<li>\(.*\)/<ul><li>\1<\/li><\/ul>/g' >> ./email/status-email.html
  echo '              </div>' >> ./email/status-email.html
else
  echo '              <div class="content-section">' >> ./email/status-email.html
  echo '                <h2>⚠️ Report Status</h2>' >> ./email/status-email.html
  echo '                <p>Status report file not found. Please check the workflow execution.</p>' >> ./email/status-email.html
  echo '              </div>' >> ./email/status-email.html
fi

# Close the HTML
cat >> ./email/status-email.html << 'EOF'
    <div class="footer">
      <p>🤖 Generated by PM Tools Clean Status Workflow</p>
      <p>📧 This is an automated status report from your project management system</p>
      <p>📊 For detailed metrics and analysis, visit your project dashboard</p>
    </div>
  </div>
</body>
</html>
EOF
