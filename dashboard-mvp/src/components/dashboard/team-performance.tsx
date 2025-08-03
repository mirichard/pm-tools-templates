'use client'

import { useState } from 'react'
import { User, TrendingUp, Clock, CheckCircle, AlertTriangle, ExternalLink, Users } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

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
  const [hoveredMember, setHoveredMember] = useState<string | null>(null)
  const { addToast } = useToast()
  
  const avgUtilization = Math.round(teamData.reduce((acc, member) => acc + member.utilization, 0) / teamData.length)
  const totalTasks = teamData.reduce((acc, member) => acc + member.tasks, 0)
  const totalCompleted = teamData.reduce((acc, member) => acc + member.completed, 0)
  
  const getUtilizationStatus = (utilization: number) => {
    if (utilization >= 95) return { status: 'overutilized', color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertTriangle }
    if (utilization >= 90) return { status: 'optimal', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle }
    if (utilization >= 75) return { status: 'good', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: TrendingUp }
    return { status: 'underutilized', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: Clock }
  }
  
  const handleMemberClick = (member: typeof teamData[0]) => {
    const status = getUtilizationStatus(member.utilization)
    
    if (status.status === 'overutilized') {
      addToast({
        type: 'warning',
        title: `${member.name} is overutilized`,
        description: `At ${member.utilization}% utilization, consider redistributing tasks to prevent burnout.`,
        duration: 5000
      })
    } else if (status.status === 'underutilized') {
      addToast({
        type: 'info',
        title: `${member.name} has additional capacity`,
        description: `At ${member.utilization}% utilization, they may be able to take on more tasks.`,
        duration: 4000
      })
    } else {
      addToast({
        type: 'success',
        title: `${member.name} performance details`,
        description: `${member.completed}/${member.tasks} tasks completed with ${member.utilization}% utilization.`,
        duration: 3000
      })
    }
  }

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
        {teamData.map((member, index) => {
          const status = getUtilizationStatus(member.utilization)
          const StatusIcon = status.icon
          const isHovered = hoveredMember === member.name
          
          return (
            <button 
              key={index} 
              className={`relative flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer w-full text-left ${
                isHovered ? 'bg-blue-50 border border-blue-200 shadow-md' : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onMouseEnter={() => setHoveredMember(member.name)}
              onMouseLeave={() => setHoveredMember(null)}
              onClick={() => handleMemberClick(member)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {member.avatar}
                  </div>
                  {/* Status indicator */}
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                    status.bgColor
                  }`}>
                    <StatusIcon className={`w-3 h-3 ${status.color}`} />
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium transition-colors ${
                    isHovered ? 'text-blue-900' : 'text-gray-900'
                  }`}>{member.name}</p>
                  <p className="text-xs text-gray-600">{member.role}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-gray-900">{member.completed}/{member.tasks}</p>
                  <p className="text-xs text-gray-600">Tasks</p>
                </div>
                <div className="text-center">
                  <p className={`font-medium ${status.color}`}>
                    {member.utilization}%
                  </p>
                  <p className="text-xs text-gray-600">Util.</p>
                </div>
                
                {/* External link indicator */}
                <div className={`transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </button>
          )
        })}
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

