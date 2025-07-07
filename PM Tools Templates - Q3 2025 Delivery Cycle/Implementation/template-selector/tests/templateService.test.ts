import { TemplateService } from '../src/services/templateService';
import { Template, SearchFilters } from '../src/types';

describe('TemplateService', () => {
  const mockTemplate: Template = {
    id: '1',
    name: 'Test Template',
    description: 'A test template',
    methodology: 'Agile',
    category: 'Planning',
    complexity: 'beginner',
    tags: ['test', 'example'],
    lastUpdated: '2025-07-07',
    author: 'Test Author',
    rating: 4.5,
    usageCount: 100,
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('searchTemplates', () => {
    it('should search templates with filters', async () => {
      const mockFilters: SearchFilters = {
        methodology: 'Agile',
        category: 'Planning',
      };

      const mockResponse = {
        templates: [mockTemplate],
        totalCount: 1,
        pageCount: 1,
        currentPage: 1,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await TemplateService.searchTemplates(mockFilters);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            ...mockFilters,
            page: 1,
            pageSize: 20,
          }),
        })
      );
    });

    it('should handle search errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(
        TemplateService.searchTemplates({})
      ).rejects.toThrow('Failed to search templates');
    });
  });

  describe('getTemplateById', () => {
    it('should fetch template by id', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTemplate),
      });

      const result = await TemplateService.getTemplateById('1');

      expect(result).toEqual(mockTemplate);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/1')
      );
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(
        TemplateService.getTemplateById('1')
      ).rejects.toThrow('Failed to fetch template');
    });
  });

  describe('getRecommendedTemplates', () => {
    it('should fetch recommended templates', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockTemplate]),
      });

      const result = await TemplateService.getRecommendedTemplates('Agile', 'Planning');

      expect(result).toEqual([mockTemplate]);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/recommended'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            methodology: 'Agile',
            category: 'Planning',
          }),
        })
      );
    });

    it('should handle recommendation errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(
        TemplateService.getRecommendedTemplates()
      ).rejects.toThrow('Failed to fetch recommended templates');
    });
  });

  describe('rateTemplate', () => {
    it('should submit template rating', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await TemplateService.rateTemplate('1', 5, 'Great template!');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/1/rate'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            rating: 5,
            feedback: 'Great template!',
          }),
        })
      );
    });

    it('should handle rating errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(
        TemplateService.rateTemplate('1', 5)
      ).rejects.toThrow('Failed to submit template rating');
    });
  });
});
