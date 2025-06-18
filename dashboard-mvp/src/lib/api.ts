// API Integration Layer for Dashboard Data
export interface DashboardData {
  metrics: {
    schedulePerformance: number;
    budgetVariance: number;
    qualityScore: number;
    teamVelocity: number;
    riskLevel: 'low' | 'medium' | 'high';
    stakeholderSatisfaction: number;
  };
  progressData: Array<{
    week: string;
    planned: number;
    actual: number;
    issues: number;
  }>;
  risks: Array<{
    id: string;
    title: string;
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    probability: number;
    impact: number;
    status: 'open' | 'mitigating' | 'closed';
    owner: string;
    dueDate: string;
  }>;
  teamMembers: Array<{
    name: string;
    role: string;
    tasksCompleted: number;
    utilization: number;
    avatar: string;
  }>;
  qualityMetrics: {
    testCoverage: number;
    defectRate: number;
    codeReviewCoverage: number;
    bugsByCriticality: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  timeline: Array<{
    title: string;
    date: string;
    status: 'completed' | 'in-progress' | 'upcoming';
    description: string;
    progress: number;
  }>;
}

// Mock API service - replace with real API endpoints
class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

  async fetchDashboardData(): Promise<DashboardData> {
    try {
      // In production, this would fetch from real APIs
      const response = await fetch(`${this.baseUrl}/dashboard`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return await response.json();
    } catch (error) {
      console.warn('API unavailable, using mock data:', error);
      return this.getMockData();
    }
  }

  async exportDashboard(format: 'pdf' | 'csv' | 'json'): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/export?format=${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to export dashboard');
      }
      return await response.blob();
    } catch (error) {
      console.warn('Export API unavailable, generating mock export:', error);
      return this.generateMockExport(format);
    }
  }

  async updateDashboardSettings(settings: Record<string, unknown>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.warn('Settings API unavailable:', error);
      // Store settings locally
      localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    }
  }

  private getMockData(): DashboardData {
    return {
      metrics: {
        schedulePerformance: 87,
        budgetVariance: -12,
        qualityScore: 92,
        teamVelocity: 34,
        riskLevel: 'medium',
        stakeholderSatisfaction: 89,
      },
      progressData: [
        { week: 'Week 1', planned: 20, actual: 18, issues: 2 },
        { week: 'Week 2', planned: 40, actual: 42, issues: 1 },
        { week: 'Week 3', planned: 60, actual: 58, issues: 3 },
        { week: 'Week 4', planned: 80, actual: 85, issues: 0 },
        { week: 'Week 5', planned: 100, actual: 87, issues: 4 },
      ],
      risks: [
        {
          id: '1',
          title: 'API Integration Delays',
          category: 'Technical',
          severity: 'high',
          probability: 0.7,
          impact: 0.8,
          status: 'mitigating',
          owner: 'Tech Lead',
          dueDate: '2025-07-01',
        },
        {
          id: '2',
          title: 'Resource Availability',
          category: 'Resource',
          severity: 'medium',
          probability: 0.5,
          impact: 0.6,
          status: 'open',
          owner: 'PM',
          dueDate: '2025-06-30',
        },
        {
          id: '3',
          title: 'Scope Creep',
          category: 'Scope',
          severity: 'medium',
          probability: 0.4,
          impact: 0.7,
          status: 'open',
          owner: 'Product Owner',
          dueDate: '2025-07-15',
        },
      ],
      teamMembers: [
        { name: 'Sarah Chen', role: 'Frontend Dev', tasksCompleted: 23, utilization: 85, avatar: 'SC' },
        { name: 'Mike Johnson', role: 'Backend Dev', tasksCompleted: 19, utilization: 78, avatar: 'MJ' },
        { name: 'Lisa Wong', role: 'QA Engineer', tasksCompleted: 31, utilization: 92, avatar: 'LW' },
        { name: 'David Kim', role: 'DevOps', tasksCompleted: 15, utilization: 65, avatar: 'DK' },
      ],
      qualityMetrics: {
        testCoverage: 85,
        defectRate: 2.1,
        codeReviewCoverage: 98,
        bugsByCriticality: { critical: 0, high: 2, medium: 8, low: 15 },
      },
      timeline: [
        {
          title: 'Project Kickoff',
          date: '2025-06-01',
          status: 'completed',
          description: 'Initial project setup and team alignment',
          progress: 100,
        },
        {
          title: 'MVP Development',
          date: '2025-07-15',
          status: 'in-progress',
          description: 'Core dashboard features implementation',
          progress: 80,
        },
        {
          title: 'User Testing',
          date: '2025-08-01',
          status: 'upcoming',
          description: 'Beta testing with stakeholders',
          progress: 0,
        },
        {
          title: 'Production Launch',
          date: '2025-09-15',
          status: 'upcoming',
          description: 'Full production deployment',
          progress: 0,
        },
      ],
    };
  }

  private generateMockExport(format: string): Blob {
    const data = this.getMockData();
    let content: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        break;
      case 'csv':
        content = this.convertToCSV(data);
        mimeType = 'text/csv';
        break;
      case 'pdf':
        content = 'Mock PDF export - Dashboard Report';
        mimeType = 'application/pdf';
        break;
      default:
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
    }

    return new Blob([content], { type: mimeType });
  }

  private convertToCSV(data: DashboardData): string {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Schedule Performance', `${data.metrics.schedulePerformance}%`],
      ['Budget Variance', `${data.metrics.budgetVariance}%`],
      ['Quality Score', `${data.metrics.qualityScore}%`],
      ['Team Velocity', `${data.metrics.teamVelocity}`],
      ['Risk Level', data.metrics.riskLevel],
      ['Stakeholder Satisfaction', `${data.metrics.stakeholderSatisfaction}%`],
    ];

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export const apiService = new ApiService();

// React hook for dashboard data
export function useDashboardData() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await apiService.fetchDashboardData();
        setData(dashboardData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: () => apiService.fetchDashboardData() };
}

// We need to import React for the hook
import React from 'react';

