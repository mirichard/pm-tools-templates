'use client'

import { Calendar, Clock, CheckCircle, Circle } from 'lucide-react'

const timelineData = [
  {
    id: 1,
    title: 'Project Kickoff',
    date: '2025-06-01',
    status: 'completed',
    description: 'Initial planning and team setup'
  },
  {
    id: 2,
    title: 'MVP Development',
    date: '2025-06-15',
    status: 'completed',
    description: 'Core features implementation'
  },
  {
    id: 3,
    title: 'Beta Testing',
    date: '2025-06-18',
    status: 'current',
    description: 'User testing and feedback collection'
  },
  {
    id: 4,
    title: 'Performance Optimization',
    date: '2025-06-25',
    status: 'upcoming',
    description: 'Speed and efficiency improvements'
  },
  {
    id: 5,
    title: 'Final Release',
    date: '2025-07-01',
    status: 'upcoming',
    description: 'Production deployment'
  }
]

interface TimelineItem {
  title: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
  progress: number;
}

interface ProjectTimelineProps {
  timeline?: TimelineItem[];
}

export function ProjectTimeline({ timeline }: ProjectTimelineProps = {}) {
  const timelineData = timeline || [
    {
      title: 'Project Kickoff',
      date: '2025-06-01',
      status: 'completed' as const,
      description: 'Initial project setup and team alignment',
      progress: 100,
    },
    {
      title: 'MVP Development',
      date: '2025-07-15',
      status: 'in-progress' as const,
      description: 'Core dashboard features implementation',
      progress: 80,
    },
    {
      title: 'User Testing',
      date: '2025-08-01',
      status: 'upcoming' as const,
      description: 'Beta testing with stakeholders',
      progress: 0,
    },
    {
      title: 'Production Launch',
      date: '2025-09-15',
      status: 'upcoming' as const,
      description: 'Full production deployment',
      progress: 0,
    },
  ];
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'upcoming': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'in-progress': return <Clock className="h-4 w-4" />
      case 'upcoming': return <Circle className="h-4 w-4" />
      default: return <Circle className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
          <p className="text-sm text-gray-600">Key milestones and deadlines</p>
        </div>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {timelineData.map((milestone, index) => (
          <div key={index} className="relative">
            {/* Timeline line */}
            {index < timelineData.length - 1 && (
              <div className="absolute left-4 top-8 w-0.5 h-12 bg-gray-200"></div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${getStatusColor(milestone.status)}`}>
                {getStatusIcon(milestone.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{milestone.title}</h4>
                  <span className="text-xs text-gray-500">{formatDate(milestone.date)}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{milestone.description}</p>
                
                {milestone.status === 'in-progress' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">65% complete</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Next milestone:</span>
          <span className="font-medium text-gray-900">Performance Optimization</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Days remaining:</span>
          <span className="font-medium text-blue-600">7 days</span>
        </div>
      </div>
    </div>
  )
}

