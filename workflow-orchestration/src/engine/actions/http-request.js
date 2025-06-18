/**
 * HTTP Request Action
 * Performs HTTP requests as workflow steps
 */

export default class HttpRequestAction {
  constructor() {
    this.description = 'Performs HTTP requests with configurable methods, headers, and body';
    this.category = 'integration';
    this.version = '1.0.0';
    this.parameters = [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'The URL to make the request to'
      },
      {
        name: 'method',
        type: 'string',
        required: false,
        default: 'GET',
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        description: 'HTTP method to use'
      },
      {
        name: 'headers',
        type: 'object',
        required: false,
        description: 'HTTP headers to include'
      },
      {
        name: 'body',
        type: ['string', 'object'],
        required: false,
        description: 'Request body (for POST, PUT, PATCH)'
      },
      {
        name: 'timeout',
        type: 'number',
        required: false,
        default: 30000,
        description: 'Request timeout in milliseconds'
      },
      {
        name: 'retries',
        type: 'number',
        required: false,
        default: 0,
        description: 'Number of retry attempts'
      },
      {
        name: 'validateStatus',
        type: 'function',
        required: false,
        description: 'Function to validate response status'
      }
    ];
    this.examples = [
      {
        name: 'Simple GET request',
        parameters: {
          url: 'https://api.example.com/data',
          method: 'GET'
        }
      },
      {
        name: 'POST with JSON body',
        parameters: {
          url: 'https://api.example.com/submit',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            name: 'John Doe',
            email: 'john@example.com'
          }
        }
      }
    ];
  }

  /**
   * Execute HTTP request
   */
  async execute(parameters, context) {
    const {
      url,
      method = 'GET',
      headers = {},
      body,
      timeout = 30000,
      retries = 0,
      validateStatus = (status) => status >= 200 && status < 300
    } = parameters;

    let lastError;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.makeRequest({
          url,
          method,
          headers,
          body,
          timeout,
          validateStatus
        });

        return {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          url: response.url,
          method,
          attempt: attempt + 1
        };

      } catch (error) {
        lastError = error;
        
        if (attempt < retries) {
          // Wait before retry (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`HTTP request failed after ${retries + 1} attempts: ${lastError.message}`);
  }

  /**
   * Make the actual HTTP request
   */
  async makeRequest({ url, method, headers, body, timeout, validateStatus }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const requestOptions = {
        method: method.toUpperCase(),
        headers: {
          'User-Agent': 'WorkflowOrchestrator/1.0.0',
          ...headers
        },
        signal: controller.signal
      };

      // Add body for appropriate methods
      if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        if (typeof body === 'object') {
          requestOptions.body = JSON.stringify(body);
          if (!headers['Content-Type']) {
            requestOptions.headers['Content-Type'] = 'application/json';
          }
        } else {
          requestOptions.body = body;
        }
      }

      const response = await fetch(url, requestOptions);
      
      // Validate status
      if (!validateStatus(response.status)) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }

      // Parse response based on content type
      let data;
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (contentType.includes('text/')) {
        data = await response.text();
      } else {
        data = await response.arrayBuffer();
      }

      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        url: response.url
      };

    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Validate parameters
   */
  async validate(parameters) {
    const errors = [];
    
    if (!parameters.url) {
      errors.push('URL is required');
    } else {
      try {
        new URL(parameters.url);
      } catch {
        errors.push('URL must be valid');
      }
    }

    if (parameters.method && !['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(parameters.method.toUpperCase())) {
      errors.push('Method must be one of: GET, POST, PUT, DELETE, PATCH');
    }

    if (parameters.timeout && (typeof parameters.timeout !== 'number' || parameters.timeout <= 0)) {
      errors.push('Timeout must be a positive number');
    }

    if (parameters.retries && (typeof parameters.retries !== 'number' || parameters.retries < 0)) {
      errors.push('Retries must be a non-negative number');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Get schema for this action
   */
  getSchema() {
    return {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          format: 'uri',
          description: 'The URL to make the request to'
        },
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          default: 'GET',
          description: 'HTTP method to use'
        },
        headers: {
          type: 'object',
          description: 'HTTP headers to include'
        },
        body: {
          oneOf: [
            { type: 'string' },
            { type: 'object' }
          ],
          description: 'Request body'
        },
        timeout: {
          type: 'number',
          minimum: 1,
          default: 30000,
          description: 'Request timeout in milliseconds'
        },
        retries: {
          type: 'number',
          minimum: 0,
          default: 0,
          description: 'Number of retry attempts'
        }
      },
      required: ['url']
    };
  }

  /**
   * Check compatibility
   */
  checkCompatibility(environment = {}) {
    if (typeof fetch === 'undefined') {
      return {
        compatible: false,
        reason: 'fetch API not available'
      };
    }

    return {
      compatible: true,
      reason: 'fetch API available'
    };
  }
}

