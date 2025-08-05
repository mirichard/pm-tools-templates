import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test timeout
jest.setTimeout(10000);

// Mock Asana API calls by default
jest.mock('asana', () => ({
  Client: {
    create: jest.fn(() => ({
      projects: {
        findAll: jest.fn(),
        createProject: jest.fn(),
        findById: jest.fn(),
      },
      tasks: {
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
      },
      webhooks: {
        create: jest.fn(),
        deleteById: jest.fn(),
      },
    })),
  },
}));
