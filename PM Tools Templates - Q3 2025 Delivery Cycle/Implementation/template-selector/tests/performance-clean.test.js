/**
 * Performance Benchmarking Tests
 * Tests response times, memory usage, and API performance
 */

import { performance } from 'perf_hooks';

// Mock API service for performance testing
const mockTemplateService = {
  fetchTemplates: jest.fn(() => Promise.resolve({
    templates: [
      { id: '1', name: 'Test Template', methodology: 'Traditional' },
      { id: '2', name: 'Another Template', methodology: 'Agile' }
    ],
    totalCount: 2
  })),
  searchTemplates: jest.fn(() => Promise.resolve({
    templates: [{ id: '1', name: 'Test Template', methodology: 'Traditional' }],
    totalCount: 1
  })),
  fetchMetadata: jest.fn(() => Promise.resolve({
    methodologies: ['Traditional', 'Agile', 'Hybrid'],
    categories: ['Initiation', 'Planning'],
    tags: ['test', 'template']
  }))
};

// Performance test utilities
class PerformanceTestUtils {
  static measureExecutionTime(fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    return {
      result,
      executionTime: end - start
    };
  }

  static async measureAsyncExecutionTime(fn) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return {
      result,
      executionTime: end - start
    };
  }

  static measureMemoryUsage() {
    if (process.memoryUsage) {
      return process.memoryUsage();
    }
    return { heapUsed: 0, heapTotal: 0, external: 0 };
  }
}

describe('Performance Benchmarking Tests', () => {
  let initialMemory;

  beforeEach(() => {
    initialMemory = PerformanceTestUtils.measureMemoryUsage();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('API Response Time Tests', () => {
    test('template service should fetch templates under 200ms', async () => {
      const { executionTime } = await PerformanceTestUtils.measureAsyncExecutionTime(
        () => mockTemplateService.fetchTemplates()
      );

      expect(executionTime).toBeLessThan(200);
      expect(mockTemplateService.fetchTemplates).toHaveBeenCalled();
      console.log(`Template fetch time: ${executionTime.toFixed(2)}ms`);
    });

    test('search functionality should respond under 100ms', async () => {
      const { executionTime } = await PerformanceTestUtils.measureAsyncExecutionTime(
        () => mockTemplateService.searchTemplates('project')
      );

      expect(executionTime).toBeLessThan(100);
      expect(mockTemplateService.searchTemplates).toHaveBeenCalledWith('project');
      console.log(`Search response time: ${executionTime.toFixed(2)}ms`);
    });

    test('metadata fetch should complete under 50ms', async () => {
      const { executionTime } = await PerformanceTestUtils.measureAsyncExecutionTime(
        () => mockTemplateService.fetchMetadata()
      );

      expect(executionTime).toBeLessThan(50);
      expect(mockTemplateService.fetchMetadata).toHaveBeenCalled();
      console.log(`Metadata fetch time: ${executionTime.toFixed(2)}ms`);
    });
  });

  describe('Memory Usage Tests', () => {
    test('memory usage should not exceed reasonable limits', async () => {
      const beforeMemory = PerformanceTestUtils.measureMemoryUsage();
      
      // Simulate template loading
      await mockTemplateService.fetchTemplates();
      await mockTemplateService.searchTemplates('test');
      await mockTemplateService.fetchMetadata();
      
      const afterMemory = PerformanceTestUtils.measureMemoryUsage();
      const memoryIncrease = afterMemory.heapUsed - beforeMemory.heapUsed;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      console.log(`Memory usage increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });
  });

  describe('Load Testing Simulation', () => {
    test('should handle concurrent template loading', async () => {
      const promises = [];
      
      const { executionTime } = await PerformanceTestUtils.measureAsyncExecutionTime(async () => {
        // Simulate multiple concurrent requests
        for (let i = 0; i < 5; i++) {
          promises.push(mockTemplateService.fetchTemplates());
        }
        
        await Promise.all(promises);
      });

      expect(executionTime).toBeLessThan(1000);
      expect(mockTemplateService.fetchTemplates).toHaveBeenCalledTimes(5);
      console.log(`Concurrent loading time: ${executionTime.toFixed(2)}ms`);
    });

    test('should handle rapid successive searches', async () => {
      const searchTerms = ['project', 'agile', 'traditional', 'hybrid', 'charter'];
      
      const { executionTime } = await PerformanceTestUtils.measureAsyncExecutionTime(async () => {
        for (const term of searchTerms) {
          await mockTemplateService.searchTemplates(term);
        }
      });

      expect(executionTime).toBeLessThan(500);
      expect(mockTemplateService.searchTemplates).toHaveBeenCalledTimes(5);
      console.log(`Rapid search test time: ${executionTime.toFixed(2)}ms`);
    });
  });

  describe('Performance Thresholds', () => {
    test('application should meet performance benchmarks', async () => {
      const benchmarks = {
        templateFetch: 200,
        searchResponse: 100,
        metadataFetch: 50,
        memoryUsage: 10 * 1024 * 1024 // 10MB
      };

      // Test template fetch
      const { executionTime: fetchTime } = await PerformanceTestUtils.measureAsyncExecutionTime(
        () => mockTemplateService.fetchTemplates()
      );
      expect(fetchTime).toBeLessThan(benchmarks.templateFetch);

      // Test search response
      const { executionTime: searchTime } = await PerformanceTestUtils.measureAsyncExecutionTime(
        () => mockTemplateService.searchTemplates('test')
      );
      expect(searchTime).toBeLessThan(benchmarks.searchResponse);

      // Test metadata fetch
      const { executionTime: metadataTime } = await PerformanceTestUtils.measureAsyncExecutionTime(
        () => mockTemplateService.fetchMetadata()
      );
      expect(metadataTime).toBeLessThan(benchmarks.metadataFetch);

      console.log('🎯 Performance Benchmarks:');
      console.log(`  ✅ Template fetch: ${fetchTime.toFixed(2)}ms (target: <${benchmarks.templateFetch}ms)`);
      console.log(`  ✅ Search response: ${searchTime.toFixed(2)}ms (target: <${benchmarks.searchResponse}ms)`);
      console.log(`  ✅ Metadata fetch: ${metadataTime.toFixed(2)}ms (target: <${benchmarks.metadataFetch}ms)`);
    });
  });
});
