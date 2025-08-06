---
title: "Devsecops Template"
methodology: "universal"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# DevSecOps Integration Template

## Overview
This template provides a comprehensive framework for integrating security practices into DevOps workflows, covering security automation, vulnerability management, compliance, and security monitoring throughout the software development lifecycle.

## Template Information
- **Methodology:** DevSecOps (Development, Security, Operations)
- **Purpose:** Integrate security practices into DevOps workflows and automation
- **Audience:** Security Engineers, DevOps Teams, Development Teams, Compliance Teams
- **Timeline:** 12-20 weeks for full implementation
- **Prerequisites:** Existing DevOps practices, security awareness, compliance requirements

---

## DevSecOps Strategy Framework

### Security-First Approach

#### DevSecOps Principles
```
DevSecOps Foundation

Shift-Left Security:
├── Security by design
├── Early vulnerability detection
├── Security testing in CI/CD
└── Developer security training

Automation-First:
├── Automated security scanning
├── Policy as code enforcement
├── Automated compliance checking
└── Security orchestration

Continuous Monitoring:
├── Real-time threat detection
├── Security metrics tracking
├── Incident response automation
└── Compliance monitoring

Shared Responsibility:
├── Security as everyone's responsibility
├── Cross-functional security teams
├── Security champions program
└── Collaborative security culture
```

#### DevSecOps Maturity Model
| Level | Description | Characteristics | Security Practices |
|-------|-------------|-----------------|-------------------|
| Level 1 | Basic | Manual security checks | Periodic security reviews |
| Level 2 | Reactive | Some automated scanning | Vulnerability management |
| Level 3 | Proactive | Integrated security testing | Security in CI/CD |
| Level 4 | Predictive | Advanced threat detection | ML-based security |
| Level 5 | Adaptive | Self-healing security | Autonomous security |

### Security Integration Architecture

#### Security Layer Integration
```yaml
# DevSecOps Architecture Layers
security_layers:
  development_layer:
    description: "Security in development environment"
    components:
      - secure_coding: "Secure coding practices and guidelines"
      - sast: "Static Application Security Testing"
      - dependency_scanning: "Third-party dependency vulnerability scanning"
      - secret_management: "Secrets detection and management"
    tools: ["sonarqube", "snyk", "veracode", "trufflehog"]
    
  pipeline_layer:
    description: "Security in CI/CD pipelines"
    components:
      - dast: "Dynamic Application Security Testing"
      - container_scanning: "Container image vulnerability scanning"
      - infrastructure_scanning: "Infrastructure as Code security scanning"
      - compliance_testing: "Automated compliance validation"
    tools: ["owasp_zap", "trivy", "checkov", "inspec"]
    
  runtime_layer:
    description: "Security in production environment"
    components:
      - runtime_protection: "Runtime application self-protection"
      - threat_detection: "Real-time threat detection and response"
      - compliance_monitoring: "Continuous compliance monitoring"
      - incident_response: "Automated incident response"
    tools: ["falco", "wazuh", "splunk", "pagerduty"]
    
  governance_layer:
    description: "Security governance and policy"
    components:
      - policy_as_code: "Security policies as code"
      - risk_management: "Continuous risk assessment"
      - audit_logging: "Comprehensive audit trails"
      - training: "Security awareness and training"
    tools: ["opa", "aws_config", "cloudtrail", "security_training_platforms"]
```

---

## Security Testing Integration

### Static Application Security Testing (SAST)

#### SAST Pipeline Integration
```yaml
# CI/CD Pipeline Security Integration
sast_integration:
  pre_commit_hooks:
    - secret_detection: "Detect secrets before commit"
    - code_quality: "Static code analysis for security issues"
    - license_checking: "Check for license compliance"
    
  build_stage:
    - dependency_scanning: "Scan dependencies for vulnerabilities"
    - static_analysis: "Comprehensive static security analysis"
    - security_linting: "Security-focused code linting"
    
  quality_gates:
    - vulnerability_threshold: "Block builds with high/critical vulnerabilities"
    - code_coverage: "Ensure adequate test coverage"
    - security_hotspots: "Review security-sensitive code changes"
```

#### SonarQube Security Configuration
```yaml
# sonar-project.properties
sonar.projectKey=company-application
sonar.projectName=Company Application
sonar.projectVersion=1.0

# Source code settings
sonar.sources=src
sonar.tests=tests
sonar.exclusions=**/node_modules/**,**/vendor/**
sonar.test.exclusions=**/*_test.go,**/*.test.js

# Security-specific settings
sonar.security.hotspots.severity=BLOCKER
sonar.security.review.priority=HIGH

# Quality gate settings
sonar.qualitygate.wait=true
sonar.coverage.exclusions=**/*_test.go,**/main.go

# Security rules
sonar.security.rules=security
```

#### Snyk Integration Example
```yaml
# .github/workflows/security.yml
name: Security Scanning

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Upload result to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: snyk.sarif

      - name: Run Snyk to check Docker image
        uses: snyk/actions/docker@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          image: company/app:latest
          args: --severity-threshold=high
```

### Dynamic Application Security Testing (DAST)

#### OWASP ZAP Integration
```yaml
# k8s/security-testing/zap-baseline.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: zap-baseline-scan
  namespace: security-testing
spec:
  template:
    spec:
      containers:
      - name: zap-baseline
        image: owasp/zap2docker-stable:latest
        command: ["/bin/bash"]
        args:
          - -c
          - |
            zap-baseline.py -t https://app.staging.company.com \
              -J zap-baseline-report.json \
              -r zap-baseline-report.html \
              -x zap-baseline-report.xml \
              -I -d
        volumeMounts:
        - name: zap-reports
          mountPath: /zap/wrk
      volumes:
      - name: zap-reports
        persistentVolumeClaim:
          claimName: zap-reports-pvc
      restartPolicy: Never
  backoffLimit: 0
```

#### API Security Testing
```yaml
# security-testing/api-security-tests.yaml
api_security_tests:
  authentication_tests:
    - test: "JWT token validation"
      endpoint: "/api/v1/auth/validate"
      method: "POST"
      expected_response: 401
      payload: '{"token": "invalid_token"}'
      
    - test: "Rate limiting"
      endpoint: "/api/v1/users"
      method: "GET"
      requests_per_minute: 100
      expected_response: 429
      
  authorization_tests:
    - test: "RBAC enforcement"
      endpoint: "/api/v1/admin/users"
      method: "GET"
      user_role: "user"
      expected_response: 403
      
    - test: "Resource-based access control"
      endpoint: "/api/v1/users/{user_id}"
      method: "GET"
      user_id: "other_user"
      expected_response: 403
      
  input_validation_tests:
    - test: "SQL injection protection"
      endpoint: "/api/v1/search"
      method: "GET"
      query: "'; DROP TABLE users; --"
      expected_response: 400
      
    - test: "XSS protection"
      endpoint: "/api/v1/comments"
      method: "POST"
      payload: '{"comment": "<script>alert(\"xss\")</script>"}'
      expected_response: 400
```

### Container Security

#### Container Image Scanning
```yaml
# .github/workflows/container-security.yml
name: Container Security Scanning

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  container-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build -t app:${{ github.sha }} .

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'app:${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run Hadolint
        uses: hadolint/hadolint-action@v3.1.0
        with:
          dockerfile: Dockerfile
          format: sarif
          output-file: hadolint-results.sarif

      - name: Upload Hadolint scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: hadolint-results.sarif
```

#### Dockerfile Security Best Practices
```dockerfile
# Dockerfile with security best practices
FROM node:18-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build application
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine AS runner

# Security updates
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node health-check.js

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

#### Container Runtime Security
```yaml
# k8s/security/pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
  readOnlyRootFilesystem: true

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-default
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-communication
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: web-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: database
    ports:
    - protocol: TCP
      port: 5432
```

---

## Infrastructure Security

### Infrastructure as Code Security

#### Checkov Integration
```yaml
# .github/workflows/iac-security.yml
name: Infrastructure Security Scanning

on:
  push:
    paths:
      - 'terraform/**'
      - 'k8s/**'
  pull_request:
    paths:
      - 'terraform/**'
      - 'k8s/**'

jobs:
  iac-security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Checkov
        id: checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: .
          framework: terraform,kubernetes
          output_format: sarif
          output_file_path: checkov-results.sarif
          skip_check: CKV_AWS_20,CKV_AWS_57

      - name: Upload Checkov scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: checkov-results.sarif

      - name: Run tfsec
        uses: aquasecurity/tfsec-action@v1.0.0
        with:
          working_directory: terraform/
          soft_fail: true

      - name: Run kube-score
        run: |
          wget -O kube-score https://github.com/zegl/kube-score/releases/latest/download/kube-score_linux_amd64
          chmod +x kube-score
          find k8s/ -name "*.yaml" -exec ./kube-score score {} \;
```

#### Terraform Security Configuration
```hcl
# modules/security/main.tf
# KMS key for encryption
resource "aws_kms_key" "main" {
  description             = "KMS key for ${var.environment} environment"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      }
    ]
  })

  tags = merge(var.common_tags, {
    Name = "${var.environment}-kms-key"
  })
}

# Security group with restrictive rules
resource "aws_security_group" "app" {
  name_prefix = "${var.environment}-app-"
  vpc_id      = var.vpc_id

  # Ingress rules
  ingress {
    description = "HTTPS from ALB"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description = "Health check from ALB"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Egress rules
  egress {
    description = "HTTPS to internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Database access"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.database.id]
  }

  tags = merge(var.common_tags, {
    Name = "${var.environment}-app-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# WAF configuration
resource "aws_wafv2_web_acl" "main" {
  name  = "${var.environment}-web-acl"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "KnownBadInputsRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  tags = merge(var.common_tags, {
    Name = "${var.environment}-waf"
  })
}
```

### Secrets Management

#### AWS Secrets Manager Integration
```hcl
# modules/secrets/main.tf
resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "${var.environment}/app/secrets"
  description             = "Application secrets for ${var.environment}"
  recovery_window_in_days = 7
  kms_key_id             = var.kms_key_id

  replica {
    region = var.backup_region
  }

  tags = merge(var.common_tags, {
    Name = "${var.environment}-app-secrets"
  })
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    database_url = var.database_url
    api_key      = var.api_key
    jwt_secret   = var.jwt_secret
  })
}

# IAM role for secret access
resource "aws_iam_role" "secrets_access" {
  name = "${var.environment}-secrets-access-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "secrets_access" {
  name = "${var.environment}-secrets-access-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          aws_secretsmanager_secret.app_secrets.arn
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "secrets_access" {
  role       = aws_iam_role.secrets_access.name
  policy_arn = aws_iam_policy.secrets_access.arn
}
```

#### Kubernetes Secrets Integration
```yaml
# k8s/security/external-secrets.yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secretsmanager
  namespace: production
spec:
  provider:
    aws:
      service: SecretsManager
      region: <AWS_REGION> <!-- redacted by security sweep 2025-08-06 -->
      auth:
        serviceAccount:
          name: external-secrets-sa

---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: app-secrets
  namespace: production
spec:
  refreshInterval: 15s
  secretStoreRef:
    name: aws-secretsmanager
    kind: SecretStore
  target:
    name: app-secrets
    creationPolicy: Owner
  data:
    - secretKey: database-url
      remoteRef:
        key: production/app/secrets
        property: database_url
    - secretKey: api-key
      remoteRef:
        key: production/app/secrets
        property: api_key
    - secretKey: jwt-secret
      remoteRef:
        key: production/app/secrets
        property: jwt_secret
```

#### Secret Scanning
```yaml
# .github/workflows/secret-scanning.yml
name: Secret Scanning

on:
  push:
  pull_request:

jobs:
  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run TruffleHog
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
          extra_args: --debug --only-verified

      - name: Run GitLeaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}

      - name: Run detect-secrets
        run: |
          pip install detect-secrets
          detect-secrets scan --all-files --baseline .secrets.baseline
```

---

## Security Monitoring and Incident Response

### Runtime Security Monitoring

#### Falco Configuration
```yaml
# k8s/security/falco-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: falco-config
  namespace: falco-system
data:
  falco.yaml: |
    rules_file:
      - /etc/falco/falco_rules.yaml
      - /etc/falco/falco_rules.local.yaml
      - /etc/falco/k8s_audit_rules.yaml
      - /etc/falco/rules.d

    time_format_iso_8601: true
    json_output: true
    json_include_output_property: true

    log_stderr: true
    log_syslog: true
    log_level: info

    priority: debug
    buffered_outputs: false

    syscall_event_drops:
      actions:
        - log
        - alert
      rate: 0.03333
      max_burst: 1000

    outputs:
      rate: 1
      max_burst: 1000

    http_output:
      enabled: true
      url: "http://falcosidekick:2801/"

  custom_rules.yaml: |
    - rule: Detect crypto miners
      desc: Detect process that mine cryptocurrency
      condition: >
        spawned_process and 
        (proc.name in (crypto_miners) or
         proc.cmdline contains "stratum" or
         proc.cmdline contains "mining")
      output: >
        Cryptocurrency miner detected (user=%user.name command=%proc.cmdline 
        container=%container.info image=%container.image.repository)
      priority: CRITICAL
      tags: [cryptocurrency, malware]

    - rule: Detect outbound network activity
      desc: Detect suspicious outbound network connections
      condition: >
        outbound and not trusted_outbound_destinations and
        not proc.name in (allowed_outbound_processes)
      output: >
        Suspicious outbound connection (user=%user.name command=%proc.cmdline 
        connection=%fd.name container=%container.info)
      priority: WARNING
      tags: [network, suspicious]
```

#### Security Event Processing
```yaml
# security-monitoring/splunk-integration.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: splunk-forwarder
  namespace: security-monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: splunk-forwarder
  template:
    metadata:
      labels:
        app: splunk-forwarder
    spec:
      containers:
      - name: splunk-forwarder
        image: splunk/universalforwarder:latest
        env:
        - name: SPLUNK_START_ARGS
          value: "--accept-license --answer-yes"
        - name: SPLUNK_PASSWORD
          valueFrom:
            secretKeyRef:
              name: splunk-credentials
              key: password
        volumeMounts:
        - name: falco-logs
          mountPath: /var/log/falco
        - name: k8s-logs
          mountPath: /var/log/pods
          readOnly: true
        - name: splunk-config
          mountPath: /opt/splunkforwarder/etc/system/local
      volumes:
      - name: falco-logs
        hostPath:
          path: /var/log/falco
      - name: k8s-logs
        hostPath:
          path: /var/log/pods
      - name: splunk-config
        configMap:
          name: splunk-forwarder-config
```

### Security Incident Response

#### Automated Incident Response
```yaml
# incident-response/security-playbook.yaml
apiVersion: argoproj.io/v1alpha1
kind: WorkflowTemplate
metadata:
  name: security-incident-response
  namespace: security
spec:
  entrypoint: incident-response
  templates:
  - name: incident-response
    steps:
    - - name: detect-threat
        template: threat-detection
    - - name: isolate-container
        template: container-isolation
        when: "{{steps.detect-threat.outputs.parameters.threat-level}} == critical"
    - - name: collect-evidence
        template: evidence-collection
    - - name: notify-team
        template: team-notification

  - name: threat-detection
    script:
      image: security/threat-analyzer:latest
      command: [python]
      source: |
        import json
        import sys
        
        # Analyze security event
        event = json.loads('{{workflow.parameters.security-event}}')
        
        # Determine threat level
        threat_level = analyze_threat(event)
        
        # Output result
        result = {
            "threat-level": threat_level,
            "container-id": event.get("container_id"),
            "pod-name": event.get("pod_name")
        }
        
        print(json.dumps(result))

  - name: container-isolation
    script:
      image: kubectl:latest
      command: [sh]
      source: |
        # Isolate compromised container
        kubectl patch pod {{workflow.parameters.pod-name}} \
          -p '{"spec":{"containers":[{"name":"app","securityContext":{"readOnlyRootFilesystem":true}}]}}'
        
        # Apply network policy to block traffic
        kubectl apply -f - <<EOF
        apiVersion: networking.k8s.io/v1
        kind: NetworkPolicy
        metadata:
          name: isolate-{{workflow.parameters.pod-name}}
        spec:
          podSelector:
            matchLabels:
              app: {{workflow.parameters.pod-name}}
          policyTypes:
          - Ingress
          - Egress
        EOF

  - name: evidence-collection
    script:
      image: security/forensics:latest
      command: [sh]
      source: |
        # Collect container logs
        kubectl logs {{workflow.parameters.pod-name}} > /evidence/container.log
        
        # Collect process information
        kubectl exec {{workflow.parameters.pod-name}} -- ps aux > /evidence/processes.txt
        
        # Collect network connections
        kubectl exec {{workflow.parameters.pod-name}} -- netstat -an > /evidence/network.txt
        
        # Upload evidence to secure storage
        aws s3 cp /evidence/ s3://security-evidence-bucket/{{workflow.name}}/ --recursive

  - name: team-notification
    http:
      url: https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
      method: POST
      headers:
        Content-Type: application/json
      body: |
        {
          "text": "Security Incident Detected",
          "attachments": [
            {
              "color": "danger",
              "fields": [
                {
                  "title": "Threat Level",
                  "value": "{{workflow.parameters.threat-level}}",
                  "short": true
                },
                {
                  "title": "Affected Container",
                  "value": "{{workflow.parameters.pod-name}}",
                  "short": true
                }
              ]
            }
          ]
        }
```

#### Security Metrics and KPIs
```yaml
# security-metrics/security-dashboard.yaml
security_metrics:
  vulnerability_metrics:
    - metric: "total_vulnerabilities"
      description: "Total number of vulnerabilities detected"
      source: "vulnerability_scanners"
      frequency: "hourly"
      
    - metric: "critical_vulnerabilities"
      description: "Number of critical vulnerabilities"
      source: "vulnerability_scanners"
      frequency: "real-time"
      alert_threshold: 0
      
    - metric: "vulnerability_remediation_time"
      description: "Average time to remediate vulnerabilities"
      source: "ticket_system"
      frequency: "daily"
      target: "< 24 hours"
      
  security_incidents:
    - metric: "security_incidents_total"
      description: "Total number of security incidents"
      source: "siem_system"
      frequency: "real-time"
      
    - metric: "mean_time_to_detection"
      description: "Average time to detect security incidents"
      source: "siem_system"
      frequency: "daily"
      target: "< 15 minutes"
      
    - metric: "mean_time_to_response"
      description: "Average time to respond to incidents"
      source: "incident_management"
      frequency: "daily"
      target: "< 30 minutes"
      
  compliance_metrics:
    - metric: "compliance_score"
      description: "Overall compliance score"
      source: "compliance_scanner"
      frequency: "daily"
      target: "> 95%"
      
    - metric: "policy_violations"
      description: "Number of policy violations"
      source: "policy_engine"
      frequency: "real-time"
      alert_threshold: 0
```

---

## Compliance and Governance

### Policy as Code

#### Open Policy Agent (OPA) Configuration
```yaml
# k8s/security/opa-gatekeeper.yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredsecuritycontext
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredSecurityContext
      validation:
        openAPIV3Schema:
          type: object
          properties:
            runAsNonRoot:
              type: boolean
            readOnlyRootFilesystem:
              type: boolean
            allowPrivilegeEscalation:
              type: boolean
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredsecuritycontext
        
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not container.securityContext.runAsNonRoot
          msg := "Container must run as non-root user"
        }
        
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not container.securityContext.readOnlyRootFilesystem
          msg := "Container must have read-only root filesystem"
        }
        
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          container.securityContext.allowPrivilegeEscalation != false
          msg := "Container must not allow privilege escalation"
        }

---
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredSecurityContext
metadata:
  name: must-have-security-context
spec:
  match:
    kinds:
      - apiGroups: ["apps"]
        kinds: ["Deployment"]
  parameters:
    runAsNonRoot: true
    readOnlyRootFilesystem: true
    allowPrivilegeEscalation: false
```

#### Compliance Scanning
```yaml
# compliance/inspec-profile.rb
# InSpec compliance profile for security requirements

control 'system-01' do
  impact 1.0
  title 'Ensure system is up to date'
  desc 'System packages should be updated regularly'
  
  describe command('apt list --upgradable') do
    its('stdout') { should_not match /upgradable/ }
  end
end

control 'docker-01' do
  impact 1.0
  title 'Ensure Docker is configured securely'
  desc 'Docker daemon should be configured with security best practices'
  
  describe json('/etc/docker/daemon.json') do
    its(['log-driver']) { should eq 'json-file' }
    its(['log-opts', 'max-size']) { should eq '10m' }
    its(['log-opts', 'max-file']) { should eq '3' }
  end
end

control 'k8s-01' do
  impact 1.0
  title 'Ensure Kubernetes is configured securely'
  desc 'Kubernetes cluster should follow security best practices'
  
  describe yaml('/etc/kubernetes/manifests/kube-apiserver.yaml') do
    its(['spec', 'containers', 0, 'command']) { should include '--audit-log-path=/var/log/audit.log' }
    its(['spec', 'containers', 0, 'command']) { should include '--audit-log-maxage=30' }
  end
end

control 'network-01' do
  impact 1.0
  title 'Ensure network security'
  desc 'Network should be properly secured'
  
  describe port(22) do
    it { should_not be_listening }
  end
  
  describe iptables do
    it { should have_rule('-P INPUT DROP') }
    it { should have_rule('-P FORWARD DROP') }
  end
end
```

### Audit Logging

#### Comprehensive Audit Configuration
```yaml
# audit-logging/audit-policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # Log security-related events at Request level
  - level: Request
    namespaces: ["kube-system", "security"]
    resources:
    - group: ""
      resources: ["secrets", "configmaps"]
    - group: "rbac.authorization.k8s.io"
      resources: ["roles", "rolebindings", "clusterroles", "clusterrolebindings"]

  # Log all authentication events
  - level: Request
    users: ["system:unauthenticated"]
    namespaces: [""]
    
  # Log admin activities
  - level: Request
    userGroups: ["system:masters"]

  # Log pod creation and deletion
  - level: Request
    resources:
    - group: ""
      resources: ["pods"]
    verbs: ["create", "delete", "patch"]

  # Log service account token access
  - level: Request
    resources:
    - group: ""
      resources: ["serviceaccounts/token"]

  # Default rule - log at Metadata level
  - level: Metadata
    omitStages:
      - RequestReceived
```

#### Audit Log Processing
```yaml
# audit-processing/fluentd-audit.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-audit-config
  namespace: logging
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/audit/audit.log
      pos_file /var/log/fluentd-audit.log.pos
      tag kubernetes.audit
      format json
      time_key timestamp
      time_format %Y-%m-%dT%H:%M:%S.%NZ
    </source>

    <filter kubernetes.audit>
      @type record_transformer
      <record>
        cluster_name "#{ENV['CLUSTER_NAME']}"
        environment "#{ENV['ENVIRONMENT']}"
      </record>
    </filter>

    # Send critical security events to SIEM
    <match kubernetes.audit>
      @type copy
      <store>
        @type splunk_hec
        hec_host splunk.company.com
        hec_port 8088
        hec_token "#{ENV['SPLUNK_HEC_TOKEN']}"
        index k8s_audit
        source fluentd
      </store>
      <store>
        @type s3
        aws_key_id "#{ENV['AWS_ACCESS_KEY_ID']}"
        aws_sec_key "#{ENV['AWS_SECRET_ACCESS_KEY']}"
        s3_bucket audit-logs-bucket
        s3_region us-west-2
        path audit/%Y/%m/%d/
        time_slice_format %Y%m%d%H
        time_slice_wait 10m
      </store>
    </match>
```

---

## Security Training and Culture

### Security Champions Program

#### Security Champions Framework
```yaml
# security-training/champions-program.yaml
security_champions_program:
  objectives:
    - "Embed security knowledge across development teams"
    - "Create security advocates and mentors"
    - "Improve security awareness and practices"
    - "Bridge gap between security and development"
    
  responsibilities:
    - "Conduct security reviews for their team"
    - "Participate in threat modeling sessions"
    - "Provide security training to team members"
    - "Stay updated on security best practices"
    - "Report security issues and concerns"
    
  selection_criteria:
    - "Interest in security topics"
    - "Good communication skills"
    - "Team leadership qualities"
    - "Technical proficiency"
    - "Commitment to continuous learning"
    
  training_modules:
    - module: "Secure Coding Practices"
      duration: "4 hours"
      topics: ["Input validation", "Authentication", "Authorization", "Cryptography"]
      
    - module: "Threat Modeling"
      duration: "3 hours"
      topics: ["STRIDE methodology", "Attack trees", "Risk assessment"]
      
    - module: "Security Testing"
      duration: "4 hours"
      topics: ["SAST", "DAST", "IAST", "Penetration testing"]
      
    - module: "Incident Response"
      duration: "2 hours"
      topics: ["Incident classification", "Response procedures", "Evidence collection"]
```

#### Security Awareness Metrics
```yaml
# security-metrics/awareness-metrics.yaml
security_awareness_metrics:
  training_metrics:
    - metric: "training_completion_rate"
      description: "Percentage of employees who completed security training"
      target: "> 95%"
      frequency: "quarterly"
      
    - metric: "security_assessment_scores"
      description: "Average scores on security knowledge assessments"
      target: "> 85%"
      frequency: "quarterly"
      
  behavioral_metrics:
    - metric: "phishing_click_rate"
      description: "Percentage of employees who click on simulated phishing emails"
      target: "< 5%"
      frequency: "monthly"
      
    - metric: "security_incident_reports"
      description: "Number of security incidents reported by employees"
      target: "Increasing trend"
      frequency: "monthly"
      
    - metric: "security_policy_violations"
      description: "Number of security policy violations"
      target: "Decreasing trend"
      frequency: "monthly"
```

---

## Continuous Improvement

### Security Maturity Assessment

#### DevSecOps Maturity Scorecard
| Category | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
|----------|---------|---------|---------|---------|---------|
| Security Testing | Manual testing | Basic SAST | Integrated SAST/DAST | Advanced testing | AI-driven testing |
| Vulnerability Management | Reactive patching | Scheduled scanning | Automated scanning | Risk-based prioritization | Predictive analysis |
| Incident Response | Manual response | Basic automation | Orchestrated response | Self-healing systems | Autonomous response |
| Compliance | Manual audits | Automated scanning | Continuous monitoring | Adaptive compliance | Predictive compliance |
| Culture | Security awareness | Security training | Security champions | Security-first mindset | Security innovation |

### Security Improvement Roadmap

#### Quarterly Security Initiatives
```yaml
# security-roadmap/quarterly-initiatives.yaml
q1_initiatives:
  - name: "Implement SAST in CI/CD"
    priority: "High"
    effort: "4 weeks"
    dependencies: ["CI/CD pipeline", "Tool selection"]
    success_criteria: ["100% code coverage", "< 2 min scan time"]
    
  - name: "Container security scanning"
    priority: "High"
    effort: "3 weeks"
    dependencies: ["Container registry", "Scanning tools"]
    success_criteria: ["Zero critical vulnerabilities", "Automated blocking"]

q2_initiatives:
  - name: "Dynamic security testing"
    priority: "Medium"
    effort: "6 weeks"
    dependencies: ["Test environments", "DAST tools"]
    success_criteria: ["Automated API testing", "Integration with CD"]
    
  - name: "Security metrics dashboard"
    priority: "Medium"
    effort: "4 weeks"
    dependencies: ["Monitoring tools", "Data sources"]
    success_criteria: ["Real-time visibility", "Automated reporting"]

q3_initiatives:
  - name: "Infrastructure security automation"
    priority: "High"
    effort: "8 weeks"
    dependencies: ["IaC tools", "Policy definitions"]
    success_criteria: ["Policy as code", "Automated remediation"]
    
  - name: "Security champions program"
    priority: "Medium"
    effort: "12 weeks"
    dependencies: ["Training materials", "Champion selection"]
    success_criteria: ["25% team coverage", "Measurable improvement"]

q4_initiatives:
  - name: "Advanced threat detection"
    priority: "Medium"
    effort: "10 weeks"
    dependencies: ["ML platform", "Security data"]
    success_criteria: ["Reduced false positives", "Faster detection"]
    
  - name: "Compliance automation"
    priority: "High"
    effort: "6 weeks"
    dependencies: ["Compliance requirements", "Automation tools"]
    success_criteria: ["Automated reporting", "Continuous compliance"]
```

---

## Related Templates
- [CI/CD Pipeline Planning](./cicd_pipeline_planning_template.md)
- [Release Management Workflow](./release_management_template.md)
- [DevOps Monitoring and Alerting](./monitoring_alerting_template.md)
- [Infrastructure as Code](./infrastructure_as_code_template.md)
- [Security Engineer Toolkit](../../role-based-toolkits/security-engineer/README.md)

---

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Date] | Initial DevSecOps Integration template | [Author] |

---

*This template is part of the PM Tools Templates library. For more information and additional templates, visit [repository root](../../../README.md).*

