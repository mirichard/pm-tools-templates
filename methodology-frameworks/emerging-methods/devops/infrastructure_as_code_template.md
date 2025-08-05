---
title: "Infrastructure As Code Template"
methodology: "universal"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# Infrastructure as Code (IaC) Template

## Overview
This template provides a comprehensive framework for implementing Infrastructure as Code practices, covering infrastructure provisioning, configuration management, and infrastructure lifecycle management through code-based approaches.

## Template Information
- **Methodology:** DevOps Infrastructure as Code
- **Purpose:** Standardize infrastructure provisioning and management through code
- **Audience:** DevOps Engineers, Platform Teams, Infrastructure Engineers, Cloud Architects
- **Timeline:** 10-16 weeks for full implementation
- **Prerequisites:** Cloud accounts, version control, basic automation tools

---

## IaC Strategy Framework

### Infrastructure as Code Principles

#### Core IaC Principles
```
Infrastructure as Code Foundation

Declarative Configuration:
├── Define desired end state, not steps
├── Idempotent operations (repeatable)
├── Self-documenting infrastructure
└── Version-controlled infrastructure definitions

Immutable Infrastructure:
├── Replace rather than modify
├── Consistent environments
├── Reduced configuration drift
└── Simplified rollback procedures

Everything as Code:
├── Infrastructure provisioning
├── Configuration management
├── Security policies
├── Monitoring and alerting
└── Documentation and runbooks
```

#### IaC Maturity Model
| Level | Description | Characteristics | Tools & Practices |
|-------|-------------|-----------------|-------------------|
| Level 1 | Manual | Click-ops, documentation | AWS Console, manual scripts |
| Level 2 | Scripted | Automation scripts | Bash, PowerShell, CLI tools |
| Level 3 | Declarative | Infrastructure definitions | Terraform, CloudFormation |
| Level 4 | GitOps | Git-driven workflows | CI/CD, automated deployment |
| Level 5 | Self-Service | Platform abstraction | Internal platforms, APIs |

### IaC Architecture Design

#### Multi-Layer Architecture
```yaml
# IaC Architecture Layers
infrastructure_layers:
  foundation_layer:
    description: "Core cloud infrastructure"
    components:
      - networking: "VPCs, subnets, routing"
      - security: "IAM, security groups, policies"
      - monitoring: "CloudWatch, logging setup"
    tools: ["terraform", "cloudformation"]
    ownership: "platform_team"
    
  platform_layer:
    description: "Shared platform services"
    components:
      - kubernetes: "EKS/GKE clusters"
      - databases: "RDS, ElastiCache instances"
      - load_balancers: "ALB, NLB configuration"
    tools: ["terraform", "helm"]
    ownership: "platform_team"
    
  application_layer:
    description: "Application-specific resources"
    components:
      - application_infra: "App-specific resources"
      - service_mesh: "Istio, Linkerd configuration"
      - secrets: "Application secrets management"
    tools: ["terraform", "kustomize", "helm"]
    ownership: "development_teams"
    
  observability_layer:
    description: "Monitoring and observability"
    components:
      - monitoring: "Prometheus, Grafana"
      - logging: "ELK stack, Fluentd"
      - tracing: "Jaeger, Zipkin"
    tools: ["terraform", "helm", "operators"]
    ownership: "sre_team"
```

---

## Terraform Implementation

### Terraform Project Structure

#### Recommended Directory Structure
```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── outputs.tf
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── outputs.tf
│   └── production/
│       ├── main.tf
│       ├── variables.tf
│       ├── terraform.tfvars
│       └── outputs.tf
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── compute/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   └── database/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── README.md
├── shared/
│   ├── backend.tf
│   ├── providers.tf
│   └── common-variables.tf
└── scripts/
    ├── plan.sh
    ├── apply.sh
    └── destroy.sh
```

#### Terraform Module Example
```hcl
# modules/networking/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.common_tags, {
    Name = "${var.environment}-vpc"
    Type = "networking"
  })
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = merge(var.common_tags, {
    Name = "${var.environment}-private-subnet-${count.index + 1}"
    Type = "private"
  })
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = merge(var.common_tags, {
    Name = "${var.environment}-public-subnet-${count.index + 1}"
    Type = "public"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(var.common_tags, {
    Name = "${var.environment}-igw"
  })
}

# NAT Gateway
resource "aws_eip" "nat" {
  count  = length(var.public_subnet_cidrs)
  domain = "vpc"

  tags = merge(var.common_tags, {
    Name = "${var.environment}-nat-eip-${count.index + 1}"
  })

  depends_on = [aws_internet_gateway.main]
}

resource "aws_nat_gateway" "main" {
  count         = length(var.public_subnet_cidrs)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(var.common_tags, {
    Name = "${var.environment}-nat-gw-${count.index + 1}"
  })

  depends_on = [aws_internet_gateway.main]
}
```

```hcl
# modules/networking/variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}
```

```hcl
# modules/networking/outputs.tf
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.main.id
}

output "nat_gateway_ids" {
  description = "IDs of the NAT Gateways"
  value       = aws_nat_gateway.main[*].id
}
```

### Terraform State Management

#### Remote State Configuration
```hcl
# shared/backend.tf
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
    
    # Workspace-based state management
    workspace_key_prefix = "environments"
  }
}

# S3 bucket configuration for state storage
resource "aws_s3_bucket" "terraform_state" {
  bucket = "company-terraform-state"
  
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name        = "Terraform State Storage"
    Environment = "shared"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_state_lock" {
  name           = "terraform-state-lock"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "Terraform State Lock Table"
    Environment = "shared"
  }
}
```

#### Environment-Specific Configuration
```hcl
# environments/production/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment   = var.environment
      Project       = var.project_name
      ManagedBy     = "terraform"
      Owner         = var.team_name
      CostCenter    = var.cost_center
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" {
  state = "available"
}

# Networking module
module "networking" {
  source = "../../modules/networking"
  
  environment            = var.environment
  vpc_cidr              = var.vpc_cidr
  private_subnet_cidrs  = var.private_subnet_cidrs
  public_subnet_cidrs   = var.public_subnet_cidrs
  common_tags           = local.common_tags
}

# Compute module
module "compute" {
  source = "../../modules/compute"
  
  environment       = var.environment
  vpc_id           = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids
  public_subnet_ids  = module.networking.public_subnet_ids
  common_tags      = local.common_tags
}

# Database module
module "database" {
  source = "../../modules/database"
  
  environment       = var.environment
  vpc_id           = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids
  common_tags      = local.common_tags
}

locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
    Owner       = var.team_name
    CostCenter  = var.cost_center
  }
}
```

```hcl
# environments/production/terraform.tfvars
# Environment configuration
environment  = "production"
project_name = "company-platform"
team_name    = "platform-team"
cost_center  = "engineering"
aws_region   = "us-west-2"

# Networking configuration
vpc_cidr = "10.0.0.0/16"
private_subnet_cidrs = [
  "10.0.1.0/24",
  "10.0.2.0/24",
  "10.0.3.0/24"
]
public_subnet_cidrs = [
  "10.0.101.0/24",
  "10.0.102.0/24",
  "10.0.103.0/24"
]

# Compute configuration
instance_types = {
  web_servers = "t3.medium"
  api_servers = "c5.large"
  workers     = "m5.large"
}

# Database configuration
db_instance_class = "db.r5.xlarge"
db_allocated_storage = 100
db_backup_retention_period = 7
```

---

## Kubernetes Infrastructure

### Kubernetes Cluster Configuration

#### EKS Cluster with Terraform
```hcl
# modules/eks/main.tf
resource "aws_eks_cluster" "main" {
  name     = "${var.environment}-eks-cluster"
  role_arn = aws_iam_role.cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = concat(var.private_subnet_ids, var.public_subnet_ids)
    endpoint_private_access = true
    endpoint_public_access  = var.endpoint_public_access
    public_access_cidrs     = var.public_access_cidrs
    
    security_group_ids = [aws_security_group.cluster.id]
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks.arn
    }
    resources = ["secrets"]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
    aws_cloudwatch_log_group.eks_cluster,
  ]

  tags = merge(var.common_tags, {
    Name = "${var.environment}-eks-cluster"
  })
}

# Node Groups
resource "aws_eks_node_group" "main" {
  for_each = var.node_groups

  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.environment}-${each.key}"
  node_role_arn   = aws_iam_role.node_group.arn
  subnet_ids      = var.private_subnet_ids

  scaling_config {
    desired_size = each.value.desired_size
    max_size     = each.value.max_size
    min_size     = each.value.min_size
  }

  update_config {
    max_unavailable = each.value.max_unavailable
  }

  instance_types = each.value.instance_types
  capacity_type  = each.value.capacity_type
  disk_size      = each.value.disk_size

  # Optional: Launch template for advanced configuration
  dynamic "launch_template" {
    for_each = each.value.launch_template != null ? [each.value.launch_template] : []
    content {
      id      = launch_template.value.id
      version = launch_template.value.version
    }
  }

  labels = merge(each.value.labels, {
    Environment = var.environment
    NodeGroup   = each.key
  })

  dynamic "taint" {
    for_each = each.value.taints
    content {
      key    = taint.value.key
      value  = taint.value.value
      effect = taint.value.effect
    }
  }

  tags = merge(var.common_tags, {
    Name = "${var.environment}-${each.key}-node-group"
  })

  depends_on = [
    aws_iam_role_policy_attachment.node_group_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node_group_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node_group_AmazonEC2ContainerRegistryReadOnly,
  ]
}

# EKS Add-ons
resource "aws_eks_addon" "main" {
  for_each = var.cluster_addons

  cluster_name = aws_eks_cluster.main.name
  addon_name   = each.key
  addon_version = each.value.version
  resolve_conflicts = each.value.resolve_conflicts

  tags = merge(var.common_tags, {
    Name = "${var.environment}-${each.key}-addon"
  })
}
```

#### Helm Chart Deployments
```yaml
# helm/ingress-nginx/values.yaml
controller:
  service:
    type: LoadBalancer
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
      service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
      service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "tcp"
      
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
      
  nodeSelector:
    node-role: "system"
    
  tolerations:
    - key: "system"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
      
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 100
          podAffinityTerm:
            labelSelector:
              matchExpressions:
                - key: app.kubernetes.io/name
                  operator: In
                  values:
                    - ingress-nginx
            topologyKey: kubernetes.io/hostname

  config:
    use-forwarded-headers: "true"
    compute-full-forwarded-for: "true"
    use-proxy-protocol: "false"
    
  metrics:
    enabled: true
    serviceMonitor:
      enabled: true
```

```hcl
# modules/helm-releases/main.tf
resource "helm_release" "ingress_nginx" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  version    = var.ingress_nginx_version
  namespace  = "ingress-nginx"
  create_namespace = true

  values = [
    file("${path.module}/values/ingress-nginx.yaml")
  ]

  set {
    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-ssl-cert"
    value = var.ssl_certificate_arn
  }

  depends_on = [var.cluster_endpoint]
}

resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  version    = var.cert_manager_version
  namespace  = "cert-manager"
  create_namespace = true

  set {
    name  = "installCRDs"
    value = "true"
  }

  set {
    name  = "global.leaderElection.namespace"
    value = "cert-manager"
  }

  depends_on = [helm_release.ingress_nginx]
}
```

### Kubernetes Manifests with Kustomize

#### Base Kubernetes Resources
```yaml
# k8s/base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  labels:
    app: sample-app
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sample-app
      version: v1
  template:
    metadata:
      labels:
        app: sample-app
        version: v1
    spec:
      containers:
      - name: app
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: ENVIRONMENT
          value: "placeholder"
        - name: LOG_LEVEL
          value: "info"
```

```yaml
# k8s/base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: app-service
  labels:
    app: sample-app
spec:
  selector:
    app: sample-app
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  type: ClusterIP
```

```yaml
# k8s/base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml
- configmap.yaml
- ingress.yaml

commonLabels:
  managed-by: kustomize
  
images:
- name: nginx
  newTag: "1.21"
```

#### Environment Overlays
```yaml
# k8s/overlays/production/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: production

resources:
- ../../base

patchesStrategicMerge:
- deployment-patch.yaml
- service-patch.yaml

replicas:
- name: app
  count: 5

images:
- name: nginx
  newName: company/sample-app
  newTag: "v1.2.3"

configMapGenerator:
- name: app-config
  files:
  - config.properties
  - application.yaml

secretGenerator:
- name: app-secrets
  files:
  - database-url
  - api-key
```

```yaml
# k8s/overlays/production/deployment-patch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  template:
    spec:
      containers:
      - name: app
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 2000m
            memory: 2Gi
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: LOG_LEVEL
          value: "warn"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
```

---

## Configuration Management

### Ansible Integration

#### Ansible Project Structure
```
ansible/
├── inventories/
│   ├── dev/
│   │   ├── hosts.yml
│   │   └── group_vars/
│   ├── staging/
│   │   ├── hosts.yml
│   │   └── group_vars/
│   └── production/
│       ├── hosts.yml
│       └── group_vars/
├── roles/
│   ├── common/
│   │   ├── tasks/main.yml
│   │   ├── handlers/main.yml
│   │   ├── templates/
│   │   └── vars/main.yml
│   ├── webserver/
│   │   ├── tasks/main.yml
│   │   ├── handlers/main.yml
│   │   ├── templates/
│   │   └── vars/main.yml
│   └── database/
│       ├── tasks/main.yml
│       ├── handlers/main.yml
│       ├── templates/
│       └── vars/main.yml
├── playbooks/
│   ├── site.yml
│   ├── webservers.yml
│   └── databases.yml
├── group_vars/
│   ├── all.yml
│   ├── webservers.yml
│   └── databases.yml
└── ansible.cfg
```

#### Ansible Playbook Example
```yaml
# playbooks/site.yml
---
- name: Configure all servers
  hosts: all
  become: yes
  roles:
    - common

- name: Configure web servers
  hosts: webservers
  become: yes
  roles:
    - webserver
  vars:
    nginx_version: "1.21"
    ssl_enabled: true

- name: Configure database servers
  hosts: databases
  become: yes
  roles:
    - database
  vars:
    mysql_version: "8.0"
    backup_enabled: true
```

```yaml
# roles/common/tasks/main.yml
---
- name: Update package cache
  apt:
    update_cache: yes
    cache_valid_time: 3600
  when: ansible_os_family == "Debian"

- name: Install essential packages
  package:
    name: "{{ item }}"
    state: present
  loop:
    - curl
    - wget
    - git
    - unzip
    - htop
    - vim

- name: Configure timezone
  timezone:
    name: "{{ system_timezone | default('UTC') }}"

- name: Create application user
  user:
    name: "{{ app_user }}"
    shell: /bin/bash
    home: "/home/{{ app_user }}"
    create_home: yes
    groups: sudo
    append: yes

- name: Configure SSH
  template:
    src: sshd_config.j2
    dest: /etc/ssh/sshd_config
    backup: yes
  notify: restart ssh

- name: Configure firewall
  ufw:
    rule: "{{ item.rule }}"
    port: "{{ item.port }}"
    proto: "{{ item.proto | default('tcp') }}"
  loop: "{{ firewall_rules }}"
  notify: reload firewall
```

### Cloud-Init Configuration

#### Cloud-Init Template
```yaml
# cloud-init/user-data.yaml
#cloud-config
package_update: true
package_upgrade: true

packages:
  - docker.io
  - docker-compose
  - awscli
  - jq
  - curl
  - wget

users:
  - name: deploy
    sudo: ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    ssh_authorized_keys:
      - ${ssh_public_key}

write_files:
  - path: /etc/docker/daemon.json
    content: |
      {
        "log-driver": "json-file",
        "log-opts": {
          "max-size": "10m",
          "max-file": "3"
        },
        "storage-driver": "overlay2"
      }
    permissions: '0644'

  - path: /opt/app/docker-compose.yml
    content: |
      version: '3.8'
      services:
        app:
          image: ${app_image}
          ports:
            - "80:8080"
          environment:
            - ENV=${environment}
            - LOG_LEVEL=info
          restart: unless-stopped
    permissions: '0644'

runcmd:
  - systemctl enable docker
  - systemctl start docker
  - usermod -aG docker deploy
  - cd /opt/app && docker-compose up -d
  - systemctl enable amazon-cloudwatch-agent
  - systemctl start amazon-cloudwatch-agent

final_message: "System setup completed successfully"
```

---

## CI/CD Integration

### GitOps Workflow

#### GitOps Repository Structure
```
gitops-repo/
├── environments/
│   ├── dev/
│   │   ├── infrastructure/
│   │   │   ├── terraform/
│   │   │   └── kustomization.yaml
│   │   └── applications/
│   │       ├── app1/
│   │       └── app2/
│   ├── staging/
│   │   ├── infrastructure/
│   │   └── applications/
│   └── production/
│       ├── infrastructure/
│       └── applications/
├── shared/
│   ├── terraform-modules/
│   ├── helm-charts/
│   └── policies/
└── docs/
    ├── runbooks/
    └── architecture/
```

#### ArgoCD Application Configuration
```yaml
# argocd/applications/infrastructure.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: infrastructure-dev
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/company/gitops-repo
    targetRevision: HEAD
    path: environments/dev/infrastructure
    kustomize:
      images:
        - nginx=nginx:1.21
  destination:
    server: https://kubernetes.default.svc
    namespace: infrastructure
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### Infrastructure CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/infrastructure.yml
name: Infrastructure CI/CD

on:
  push:
    branches: [main]
    paths: 
      - 'terraform/**'
      - 'k8s/**'
  pull_request:
    branches: [main]
    paths:
      - 'terraform/**'
      - 'k8s/**'

env:
  TF_VERSION: '1.6.0'
  AWS_REGION: 'us-west-2'

jobs:
  terraform-validate:
    name: Terraform Validate
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ env.TF_VERSION }}

      - name: Terraform Format Check
        run: terraform fmt -check -recursive
        working-directory: terraform/

      - name: Terraform Validate
        run: |
          cd terraform/environments/dev
          terraform init -backend=false
          terraform validate

  terraform-plan:
    name: Terraform Plan
    runs-on: ubuntu-latest
    needs: terraform-validate
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ env.TF_VERSION }}

      - name: Terraform Plan
        run: |
          cd terraform/environments/dev
          terraform init
          terraform plan -out=tfplan
        env:
          TF_VAR_environment: dev

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            const output = `#### Terraform Plan 📖
            
            <details><summary>Show Plan</summary>
            
            \`\`\`terraform
            ${process.env.PLAN}
            \`\`\`
            
            </details>
            
            *Pushed by: @${{ github.actor }}, Action: \`${{ github.event_name }}\`*`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            })

  terraform-apply:
    name: Terraform Apply
    runs-on: ubuntu-latest
    needs: terraform-validate
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ env.TF_VERSION }}

      - name: Terraform Apply
        run: |
          cd terraform/environments/dev
          terraform init
          terraform apply -auto-approve
        env:
          TF_VAR_environment: dev

  kubernetes-validate:
    name: Kubernetes Validate
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Kustomize
        uses: imranismail/setup-kustomize@v1

      - name: Validate Kubernetes Manifests
        run: |
          find k8s/ -name "kustomization.yaml" -exec dirname {} \; | while read dir; do
            echo "Validating $dir"
            kustomize build "$dir" | kubeval
          done

      - name: Security Scan
        uses: azure/k8s-lint@v1
        with:
          manifests: |
            k8s/base/*.yaml
            k8s/overlays/*/

  deploy-kubernetes:
    name: Deploy Kubernetes
    runs-on: ubuntu-latest
    needs: [kubernetes-validate, terraform-apply]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --region ${{ env.AWS_REGION }} --name dev-eks-cluster

      - name: Deploy with Kustomize
        run: |
          kubectl apply -k k8s/overlays/dev/

      - name: Verify Deployment
        run: |
          kubectl rollout status deployment/app -n dev
          kubectl get pods -n dev
```

---

## Security and Compliance

### Infrastructure Security

#### Security Best Practices
```yaml
# Security Configuration Framework
security_framework:
  network_security:
    - vpc_isolation: "Isolated VPCs per environment"
    - private_subnets: "Database and compute in private subnets"
    - security_groups: "Least privilege network rules"
    - nacls: "Additional network-level protection"
    
  identity_and_access:
    - iam_roles: "Service-specific IAM roles"
    - least_privilege: "Minimal required permissions"
    - mfa_enforcement: "Multi-factor authentication required"
    - service_accounts: "Kubernetes service accounts with IRSA"
    
  data_protection:
    - encryption_at_rest: "All data encrypted at rest"
    - encryption_in_transit: "TLS/SSL for all communications"
    - key_management: "AWS KMS or similar key management"
    - backup_encryption: "Encrypted backups with retention"
    
  monitoring_and_auditing:
    - cloudtrail: "All API calls logged"
    - vpc_flow_logs: "Network traffic monitoring"
    - security_monitoring: "Real-time security alerts"
    - compliance_scanning: "Automated compliance checks"
```

#### Policy as Code
```hcl
# modules/security/iam-policies.tf
# IAM Policy for EKS Node Groups
data "aws_iam_policy_document" "node_group_assume_role" {
  statement {
    effect = "Allow"
    
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
    
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "node_group" {
  name               = "${var.environment}-eks-node-group-role"
  assume_role_policy = data.aws_iam_policy_document.node_group_assume_role.json
  
  tags = merge(var.common_tags, {
    Name = "${var.environment}-eks-node-group-role"
  })
}

# Custom policy for additional permissions
data "aws_iam_policy_document" "node_group_additional" {
  statement {
    effect = "Allow"
    
    actions = [
      "s3:GetObject",
      "s3:ListBucket"
    ]
    
    resources = [
      "arn:aws:s3:::${var.environment}-app-artifacts",
      "arn:aws:s3:::${var.environment}-app-artifacts/*"
    ]
  }
  
  statement {
    effect = "Allow"
    
    actions = [
      "secretsmanager:GetSecretValue"
    ]
    
    resources = [
      "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:${var.environment}/*"
    ]
  }
}

resource "aws_iam_policy" "node_group_additional" {
  name        = "${var.environment}-eks-node-group-additional"
  description = "Additional permissions for EKS node group"
  policy      = data.aws_iam_policy_document.node_group_additional.json
}
```

#### OPA/Gatekeeper Policies
```yaml
# k8s/policies/required-labels.yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
      validation:
        openAPIV3Schema:
          type: object
          properties:
            labels:
              type: array
              items:
                type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels
        
        violation[{"msg": msg}] {
          required := input.parameters.labels
          provided := input.review.object.metadata.labels
          missing := required[_]
          not provided[missing]
          msg := sprintf("Missing required label: %v", [missing])
        }

---
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: must-have-environment
spec:
  match:
    kinds:
      - apiGroups: ["apps"]
        kinds: ["Deployment"]
      - apiGroups: [""]
        kinds: ["Service"]
  parameters:
    labels: ["environment", "app", "version"]
```

---

## Cost Optimization

### Resource Tagging Strategy

#### Comprehensive Tagging Framework
```yaml
# Tagging Strategy
tagging_strategy:
  mandatory_tags:
    - Environment: "dev|staging|production"
    - Project: "project-name"
    - Owner: "team-email"
    - CostCenter: "cost-center-code"
    - ManagedBy: "terraform|manual"
    
  optional_tags:
    - Application: "application-name"
    - Version: "application-version"
    - BackupSchedule: "daily|weekly|none"
    - Compliance: "pci|hipaa|sox|none"
    - MonitoringLevel: "basic|standard|enhanced"
    
  automation_tags:
    - CreatedBy: "automation-tool"
    - CreatedDate: "yyyy-mm-dd"
    - LastModified: "yyyy-mm-dd"
    - ScheduledShutdown: "enabled|disabled"
```

#### Cost Allocation Tags
```hcl
# modules/cost-optimization/main.tf
locals {
  cost_allocation_tags = {
    # Business tags
    BusinessUnit    = var.business_unit
    CostCenter     = var.cost_center
    Project        = var.project_name
    Owner          = var.team_email
    
    # Technical tags
    Environment    = var.environment
    Application    = var.application_name
    Component      = var.component_name
    ManagedBy      = "terraform"
    
    # Operational tags
    BackupRequired = var.backup_required ? "yes" : "no"
    Monitoring     = var.monitoring_level
    Schedule       = var.shutdown_schedule
    
    # Compliance tags
    DataClass      = var.data_classification
    Compliance     = join(",", var.compliance_requirements)
  }
}

# Default tags for all resources
resource "aws_default_tags" "default" {
  tags = local.cost_allocation_tags
}
```

### Auto-Scaling Configuration

#### EC2 Auto Scaling
```hcl
# modules/autoscaling/main.tf
resource "aws_autoscaling_group" "main" {
  name                = "${var.environment}-${var.application_name}-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = var.target_group_arns
  health_check_type   = "ELB"
  health_check_grace_period = 300

  min_size         = var.min_size
  max_size         = var.max_size
  desired_capacity = var.desired_capacity

  launch_template {
    id      = aws_launch_template.main.id
    version = "$Latest"
  }

  # Scaling policies
  enabled_metrics = [
    "GroupMinSize",
    "GroupMaxSize",
    "GroupDesiredCapacity",
    "GroupInServiceInstances",
    "GroupTotalInstances"
  ]

  tag {
    key                 = "Name"
    value               = "${var.environment}-${var.application_name}-instance"
    propagate_at_launch = true
  }

  dynamic "tag" {
    for_each = var.additional_tags
    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

# CloudWatch-based scaling policies
resource "aws_autoscaling_policy" "scale_up" {
  name                   = "${var.environment}-${var.application_name}-scale-up"
  scaling_adjustment     = 2
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.main.name
}

resource "aws_autoscaling_policy" "scale_down" {
  name                   = "${var.environment}-${var.application_name}-scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.main.name
}

# CloudWatch alarms
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "${var.environment}-${var.application_name}-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ec2 cpu utilization"
  alarm_actions       = [aws_autoscaling_policy.scale_up.arn]

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.main.name
  }
}
```

#### Kubernetes HPA and VPA
```yaml
# k8s/base/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 4
        periodSeconds: 60
      selectPolicy: Max

---
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: app
      maxAllowed:
        cpu: 2
        memory: 4Gi
      minAllowed:
        cpu: 100m
        memory: 128Mi
      controlledResources: ["cpu", "memory"]
```

---

## Disaster Recovery and Backup

### Backup Strategy

#### Automated Backup Configuration
```hcl
# modules/backup/main.tf
resource "aws_backup_vault" "main" {
  name        = "${var.environment}-backup-vault"
  kms_key_arn = aws_kms_key.backup.arn

  tags = merge(var.common_tags, {
    Name = "${var.environment}-backup-vault"
  })
}

resource "aws_backup_plan" "main" {
  name = "${var.environment}-backup-plan"

  rule {
    rule_name         = "daily_backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 5 ? * * *)"

    lifecycle {
      cold_storage_after = 30
      delete_after       = 365
    }

    recovery_point_tags = merge(var.common_tags, {
      BackupType = "daily"
    })
  }

  rule {
    rule_name         = "weekly_backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 5 ? * SUN *)"

    lifecycle {
      cold_storage_after = 7
      delete_after       = 2555  # 7 years
    }

    recovery_point_tags = merge(var.common_tags, {
      BackupType = "weekly"
    })
  }

  tags = merge(var.common_tags, {
    Name = "${var.environment}-backup-plan"
  })
}

# Backup selection
resource "aws_backup_selection" "main" {
  iam_role_arn = aws_iam_role.backup.arn
  name         = "${var.environment}-backup-selection"
  plan_id      = aws_backup_plan.main.id

  resources = var.backup_resources

  condition {
    string_equals {
      key   = "aws:ResourceTag/BackupRequired"
      value = "yes"
    }
  }
}
```

#### Database Backup Strategy
```yaml
# Database Backup Configuration
database_backup:
  rds_automated_backup:
    backup_retention_period: 30
    backup_window: "03:00-04:00"
    maintenance_window: "sun:04:00-sun:05:00"
    skip_final_snapshot: false
    final_snapshot_identifier: "${var.environment}-final-snapshot"
    
  manual_snapshots:
    frequency: "weekly"
    retention: "1 year"
    cross_region_copy: true
    destination_region: "us-east-1"
    
  point_in_time_recovery:
    enabled: true
    retention_period: 7
```

### Multi-Region Strategy

#### Cross-Region Infrastructure
```hcl
# multi-region/main.tf
# Primary region configuration
module "primary_infrastructure" {
  source = "../modules/infrastructure"
  
  providers = {
    aws = aws.primary
  }
  
  environment = var.environment
  region_role = "primary"
  
  # Primary-specific configuration
  enable_cross_region_backup = true
  backup_destination_region  = var.secondary_region
}

# Secondary region configuration
module "secondary_infrastructure" {
  source = "../modules/infrastructure"
  
  providers = {
    aws = aws.secondary
  }
  
  environment = var.environment
  region_role = "secondary"
  
  # Secondary-specific configuration
  enable_read_replicas = true
  primary_region       = var.primary_region
}

# Cross-region resources
resource "aws_s3_bucket_replication_configuration" "main" {
  provider = aws.primary
  
  role   = aws_iam_role.replication.arn
  bucket = module.primary_infrastructure.s3_bucket_id

  rule {
    id     = "replicate_to_secondary"
    status = "Enabled"

    destination {
      bucket        = module.secondary_infrastructure.s3_bucket_arn
      storage_class = "STANDARD_IA"
    }
  }

  depends_on = [aws_s3_bucket_versioning.main]
}
```

---

## Monitoring and Observability

### Infrastructure Monitoring

#### Prometheus Configuration for Infrastructure
```yaml
# monitoring/prometheus/infrastructure-rules.yaml
groups:
- name: infrastructure.rules
  rules:
  - alert: HighCPUUsage
    expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage detected"
      description: "CPU usage is above 80% on {{ $labels.instance }}"

  - alert: HighMemoryUsage
    expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High memory usage detected"
      description: "Memory usage is above 90% on {{ $labels.instance }}"

  - alert: DiskSpaceRunningLow
    expr: (1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100 > 85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Disk space running low"
      description: "Disk usage is above 85% on {{ $labels.instance }} mount {{ $labels.mountpoint }}"

  - alert: KubernetesNodeNotReady
    expr: kube_node_status_condition{condition="Ready",status="true"} == 0
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Kubernetes node not ready"
      description: "Node {{ $labels.node }} is not ready"
```

#### Infrastructure Dashboards
```json
{
  "dashboard": {
    "title": "Infrastructure Overview",
    "panels": [
      {
        "title": "CPU Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "100 - (avg by(instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100"
          }
        ]
      },
      {
        "title": "Disk Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "(1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100"
          }
        ]
      }
    ]
  }
}
```

---

## Related Templates
- [CI/CD Pipeline Planning](./cicd_pipeline_planning_template.md)
- [Release Management Workflow](./release_management_template.md)
- [DevOps Monitoring and Alerting](./monitoring_alerting_template.md)
- [DevSecOps Integration](./devsecops_template.md)
- [DevOps Engineer Toolkit](../../role-based-toolkits/devops-engineer/README.md)

---

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Date] | Initial Infrastructure as Code template | [Author] |

---

*This template is part of the PM Tools Templates library. For more information and additional templates, visit [repository root](../../../README.md).*

