'use client'

import { User, TrendingUp, Clock, CheckCircle } from 'lucide-react'

const teamData = [
  { name: 'Sarah Chen', role: 'Lead Developer', tasks: 8, completed: 7, utilization: 95, avatar: 'SC' },
  { name: 'Mike Rodriguez', role: 'Frontend Dev', tasks: 6, completed: 5, utilization: 87, avatar: 'MR' },
  { name: 'Lisa Park', role: 'Designer', tasks: 4, completed: 4, utilization: 92, avatar: 'LP' },
  { name: 'David Kim', role: 'Backend Dev', tasks: 7, completed: 6, utilization: 89, avatar: 'DK' }
]

interface TeamMember {
  name: string;
  role: string;
  tasksCompleted: number;
  utilization: number;
  avatar: string;
}

interface TeamPerformanceProps {
  teamMembers?: TeamMember[];
}

export function TeamPerformance({ teamMembers }: TeamPerformanceProps = {}) {
  const avgUtilization = Math.round(teamData.reduce((acc, member) => acc + member.utilization, 0) / teamData.length)
  const totalTasks = teamData.reduce((acc, member) => acc + member.tasks, 0)
  const totalCompleted = teamData.reduce((acc, member) => acc + member.completed, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
          <p className="text-sm text-gray-600">Current sprint metrics</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{avgUtilization}%</p>
          <p className="text-sm text-gray-600">Avg Utilization</p>
        </div>
      </div>

      <div className="space-y-4">
        {teamData.map((member, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {member.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-600">{member.role}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <p className="font-medium text-gray-900">{member.completed}/{member.tasks}</p>
                <p className="text-xs text-gray-600">Tasks</p>
              </div>
              <div className="text-center">
                <p className={`font-medium ${
                  member.utilization >= 90 ? 'text-green-600' : 
                  member.utilization >= 75 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {member.utilization}%
                </p>
                <p className="text-xs text-gray-600">Util.</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{totalCompleted}/{totalTasks}</p>
          <p className="text-sm text-gray-600">Sprint Progress</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-600">4</p>
          <p className="text-sm text-gray-600">Team Members</p>
        </div>
      </div>
    </div>
  )
}

