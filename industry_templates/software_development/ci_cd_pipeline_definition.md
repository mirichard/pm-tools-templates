# CI/CD PIPELINE DEFINITION

## Document Control Information
**Document Title:** CI/CD Pipeline Definition Template  
**Project Name:** *[Project Name]*  
**Document Version:** 1.0  
**Prepared By:** *[Name], [Title]*  
**Preparation Date:** *YYYY-MM-DD*  
**Last Updated By:** *[Name], [Title]*  
**Last Revision Date:** *YYYY-MM-DD*  

---

## Overview

This document defines the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the project. The pipeline automates the process of integrating code changes, running tests, and deploying to various environments. This ensures consistent, repeatable, and reliable software delivery.

**Purpose:**
- Standardize the build, test, and deployment processes
- Automate quality checks and security scans
- Provide rapid feedback to developers
- Enable frequent, reliable releases
- Maintain consistency across environments
- Create audit trail for all changes

---

## Pipeline Architecture

### Pipeline Diagram

```
[Include a visual representation of your CI/CD pipeline here]

Example:
┌─────────────┐     ┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌────────────┐
│ Source Code │────►│   Build  │────►│   Test   │────►│ Quality Gates │────►│ Deployment │
└─────────────┘     └──────────┘     └──────────┘     └──────────────┘     └────────────┘
       │                                                                          │
       │                                                                          │
       ▼                                                                          ▼
┌─────────────┐                                                          ┌────────────┐
│ Versioning  │                                                          │ Monitoring │
└─────────────┘                                                          └────────────┘
```

### CI/CD Tools & Technologies

| Component | Tool/Technology | Purpose | Version |
|-----------|-----------------|---------|---------|
| Source Control | *[e.g., GitHub, GitLab]* | Code repository | *[Version]* |
| CI/CD Platform | *[e.g., Jenkins, GitHub Actions, GitLab CI]* | Pipeline orchestration | *[Version]* |
| Build Tool | *[e.g., Maven, Gradle, npm]* | Compile and package code | *[Version]* |
| Artifact Repository | *[e.g., Nexus, Artifactory]* | Store build artifacts | *[Version]* |
| Testing Framework | *[e.g., JUnit, Jest, Selenium]* | Run automated tests | *[Version]* |
| Code Quality | *[e.g., SonarQube, ESLint]* | Static code analysis | *[Version]* |
| Security Scanning | *[e.g., OWASP Dependency Check, Snyk]* | Vulnerability detection | *[Version]* |
| Infrastructure as Code | *[e.g., Terraform, CloudFormation]* | Environment provisioning | *[Version]* |
| Container Registry | *[e.g., Docker Hub, ECR]* | Store container images | *[Version]* |
| Deployment Tool | *[e.g., Kubernetes, AWS CodeDeploy]* | Application deployment | *[Version]* |
| Monitoring | *[e.g., Prometheus, New Relic]* | Application monitoring | *[Version]* |

---

## Pipeline Stages and Steps

### 1. Source Code Management

**Purpose:** Manage code changes and trigger the pipeline

**Steps:**
- [ ] Branch creation/commit detection
- [ ] Code checkout
- [ ] Merge conflict detection
- [ ] Changelog generation

**Triggers:**
- [ ] Pull/Merge request creation
- [ ] Commit to specific branches (e.g., develop, main)
- [ ] Scheduled runs (e.g., nightly builds)
- [ ] Manual execution

### 2. Build

**Purpose:** Compile and package the application

**Steps:**
- [ ] Dependency resolution
- [ ] Compilation
- [ ] Resource processing
- [ ] Packaging (JAR, WAR, container image, etc.)
- [ ] Artifact versioning
- [ ] Artifact publication

**Outputs:**
- Compiled application
- Build metadata
- Container images
- Deployment packages

### 3. Unit Testing

**Purpose:** Verify individual components function correctly

**Steps:**
- [ ] Execute unit tests
- [ ] Generate test reports
- [ ] Measure code coverage
- [ ] Fail build if coverage thresholds not met

**Metrics:**
- Test pass/fail count
- Code coverage percentage
- Test execution time

### 4. Static Code Analysis

**Purpose:** Identify code quality issues and security vulnerabilities

**Steps:**
- [ ] Run static code analyzers
- [ ] Check coding standards compliance
- [ ] Identify code smells and technical debt
- [ ] Security vulnerability scanning
- [ ] Dependency vulnerability checking
- [ ] License compliance verification

**Quality Gates:**
- Zero critical issues
- Code coverage > XX%
- Duplication < XX%
- Complexity thresholds
- No vulnerable dependencies

### 5. Integration Testing

**Purpose:** Verify components work together correctly

**Steps:**
- [ ] Deploy to test environment
- [ ] Execute integration tests
- [ ] API contract testing
- [ ] Database integration testing
- [ ] External service integration testing

**Environments:**
- Integration test environment

### 6. Artifact Management

**Purpose:** Store and manage build artifacts

**Steps:**
- [ ] Upload artifacts to repository
- [ ] Tag artifacts with metadata
- [ ] Archive build artifacts
- [ ] Link artifacts to build information

**Repository Structure:**
- *[Define repository organization]*

### 7. Deployment to Testing/QA

**Purpose:** Deploy to testing/QA environment for manual testing

**Steps:**
- [ ] Environment preparation
- [ ] Configuration generation
- [ ] Database schema updates
- [ ] Application deployment
- [ ] Smoke tests
- [ ] Notification to QA team

**Environments:**
- QA/Testing environment

### 8. Automated UI/Functional Testing

**Purpose:** Verify application functionality and user interface

**Steps:**
- [ ] Execute UI automation tests
- [ ] Run end-to-end tests
- [ ] Execute user acceptance test scripts
- [ ] Generate test reports

**Test Types:**
- UI automation tests
- End-to-end tests
- User journey tests

### 9. Performance Testing

**Purpose:** Verify application meets performance requirements

**Steps:**
- [ ] Load testing
- [ ] Stress testing
- [ ] Endurance testing
- [ ] Performance metrics collection
- [ ] Performance regression detection

**Metrics:**
- Response time
- Throughput
- Error rate
- Resource utilization

### 10. Security Testing

**Purpose:** Identify security vulnerabilities

**Steps:**
- [ ] Dynamic Application Security Testing (DAST)
- [ ] Interactive Application Security Testing (IAST)
- [ ] Security scanning
- [ ] Penetration testing
- [ ] Security compliance checks

**Security Gates:**
- No critical vulnerabilities
- Compliance with security standards
- Secure configuration validation

### 11. Approval Gates

**Purpose:** Manual approval for production deployment

**Steps:**
- [ ] Notification to approvers
- [ ] Review of test results
- [ ] Approval/rejection decision
- [ ] Documentation of approval

**Approvers:**
- *[List approver roles]*

### 12. Deployment to Production

**Purpose:** Deploy the application to production

**Steps:**
- [ ] Pre-deployment backup
- [ ] Environment preparation
- [ ] Blue/Green or Canary deployment setup
- [ ] Database migrations
- [ ] Application deployment
- [ ] Smoke testing
- [ ] Health monitoring
- [ ] Rollback procedures (if needed)

**Deployment Strategy:**
- *[Specify deployment strategy - Blue/Green, Canary, etc.]*

### 13. Post-Deployment Verification

**Purpose:** Verify successful deployment

**Steps:**
- [ ] Execute smoke tests
- [ ] Validate critical business processes
- [ ] Monitor application health
- [ ] Check error rates
- [ ] Synthetic transaction monitoring

**Verification Criteria:**
- All smoke tests pass
- Error rate within threshold
- Response times within SLA

### 14. Notification and Documentation

**Purpose:** Inform stakeholders and document the release

**Steps:**
- [ ] Update release documentation
- [ ] Generate release notes
- [ ] Notify stakeholders
- [ ] Update knowledge base
- [ ] Archive deployment artifacts

**Notification Channels:**
- *[List notification methods]*

---

## Environment Configurations

### Development Environment

**Purpose:** Development and initial testing

**Configuration:**
- **Infrastructure:** *[Describe infrastructure]*
- **Scale:** *[Describe scale - instance types, node counts, etc.]*
- **Data:** *[Describe data approach - anonymized, subset, etc.]*
- **Access:** *[Describe access controls]*
- **Deployment Frequency:** Continuous (multiple times per day)
- **Deployment Trigger:** Automated on commit/merge

**Environment-Specific Variables:**
```
ENV=development
LOG_LEVEL=debug
FEATURE_FLAGS={"newFeature": true, "experimentalUI": true}
```

### Testing/QA Environment

**Purpose:** Quality assurance and testing

**Configuration:**
- **Infrastructure:** *[Describe infrastructure]*
- **Scale:** *[Describe scale]*
- **Data:** *[Describe data approach]*
- **Access:** *[Describe access controls]*
- **Deployment Frequency:** Daily or on demand
- **Deployment Trigger:** Automated after successful build and tests, or manual

**Environment-Specific Variables:**
```
ENV=testing
LOG_LEVEL=info
FEATURE_FLAGS={"newFeature": true, "experimentalUI": true}
```

### Staging Environment

**Purpose:** Pre-production verification and performance testing

**Configuration:**
- **Infrastructure:** *[Describe infrastructure - ideally production-like]*
- **Scale:** *[Describe scale - typically scaled-down production]*
- **Data:** *[Describe data approach - anonymized production or production-like]*
- **Access:** *[Describe access controls]*
- **Deployment Frequency:** Per release cycle or on demand
- **Deployment Trigger:** Manual or automated as part of release

**Environment-Specific Variables:**
```
ENV=staging
LOG_LEVEL=info
FEATURE_FLAGS={"newFeature": true, "experimentalUI": false}
```

### Production Environment

**Purpose:** Live application serving real users

**Configuration:**
- **Infrastructure:** *[Describe infrastructure]*
- **Scale:** *[Describe scale]*
- **Data:** Production data
- **Access:** *[Describe access controls - typically highly restricted]*
- **Deployment Frequency:** According to release schedule
- **Deployment Trigger:** Manual approval after successful staging deployment

**Environment-Specific Variables:**
```
ENV=production
LOG_LEVEL=warning
FEATURE_FLAGS={"newFeature": false, "experimentalUI": false}
```

### DR/Backup Environment

**Purpose:** Disaster recovery

**Configuration:**
- **Infrastructure:** *[Describe infrastructure]*
- **Scale:** *[Describe scale]*
- **Data:** Replicated from production
- **Access:** *[Describe access controls]*
- **Deployment Frequency:** In sync with production or on disaster event
- **Deployment Trigger:** Automated with production or manual in DR scenario

---

## Security and Quality Gates

### Code Quality Gates

| Gate | Threshold | Blocking | Measurement Tool |
|------|-----------|----------|-----------------|
| Code Coverage | >= 80% | Yes | *[Tool name]* |
| Duplication | < 5% | Yes | *[Tool name]* |
| Complexity (Cyclomatic) | <= 15 per method | Yes | *[Tool name]* |
| Technical Debt Ratio | < 5% | No | *[Tool name]* |
| Documentation Coverage | >= 70% | No | *[Tool name]* |
| Style Guide Compliance | 0 violations | Yes | *[Tool name]* |

### Security Gates

| Gate | Threshold | Blocking | Measurement Tool |
|------|-----------|----------|-----------------|
| Critical Vulnerabilities | 0 | Yes | *[Tool name]* |
| High Vulnerabilities | 0 | Yes | *[Tool name]* |
| Medium Vulnerabilities | < 5 | No | *[Tool name]* |
| OWASP Top 10 Issues | 0 | Yes | *[Tool name]* |
| Secrets in Code | 0 | Yes | *[Tool name]* |
| Outdated Dependencies | 0 critical | Yes | *[Tool name]* |

### Performance Gates

| Gate | Threshold | Blocking | Measurement Tool |
|------|-----------|----------|-----------------|
| Response Time (P95) | < 500ms | Yes | *[Tool name]* |
| Error Rate | < 0.1% | Yes | *[Tool name]* |
| CPU Utilization | < 70% | No | *[Tool name]* |
| Memory Utilization | < 80% | No | *[Tool name]* |
| Throughput | > 100 req/sec | No | *[Tool name]* |

### Compliance Gates

| Gate | Threshold | Blocking | Measurement Tool |
|------|-----------|----------|-----------------|
| Accessibility Compliance | WCAG 2.1 AA | Yes | *[Tool name]* |
| License Compliance | No unauthorized licenses | Yes | *[Tool name]* |
| Regulatory Requirements | 100% compliant | Yes | *[Tool name]* |

---

## Deployment Strategies

### Blue-Green Deployment

**Description:** Maintain two identical production environments, only one of which is live at any time. This enables zero-downtime deployments and easy rollbacks.

**Implementation:**
1. Deploy new version to inactive environment (Green)
2. Run smoke tests on Green environment
3. Switch traffic from active (Blue) to Green environment
4. Monitor for issues
5. If problems occur, switch back to Blue environment
6. If successful, the Green environment becomes the new Blue for the next deployment

**Best for:**
- Zero-downtime requirements
- Applications with database compatibility across versions
- When quick rollback capability is essential

### Canary Deployment

**Description:** Gradually route a small percentage of traffic to the new version, monitoring for issues before full deployment.

**Implementation:**
1. Deploy new version alongside the current version
2. Route a small percentage (e.g., 5%) of traffic to the new version
3. Monitor for errors, performance issues, and business metrics
4. Gradually increase traffic to the new version if no issues are detected
5. If problems occur, route all traffic back to the old version
6. Once 100% of traffic is on the new version, remove the old version

**Best for:**
- Reducing risk with high-traffic applications
- Getting early user feedback
- Validating performance in production environment

### Rolling Deployment

**Description:** Gradually replace instances of the old version with the new version.

**Implementation:**
1. Take a subset of servers out of the load balancer
2. Deploy new version to those servers
3. Add updated servers back to the load balancer
4. Repeat until all servers are updated

**Best for:**
- Stateful applications
- When resources are constrained
- Kubernetes-based deployments

### Feature Flags

**Description:** Use code-level toggles to enable or disable features without redeployment.

**Implementation:**
1. Implement feature flag framework in application
2. Develop new features behind feature flags (disabled by default)
3. Deploy code to production with features disabled
4. Enable features gradually or for specific user segments
5. Monitor and disable if issues occur

**Best for:**
- Decoupling deployment from feature release
- A/B testing
- Gradual feature rollout
- Trunk-based development

---

## Rollback Procedures

### Automated Rollback Triggers

- Error rate exceeds 1% for 5 minutes
- Response time exceeds SLA for 5 minutes
- Critical business transaction failure
- Security vulnerability detected

### Rollback Methods

**Deployment Rollback:**
1. Revert to previous known-good deployment artifact
2. Re-deploy using the same pipeline
3. Verify rollback success
4. Notify stakeholders

**Database Rollback:**
1. Execute downgrade scripts
2. Verify database integrity
3. Sync with application version

**Feature Flag Rollback:**
1. Disable problematic feature flags
2. Verify application functionality
3. Update feature flag documentation

---

## Monitoring and Observability

### Key Metrics to Monitor

**Application Metrics:**
- Request rate
- Error rate
- Response time
- Active users
- Business transactions

**Infrastructure Metrics:**
- CPU usage
- Memory usage
- Disk I/O
- Network throughput
- Connection pool usage

**Database Metrics:**
- Query performance
- Connection count
- Lock contention
- Index usage
- Transaction volume

### Logging Strategy

**Log Levels:**
- ERROR: System errors requiring immediate attention
- WARNING: Potentially harmful situations
- INFO: General operational information
- DEBUG: Detailed information for debugging

**Log Format:**
```
{timestamp} {level} {service} {traceId} {message} {context}
```

**Log Storage:**
- Retention period: 30 days for normal logs, 1 year for security logs
- Storage location: *[Specify log storage]*

### Alerting Strategy

**Alert Severity Levels:**
- Critical: Immediate action required (24/7)
- High: Action required within 1 hour
- Medium: Action required within 1 business day
- Low: No immediate action required

**Alert Channels:**
- Critical: Phone call, SMS, and email
- High: SMS and email
- Medium: Email
- Low: Dashboard only

---

## Sample Pipeline Configurations

### Sample 1: Web Application Pipeline (GitHub Actions)

```yaml
name: Web Application CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Build
        run: npm run build
        
      - name: Unit tests
        run: npm test
        
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/

  code-quality:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          
      - name: Security scan
        uses: snyk/actions/node@master
        with:
          args: --severity-threshold=high

  integration-tests:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: build
          path: build
          
      - name: Set up test environment
        run: docker-compose -f docker-compose.test.yml up -d
        
      - name: Run integration tests
        run: npm run test:integration
        
      - name: Tear down test environment
        run: docker-compose -f docker-compose.test.yml down

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: [code-quality, integration-tests]
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: build
          path: build
          
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
          
      - name: Deploy to S3
        run: aws s3 sync build/ s3://staging-bucket --delete
        
      - name: Invalidate CloudFront cache
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.STAGING_DISTRIBUTION_ID }} --paths "/*"
        
      - name: Run smoke tests
        run: npm run test:smoke -- --url https://staging.example.com

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: [code-quality, integration-tests]
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: build
          path: build
          
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
          
      - name: Deploy to S3 (Blue/Green - Green deployment)
        run: aws s3 sync build/ s3://production-green-bucket --delete
        
      - name: Run smoke tests on Green
        run: npm run test:smoke -- --url https://green.example.com
        
      - name: Switch traffic to Green
        run: aws cloudformation update-stack --stack-name traffic-routing --template-body file://cloudformation/switch-to-green.yml
        
      - name: Run post-deployment tests
        run: npm run test:post-deploy -- --url https://www.example.com
```

### Sample 2: Microservice Pipeline (GitLab CI)

```yaml
stages:
  - build
  - test
  - security
  - deploy-staging
  - performance
  - approval
  - deploy-production
  - post-deploy

variables:
  DOCKER_REGISTRY: registry.example.com
  IMAGE_NAME: my-microservice
  IMAGE_TAG: $CI_COMMIT_SHORT_SHA

build:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  script:
    - docker build -t $DOCKER_REGISTRY/$IMAGE_NAME:$IMAGE_TAG .
    - docker push $DOCKER_REGISTRY/$IMAGE_NAME:$IMAGE_TAG
  artifacts:
    paths:
      - build-info.json

unit-tests:
  stage: test
  image: maven:3.8.5-openjdk-17
  script:
    - mvn test
  artifacts:
    paths:
      - target/surefire-reports/
    reports:
      junit: target/surefire-reports/TEST-*.xml

code-quality:
  stage: test
  image: sonarsource/sonar-scanner-cli:latest
  script:
    - sonar-scanner -Dsonar.projectKey=$CI_PROJECT_NAME -Dsonar.sources=. -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.login=$SONAR_TOKEN
  allow_failure: false

security-scan:
  stage: security
  image: owasp/zap2docker-stable
  script:
    - zap-baseline.py -t https://staging.example.com -g gen.conf -r security-report.html
  artifacts:
    paths:
      - security-report.html
  allow_failure: true

deploy-staging:
  stage: deploy-staging
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context staging
    - envsubst < kubernetes/deployment.yml | kubectl apply -f -
    - kubectl rollout status deployment/$IMAGE_NAME
  environment:
    name: staging
    url: https://staging.example.com

performance-test:
  stage: performance
  image: gatling/gatling:3.7.6
  script:
    - gatling -s PerformanceTest -rf ./results
  artifacts:
    paths:
      - ./results
  allow_failure: true

production-approval:
  stage: approval
  script:
    - echo "Waiting for approval"
  when: manual
  allow_failure: false

canary-deployment:
  stage: deploy-production
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context production
    - envsubst < kubernetes/canary-deployment.yml | kubectl apply -f -
    - sleep 60
    - kubectl rollout status deployment/$IMAGE_NAME-canary
  environment:
    name: production-canary
    url: https://www.example.com

canary-analysis:
  stage: deploy-production
  script:
    - python3 scripts/analyze-canary-metrics.py
    - if [ $? -eq 0 ]; then echo "Canary analysis successful"; else exit 1; fi
  after_script:
    - if [ $CI_JOB_STATUS == "success" ]; then
        kubectl config use-context production;
        envsubst < kubernetes/production-deployment.yml | kubectl apply -f -;
        kubectl rollout status deployment/$IMAGE_NAME;
      else
        kubectl config use-context production;
        kubectl delete deployment/$IMAGE_NAME-canary;
      fi
  environment:
    name: production
    url: https://www.example.com

post-deployment-verification:
  stage: post-deploy
  script:
    - curl -s https://www.example.com/health | grep "UP"
    - npm run test:smoke -- --url https://www.example.com
  environment:
    name: production
    url: https://www.example.com
```

### Sample 3: Mobile App Pipeline (Azure DevOps)

```yaml
trigger:
  branches:
    include:
    - main
    - develop
    - feature/*

pool:
  vmImage: 'macos-latest'

variables:
  buildConfiguration: 'Release'
  appCenterSlug: 'organization/app-name'

stages:
- stage: Build
  jobs:
  - job: BuildApp
    steps:
    - task: UseDotNet@2
      inputs:
        packageType: 'sdk'
        version: '6.0.x'
        
    - task: NuGetToolInstaller@1
    
    - task: NuGetCommand@2
      inputs:
        command: 'restore'
        restoreSolution: '**/*.sln'
        
    - task: XamarinAndroid@1
      inputs:
        projectFile: '**/*droid*.csproj'
        outputDirectory: '$(build.binariesDirectory)/android'
        configuration: '$(buildConfiguration)'
        
    - task: XamariniOS@2
      inputs:
        solutionFile: '**/*.sln'
        configuration: '$(buildConfiguration)'
        packageApp: true
        buildForSimulator: false
        
    - task: CopyFiles@2
      inputs:
        contents: '**/*.apk'
        targetFolder: '$(build.artifactStagingDirectory)/android'
        
    - task: CopyFiles@2
      inputs:
        contents: '**/*.ipa'
        targetFolder: '$(build.artifactStagingDirectory)/ios'
        
    - task: PublishBuildArtifacts@1
      inputs:
        pathToPublish: '$(build.artifactStagingDirectory)'
        artifactName: 'drop'

- stage: Test
  jobs:
  - job: UnitTests
    steps:
    - task: DotNetCoreCLI@2
      inputs:
        command: 'test'
        projects: '**/*Tests/*.csproj'
        arguments: '--configuration $(buildConfiguration)'
        
  - job: UITests
    steps:
    - task: AppCenterTest@1
      inputs:
        appFile: '$(build.artifactStagingDirectory)/android/**/*.apk'
        appSlug: '$(appCenterSlug)'
        devices: '1234abcd'
        framework: 'uitest'
        uitestBuildDir: '$(build.binariesDirectory)/UITests'

- stage: CodeQuality
  jobs:
  - job: StaticAnalysis
    steps:
    - task: SonarCloudPrepare@1
      inputs:
        SonarCloud: 'SonarCloud'
        organization: 'your-organization'
        scannerMode: 'MSBuild'
        projectKey: 'your-project-key'
        projectName: 'Your Project Name'
        
    - task: DotNetCoreCLI@2
      inputs:
        command: 'build'
        projects: '**/*.sln'
        
    - task: SonarCloudAnalyze@1
    
    - task: SonarCloudPublish@1
      inputs:
        pollingTimeoutSec: '300'

- stage: DeployToTestFlight
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/develop'))
  jobs:
  - job: DeployToTestFlight
    steps:
    - task: AppCenterDistribute@3
      inputs:
        serverEndpoint: 'AppCenter'
        appSlug: '$(appCenterSlug)'
        appFile: '$(Pipeline.Workspace)/drop/ios/**/*.ipa'
        releaseNotesOption: 'input'
        releaseNotesInput: 'New build from pipeline'
        destinationType: 'groups'
        distributionGroupId: 'test-group-id'

- stage: DeployToPlayStoreInternal
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/develop'))
  jobs:
  - job: DeployToPlayStoreInternal
    steps:
    - task: GooglePlayReleaseBundle@3
      inputs:
        serviceConnection: 'GooglePlayConnection'
        applicationId: 'com.example.app'
        bundleFile: '$(Pipeline.Workspace)/drop/android/**/*.aab'
        track: 'internal'
        rolloutPercentage: '100'
        changeLogFile: 'CHANGELOG.md'

- stage: ProductionApproval
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - job: ApprovalJob
    pool: server
    steps:
    - task: ManualValidation@0
      inputs:
        notifyUsers: 'user@example.com'
        instructions: 'Please validate the build and approve for production deployment'

- stage: DeployToProduction
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - job: DeployToAppStore
    steps:
    - task: AppCenterDistribute@3
      inputs:
        serverEndpoint: 'AppCenter'
        appSlug: '$(appCenterSlug)'
        appFile: '$(Pipeline.Workspace)/drop/ios/**/*.ipa'
        releaseNotesOption: 'input'
        releaseNotesInput: 'Production release'
        destinationType: 'store'
        destinationStoreId: 'apple'
        
  - job: DeployToPlayStore
    steps:
    - task: GooglePlayReleaseBundle@3
      inputs:
        serviceConnection: 'GooglePlayConnection'
        applicationId: 'com.example.app'
        bundleFile: '$(Pipeline.Workspace)/drop/android/**/*.aab'
        track: 'production'
        rolloutPercentage: '10'  # Staged rollout
        changeLogFile: 'CHANGELOG.md'
```

---

## Pipeline Maintenance and Evolution

### Performance Optimization

- **Parallelization**: Run independent jobs concurrently
- **Caching**: Implement dependency and build caching
- **Selective Execution**: Only run necessary steps based on changed files
- **Resource Optimization**: Right-size build agents and resources

### Troubleshooting Common Issues

| Issue | Possible Causes | Resolution Steps |
|-------|----------------|------------------|
| Build Failures | Dependency issues, code errors | Check logs, verify dependencies, run locally |
| Test Failures | Code changes, environment issues | Check test logs, reproduce locally, check test data |
| Deployment Failures | Configuration issues, environment problems | Verify credentials, check environment health, review deployment logs |
| Performance Problems | Resource constraints, inefficient steps | Optimize build steps, increase resources, implement caching |

### Pipeline Metrics

- **Build Duration**: Average time to complete the pipeline
- **Success Rate**: Percentage of successful builds
- **Mean Time to Recovery**: Average time to fix failed builds
- **Deployment Frequency**: How often code is deployed to production
- **Lead Time**: Time from commit to production deployment
- **Change Failure Rate**: Percentage of deployments causing incidents

---

## Documentation and Training

### Required Documentation

- CI/CD pipeline architecture diagram
- Environment configuration details
- Secret management approach
- Access control matrix
- Runbook for common issues
- Deployment verification procedures

### Team Training Requirements

- Source control workflows
- Local build process
- Pipeline debugging
- Deployment procedures
- Rollback procedures
- Security best practices

---

*This template is part of the PM Tools and Templates collection. For methodology guidance, please refer to the main GUIDE.md document in the repository root.*

