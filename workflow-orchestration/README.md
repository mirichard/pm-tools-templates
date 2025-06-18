# Advanced Workflow Orchestration Engine

A powerful, flexible workflow orchestration engine for Node.js that enables you to define, execute, and manage complex multi-step workflows with conditional logic, parallel execution, and robust error handling.

## 🚀 Features

- **Multi-step Workflows**: Define complex workflows with sequential, parallel, and conditional steps
- **Conditional Logic**: Support for complex conditional expressions and branching
- **Parallel Execution**: Execute multiple steps simultaneously for improved performance
- **Variable Interpolation**: Dynamic parameter substitution using context variables
- **Built-in Actions**: HTTP requests, delays, logging, and more
- **Extensible Architecture**: Easy to add custom actions and operators
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Performance Monitoring**: Built-in metrics and execution tracking
- **Workflow Validation**: Validate workflow definitions before execution
- **Pause/Resume/Cancel**: Full control over workflow execution lifecycle

## 📦 Installation

```bash
cd workflow-orchestration
npm install
```

## 🎯 Quick Start

### Basic Usage

```javascript
import { createWorkflowEngine, WorkflowBuilder } from './src/index.js';

// Create and initialize the workflow engine
const engine = await createWorkflowEngine();

// Create a simple workflow
const workflow = new WorkflowBuilder()
  .setMetadata({
    id: 'hello-world',
    name: 'Hello World Workflow',
    description: 'A simple greeting workflow'
  })
  .addLogMessage('greeting', {
    message: 'Hello, {{name}}!',
    level: 'info'
  })
  .addDelay('pause', {
    duration: 1000,
    message: 'Thinking for a moment...'
  })
  .addLogMessage('farewell', {
    message: 'Goodbye, {{name}}!',
    level: 'info'
  })
  .build();

// Execute the workflow
const result = await engine.executeWorkflow(workflow, { name: 'World' });
console.log('Workflow completed:', result);

// Shutdown the engine
await engine.shutdown();
```

### Running the Demo

```bash
npm run demo
```

## 📋 Workflow Definition

### Basic Structure

```javascript
const workflow = {
  id: 'my-workflow',
  name: 'My Workflow',
  version: '1.0.0',
  description: 'Description of the workflow',
  timeout: 300000, // Optional global timeout (5 minutes)
  steps: [
    {
      name: 'step-name',
      type: 'action-type',
      parameters: {
        // Action-specific parameters
      },
      condition: {
        // Optional condition for step execution
      },
      outputVariable: 'variableName', // Optional
      retryCount: 3, // Optional
      retryDelay: 1000, // Optional
      continueOnError: false // Optional
    }
  ]
};
```

### Using WorkflowBuilder

```javascript
import { WorkflowBuilder } from './src/index.js';

const workflow = new WorkflowBuilder()
  .setMetadata({
    id: 'api-workflow',
    name: 'API Processing Workflow',
    description: 'Processes data via API calls'
  })
  .addHttpRequest('fetch-data', {
    url: 'https://api.example.com/data',
    method: 'GET',
    timeout: 10000,
    outputVariable: 'apiData'
  })
  .addLogMessage('log-result', {
    message: 'Received {{apiData.data.length}} records',
    level: 'info'
  })
  .build();
```

## 🔧 Built-in Actions

### HTTP Request

```javascript
{
  name: 'api-call',
  type: 'http-request',
  parameters: {
    url: 'https://api.example.com/endpoint',
    method: 'POST', // GET, POST, PUT, DELETE, PATCH
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {{token}}'
    },
    body: {
      data: '{{inputData}}'
    },
    timeout: 30000,
    retries: 3
  },
  outputVariable: 'apiResponse'
}
```

### Delay

```javascript
{
  name: 'wait',
  type: 'delay',
  parameters: {
    duration: 5000, // milliseconds
    message: 'Waiting 5 seconds...'
  }
}
```

### Log Message

```javascript
{
  name: 'log-info',
  type: 'log-message',
  parameters: {
    message: 'Processing item {{item.id}}',
    level: 'info', // error, warn, info, debug
    data: {
      itemCount: '{{items.length}}',
      timestamp: '{{timestamp}}'
    }
  }
}
```

## 🔀 Conditional Logic

### Simple Conditions

```javascript
{
  name: 'conditional-step',
  type: 'log-message',
  parameters: {
    message: 'This runs only in production'
  },
  condition: {
    operator: '===',
    left: '{{environment}}',
    right: 'production'
  }
}
```

### Complex Conditions

```javascript
{
  name: 'complex-condition',
  type: 'log-message',
  parameters: {
    message: 'Complex condition met'
  },
  condition: {
    and: [
      {
        operator: '>',
        left: '{{score}}',
        right: 80
      },
      {
        or: [
          {
            operator: '===',
            left: '{{status}}',
            right: 'approved'
          },
          {
            operator: '===',
            left: '{{priority}}',
            right: 'high'
          }
        ]
      }
    ]
  }
}
```

### Supported Operators

- **Comparison**: `==`, `===`, `!=`, `!==`, `>`, `>=`, `<`, `<=`
- **Logical**: `&&`, `||`, `!`
- **String**: `contains`, `startsWith`, `endsWith`, `matches`
- **Array**: `in`, `notIn`
- **Existence**: `exists`, `notExists`
- **Type**: `isString`, `isNumber`, `isBoolean`, `isArray`, `isObject`

## ⚡ Parallel Execution

```javascript
{
  name: 'parallel-processing',
  type: 'parallel',
  parallel: [
    {
      name: 'task-1',
      type: 'http-request',
      parameters: {
        url: 'https://api1.example.com/data'
      }
    },
    {
      name: 'task-2',
      type: 'http-request',
      parameters: {
        url: 'https://api2.example.com/data'
      }
    },
    {
      name: 'task-3',
      type: 'log-message',
      parameters: {
        message: 'Processing in parallel'
      }
    }
  ]
}
```

## 🌿 Branching

```javascript
{
  name: 'conditional-branch',
  type: 'branch',
  branches: [
    {
      name: 'production-branch',
      condition: {
        operator: '===',
        left: '{{environment}}',
        right: 'production'
      },
      steps: [
        {
          name: 'prod-step',
          type: 'log-message',
          parameters: {
            message: 'Running production steps'
          }
        }
      ]
    },
    {
      name: 'development-branch',
      condition: {
        operator: '===',
        left: '{{environment}}',
        right: 'development'
      },
      steps: [
        {
          name: 'dev-step',
          type: 'log-message',
          parameters: {
            message: 'Running development steps'
          }
        }
      ]
    }
  ]
}
```

## 🔄 Variable Interpolation

Variables can be referenced using double braces `{{variableName}}`:

```javascript
// Context variables
const context = {
  userId: '12345',
  userName: 'john_doe',
  config: {
    apiUrl: 'https://api.example.com',
    timeout: 5000
  }
};

// Usage in parameters
{
  name: 'api-call',
  type: 'http-request',
  parameters: {
    url: '{{config.apiUrl}}/users/{{userId}}',
    timeout: '{{config.timeout}}'
  }
}
```

### Built-in Variables

- `{{executionId}}` - Unique execution identifier
- `{{workflowId}}` - Workflow identifier
- `{{startTime}}` - Execution start timestamp
- `{{timestamp}}` - Current timestamp (function)
- `{{randomId}}` - Random ID generator (function)

## 🛠️ Custom Actions

Create custom actions by implementing the action interface:

```javascript
class CustomAction {
  constructor() {
    this.description = 'My custom action';
    this.category = 'custom';
    this.version = '1.0.0';
    this.parameters = [
      {
        name: 'param1',
        type: 'string',
        required: true,
        description: 'Description of parameter'
      }
    ];
  }

  async execute(parameters, context) {
    // Implementation here
    return {
      success: true,
      result: 'Custom action completed'
    };
  }

  async validate(parameters) {
    const errors = [];
    // Validation logic here
    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }
}

// Register the custom action
engine.actionRegistry.register('custom-action', new CustomAction());
```

## 📊 Monitoring and Metrics

```javascript
// Get workflow execution status
const status = engine.getExecutionStatus(executionId);

// Get engine metrics
const metrics = engine.getMetrics();
console.log(metrics);
// Output:
// {
//   totalExecutions: 15,
//   successfulExecutions: 13,
//   failedExecutions: 2,
//   averageExecutionTime: 2340,
//   activeCount: 0,
//   templates: 2,
//   actions: 9
// }
```

## 🎛️ Execution Control

```javascript
// Execute workflow
const result = await engine.executeWorkflow(workflow, context);

// Pause workflow
await engine.pauseWorkflow(executionId);

// Resume workflow
await engine.resumeWorkflow(executionId);

// Cancel workflow
await engine.cancelWorkflow(executionId);
```

## ✅ Validation

```javascript
import { WorkflowUtils } from './src/index.js';

// Validate workflow definition
const validation = await WorkflowUtils.validateWorkflow(workflow);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  console.warn('Validation warnings:', validation.warnings);
}
```

## 🏗️ Architecture

The workflow orchestration engine consists of several key components:

- **WorkflowEngine**: Main orchestration engine
- **WorkflowValidator**: Validates workflow definitions
- **ExecutionContext**: Manages execution state and variables
- **ActionRegistry**: Manages available actions
- **ConditionEvaluator**: Evaluates conditional expressions
- **Logger**: Structured logging utility

## 📚 Examples

### API Data Processing Pipeline

```javascript
const dataProcessingWorkflow = new WorkflowBuilder()
  .setMetadata({
    id: 'data-processing',
    name: 'Data Processing Pipeline',
    description: 'Fetches, processes, and stores data'
  })
  .addHttpRequest('fetch-data', {
    url: '{{dataSource}}/api/data',
    method: 'GET',
    timeout: 30000,
    outputVariable: 'rawData'
  })
  .addLogMessage('log-fetch', {
    message: 'Fetched {{rawData.data.length}} records',
    level: 'info'
  })
  .addParallel('process-data', [
    {
      name: 'validate',
      type: 'log-message',
      parameters: {
        message: 'Validating data structure',
        level: 'debug'
      }
    },
    {
      name: 'transform',
      type: 'log-message',
      parameters: {
        message: 'Transforming data format',
        level: 'debug'
      }
    },
    {
      name: 'enrich',
      type: 'log-message',
      parameters: {
        message: 'Enriching with metadata',
        level: 'debug'
      }
    }
  ])
  .addHttpRequest('store-data', {
    url: '{{dataTarget}}/api/store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      data: '{{rawData.data}}'
    },
    outputVariable: 'storeResult'
  })
  .addLogMessage('completion', {
    message: 'Data processing completed successfully',
    level: 'info',
    data: {
      recordsProcessed: '{{rawData.data.length}}',
      storeStatus: '{{storeResult.status}}'
    }
  })
  .build();
```

### Service Health Monitoring

```javascript
const healthCheckWorkflow = new WorkflowBuilder()
  .setMetadata({
    id: 'health-monitor',
    name: 'Service Health Monitor',
    description: 'Monitors service health and alerts on issues'
  })
  .addHttpRequest('health-check', {
    url: '{{serviceUrl}}/health',
    method: 'GET',
    timeout: 5000,
    retries: 2,
    outputVariable: 'healthStatus'
  })
  .addLogMessage('healthy', {
    message: 'Service {{serviceName}} is healthy',
    level: 'info',
    data: {
      responseTime: '{{healthStatus.duration}}',
      status: '{{healthStatus.status}}'
    }
  }, {
    operator: '>=',
    left: '{{healthStatus.status}}',
    right: 200
  })
  .addLogMessage('unhealthy', {
    message: 'Service {{serviceName}} is unhealthy',
    level: 'error',
    data: {
      status: '{{healthStatus.status}}',
      error: '{{healthStatus.error}}'
    }
  }, {
    operator: '<',
    left: '{{healthStatus.status}}',
    right: 200
  })
  .build();
```

## 🧪 Testing

```bash
# Run demo to test functionality
npm run demo

# Test with custom workflows
node -e "
import('./demo.js').then(module => {
  // Custom test code here
});
"
```

## 🚀 Deployment

The workflow orchestration engine can be deployed in various environments:

1. **Standalone Service**: Run as a dedicated microservice
2. **Embedded Library**: Integrate into existing applications
3. **Serverless Functions**: Use in AWS Lambda, Azure Functions, etc.
4. **Container Deployment**: Deploy using Docker containers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the PM Tools Templates repository and follows the same licensing terms.

## 🔗 Related Components

- [AI-Powered Project Insights](../ai-insights/) - Machine learning for project intelligence
- [Dashboard System](../dashboard/) - Project management dashboards
- [Enhanced Tool Integrations](../integrations/) - Third-party tool integrations

## 📞 Support

For issues, questions, or contributions, please refer to the main PM Tools Templates repository.

---

**Advanced Workflow Orchestration Engine** - Empowering complex automation workflows with simplicity and flexibility.

