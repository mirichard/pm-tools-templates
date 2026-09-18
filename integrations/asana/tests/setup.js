"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load test environment variables
dotenv_1.default.config({ path: '.env.test' });
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
//# sourceMappingURL=setup.js.map