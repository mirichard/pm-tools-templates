# Analytics Platform Development Guide

## Overview

This guide provides comprehensive information for developers working on the PM Tools Analytics Platform. It covers setup procedures, development workflows, architecture guidelines, and best practices for building data analytics and reporting capabilities.

## Development Environment Setup

### Prerequisites

#### Required Software
- **Node.js:** Version 18.x or higher
- **Python:** Version 3.9 or higher  
- **Docker:** Version 20.x or higher
- **Git:** Latest version
- **VS Code:** Recommended IDE with extensions

#### Database Requirements
- **PostgreSQL:** Version 14.x for primary data storage
- **Redis:** Version 6.x for caching and session management
- **InfluxDB:** Version 2.x for time-series data
- **Elasticsearch:** Version 8.x for full-text search

### Local Environment Setup

#### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/company/pm-analytics-platform.git
cd pm-analytics-platform

# Install backend dependencies
cd backend
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Install frontend dependencies  
cd ../frontend
npm install

# Install analytics engine dependencies
cd ../analytics-engine
pip install -r requirements.txt
```

#### 2. Environment Configuration

Create environment files for different components:

**Backend (.env.local):**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/pm_analytics
REDIS_URL=redis://localhost:6379
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your_influx_token
ELASTIC_URL=http://localhost:9200
SECRET_KEY=your_secret_key
DEBUG=True
LOG_LEVEL=DEBUG
```

**Frontend (.env.local):**
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
REACT_APP_WEBSOCKET_URL=ws://localhost:8000/ws
REACT_APP_ENV=development
REACT_APP_LOG_LEVEL=debug
```

**Analytics Engine (.env.local):**
```env
AIRFLOW_HOME=/opt/airflow
AIRFLOW__CORE__DAGS_FOLDER=/opt/airflow/dags
AIRFLOW__CORE__LOAD_EXAMPLES=False
AIRFLOW__WEBSERVER__RBAC=True
SPARK_HOME=/opt/spark
```

#### 3. Database Setup

```bash
# Start local databases
docker-compose -f docker-compose.dev.yml up -d

# Run database migrations
cd backend
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data
python manage.py loaddata fixtures/sample_data.json
```

## Architecture Overview

### System Components

#### Backend Services
- **API Gateway:** FastAPI-based service for API management
- **Data Processing Service:** Handles ETL operations and data transformations
- **Analytics Engine:** Apache Airflow for workflow orchestration
- **Reporting Service:** Generates reports and dashboards
- **Authentication Service:** User management and security

#### Frontend Applications
- **Admin Dashboard:** React-based admin interface
- **Analytics Workbench:** Interactive data exploration tool
- **Report Builder:** Drag-and-drop report creation interface
- **Mobile App:** React Native mobile application

#### Data Layer
- **Operational Database:** PostgreSQL for transactional data
- **Analytics Database:** ClickHouse for analytical workloads
- **Time-Series Database:** InfluxDB for metrics and monitoring
- **Search Engine:** Elasticsearch for full-text search
- **Cache Layer:** Redis for session and data caching

### Data Flow Architecture

```
Data Sources → Data Ingestion → Data Processing → Data Storage → Analytics → Visualization
     ↓              ↓               ↓              ↓            ↓          ↓
Project Tools → API Gateway → ETL Pipeline → Data Warehouse → ML Models → Dashboards
Integration   Message Queue   Apache Spark   Data Lake      Jupyter     React Apps
```

## Development Workflows

### Feature Development Process

#### 1. Branch Strategy
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/TICKET-123-analytics-dashboard

# Make changes and commit
git add .
git commit -m "feat: add analytics dashboard component

- Implement dashboard layout
- Add chart components
- Integrate with analytics API
- Add unit tests

Closes #123"

# Push and create pull request
git push origin feature/TICKET-123-analytics-dashboard
```

#### 2. Code Review Process
- **Automated Checks:** All PRs must pass CI/CD pipeline
- **Peer Review:** Minimum 2 approvals required
- **Security Review:** Required for authentication/authorization changes
- **Performance Review:** Required for data processing changes

#### 3. Testing Requirements
- **Unit Tests:** Minimum 80% code coverage
- **Integration Tests:** API and database interactions
- **End-to-End Tests:** Critical user journeys
- **Performance Tests:** Data processing and API response times

### Development Scripts

#### Backend Development
```bash
# Start development server
cd backend
python manage.py runserver 0.0.0.0:8000

# Run tests
pytest tests/ --cov=src/ --cov-report=html

# Run linting
flake8 src/
black src/
isort src/

# Database operations
python manage.py makemigrations
python manage.py migrate
python manage.py shell
```

#### Frontend Development
```bash
# Start development server
cd frontend
npm start

# Run tests
npm test
npm run test:coverage

# Build for production
npm run build

# Lint and format
npm run lint
npm run format
```

#### Analytics Engine Development
```bash
# Start Airflow services
cd analytics-engine
airflow webserver --port 8080
airflow scheduler

# Test DAGs
airflow dags test analytics_pipeline 2024-01-01
airflow tasks test analytics_pipeline extract_data 2024-01-01

# Submit Spark jobs
spark-submit --class Main --master local[*] analytics-job.jar
```

## API Development Guidelines

### RESTful API Design

#### Endpoint Conventions
```python
# Resource naming conventions
GET    /api/v1/projects           # List projects
POST   /api/v1/projects           # Create project
GET    /api/v1/projects/{id}      # Get project
PUT    /api/v1/projects/{id}      # Update project
DELETE /api/v1/projects/{id}      # Delete project

# Nested resources
GET    /api/v1/projects/{id}/analytics    # Project analytics
POST   /api/v1/projects/{id}/reports      # Create project report
```

#### Response Formats
```python
# Success response
{
    "status": "success",
    "data": {
        "id": 123,
        "name": "Project Alpha",
        "metrics": {...}
    },
    "metadata": {
        "timestamp": "2024-01-01T00:00:00Z",
        "version": "v1"
    }
}

# Error response
{
    "status": "error",
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": {
            "field": "start_date",
            "reason": "Date must be in future"
        }
    }
}
```

### Authentication and Authorization

#### JWT Token Implementation
```python
# Token structure
{
    "user_id": 12345,
    "username": "john.doe",
    "roles": ["analyst", "viewer"],
    "permissions": ["read:projects", "write:reports"],
    "exp": 1640995200,
    "iat": 1640908800
}

# Token validation middleware
@require_auth(['read:analytics'])
def get_analytics_data(request):
    # Implementation
    pass
```

## Data Processing Guidelines

### ETL Pipeline Development

#### Data Extraction
```python
# Example data extractor
class ProjectDataExtractor:
    def __init__(self, source_config):
        self.source = source_config
        
    def extract(self, start_date, end_date):
        """Extract project data from source systems"""
        query = """
        SELECT project_id, name, status, start_date, end_date,
               budget, actual_cost, team_size
        FROM projects 
        WHERE created_date BETWEEN %s AND %s
        """
        return self.execute_query(query, [start_date, end_date])
```

#### Data Transformation
```python
# Example data transformer
class ProjectMetricsTransformer:
    def transform(self, raw_data):
        """Transform raw project data into analytics metrics"""
        return {
            'project_id': raw_data['project_id'],
            'duration_days': self.calculate_duration(
                raw_data['start_date'], 
                raw_data['end_date']
            ),
            'budget_variance': self.calculate_variance(
                raw_data['budget'], 
                raw_data['actual_cost']
            ),
            'team_efficiency': self.calculate_efficiency(raw_data)
        }
```

#### Data Loading
```python
# Example data loader
class AnalyticsDataLoader:
    def load(self, transformed_data, target_table):
        """Load transformed data into analytics database"""
        with self.get_connection() as conn:
            conn.executemany(
                f"INSERT INTO {target_table} VALUES (%s, %s, %s, %s)",
                transformed_data
            )
```

### Apache Airflow DAGs

#### Sample Analytics Pipeline
```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'analytics-team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'retries': 3,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'project_analytics_pipeline',
    default_args=default_args,
    description='Daily project analytics processing',
    schedule_interval='@daily',
    catchup=False
)

extract_task = PythonOperator(
    task_id='extract_project_data',
    python_callable=extract_project_data,
    dag=dag
)

transform_task = PythonOperator(
    task_id='transform_metrics',
    python_callable=transform_project_metrics,
    dag=dag
)

load_task = PythonOperator(
    task_id='load_analytics',
    python_callable=load_analytics_data,
    dag=dag
)

extract_task >> transform_task >> load_task
```

## Frontend Development Guidelines

### React Component Structure

#### Component Organization
```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── charts/          # Chart components
│   ├── dashboards/      # Dashboard components
│   └── forms/           # Form components
├── hooks/               # Custom React hooks
├── services/            # API service functions
├── utils/               # Utility functions
└── types/               # TypeScript type definitions
```

#### Sample Dashboard Component
```typescript
import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analytics';
import { ChartComponent } from '../components/charts/ChartComponent';

interface DashboardProps {
    projectId: string;
    timeRange: string;
}

export const ProjectDashboard: React.FC<DashboardProps> = ({ 
    projectId, 
    timeRange 
}) => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await AnalyticsService.getProjectMetrics(
                    projectId, 
                    timeRange
                );
                setMetrics(data);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [projectId, timeRange]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard">
            <h1>Project Analytics Dashboard</h1>
            <ChartComponent data={metrics.chartData} type="line" />
            <MetricsSummary metrics={metrics.summary} />
        </div>
    );
};
```

## Testing Guidelines

### Backend Testing

#### Unit Tests
```python
import pytest
from unittest.mock import patch, MagicMock
from src.analytics.processors import ProjectMetricsProcessor

class TestProjectMetricsProcessor:
    def setup_method(self):
        self.processor = ProjectMetricsProcessor()
    
    def test_calculate_duration_success(self):
        start_date = "2024-01-01"
        end_date = "2024-01-31"
        
        result = self.processor.calculate_duration(start_date, end_date)
        
        assert result == 30
    
    @patch('src.analytics.processors.database')
    def test_process_metrics_with_database(self, mock_db):
        mock_db.fetch_projects.return_value = [
            {'id': 1, 'name': 'Test Project'}
        ]
        
        result = self.processor.process_metrics()
        
        assert len(result) == 1
        mock_db.fetch_projects.assert_called_once()
```

#### Integration Tests
```python
import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

class TestAnalyticsAPI:
    def test_get_project_metrics_success(self):
        response = client.get("/api/v1/projects/123/metrics")
        
        assert response.status_code == 200
        data = response.json()
        assert "metrics" in data
        assert data["status"] == "success"
    
    def test_get_project_metrics_not_found(self):
        response = client.get("/api/v1/projects/999/metrics")
        
        assert response.status_code == 404
```

### Frontend Testing

#### Component Tests
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { ProjectDashboard } from '../ProjectDashboard';
import * as AnalyticsService from '../../services/analytics';

jest.mock('../../services/analytics');

describe('ProjectDashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', () => {
        render(<ProjectDashboard projectId="123" timeRange="30d" />);
        
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders metrics after successful fetch', async () => {
        const mockMetrics = {
            chartData: [],
            summary: { totalProjects: 5 }
        };
        
        (AnalyticsService.getProjectMetrics as jest.Mock)
            .mockResolvedValue(mockMetrics);

        render(<ProjectDashboard projectId="123" timeRange="30d" />);

        await waitFor(() => {
            expect(screen.getByText('Project Analytics Dashboard'))
                .toBeInTheDocument();
        });
    });
});
```

## Performance Optimization

### Database Optimization

#### Query Optimization
```sql
-- Use indexes for frequent queries
CREATE INDEX idx_projects_status_date ON projects(status, created_date);
CREATE INDEX idx_metrics_project_timestamp ON project_metrics(project_id, timestamp);

-- Optimize analytics queries
EXPLAIN ANALYZE 
SELECT p.id, p.name, AVG(m.value) as avg_metric
FROM projects p
JOIN project_metrics m ON p.id = m.project_id
WHERE p.status = 'active' 
AND m.timestamp >= '2024-01-01'
GROUP BY p.id, p.name;
```

#### Connection Pooling
```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

### Caching Strategy

#### Redis Caching
```python
import redis
import json
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_result(expiration=3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)
            
            # Calculate result and cache
            result = func(*args, **kwargs)
            redis_client.setex(
                cache_key, 
                expiration, 
                json.dumps(result)
            )
            return result
        return wrapper
    return decorator

@cache_result(expiration=1800)
def get_project_analytics(project_id):
    # Expensive analytics calculation
    return calculate_project_metrics(project_id)
```

## Deployment Guidelines

### Containerization

#### Dockerfile Example
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONPATH=/app
ENV DJANGO_SETTINGS_MODULE=config.settings.production

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Environment Configuration

#### Production Settings
```python
# config/settings/production.py
import os
from .base import *

DEBUG = False
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['DB_NAME'],
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'HOST': os.environ['DB_HOST'],
        'PORT': os.environ['DB_PORT'],
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

## Monitoring and Logging

### Application Monitoring

#### Metrics Collection
```python
from prometheus_client import Counter, Histogram, generate_latest

# Define metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests')
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')

# Middleware for metrics
class MetricsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        with REQUEST_DURATION.time():
            response = self.get_response(request)
        
        REQUEST_COUNT.inc()
        return response
```

#### Logging Configuration
```python
import logging
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Usage
logger.info("Processing analytics data", 
           project_id=project_id, 
           record_count=len(data))
```

## Security Guidelines

### Authentication Security
- Use JWT tokens with appropriate expiration times
- Implement refresh token rotation
- Store tokens securely (httpOnly cookies for web)
- Validate all incoming tokens

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper input validation
- Follow OWASP security guidelines

### Access Control
- Implement role-based access control (RBAC)
- Use principle of least privilege
- Audit access patterns regularly
- Implement rate limiting

---

## Related Resources

- [API Documentation](./api.md)
- [Privacy Guidelines](./privacy.md)
- [Dashboard Configuration](./dashboard.md)
- [Deployment Guide](../deployment/README.md)

---

**Last Updated:** {{ current_date }}
**Version:** 2.1
**Next Review:** {{ next_quarter }}

