'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

const UserProfile = ({ isOpen, onClose }: UserProfileProps) => {
  const { user, logout } = useAuth()
  const { workoutHistory, getWorkoutStats } = useWorkoutTracking()
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview')

  if (!isOpen || !user) return null

  const stats = getWorkoutStats()

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getWorkoutDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'In Progress'
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    return formatDuration((end - start) / (1000 * 60))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-emerald-100">{user.email}</p>
              <p className="text-emerald-200 text-sm">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-emerald-200 text-xl bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Workout History
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{stats.totalWorkouts}</div>
                  <div className="text-gray-600 text-sm">Total Workouts</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalSets}</div>
                  <div className="text-gray-600 text-sm">Sets Completed</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatDuration(stats.averageWorkoutTime)}
                  </div>
                  <div className="text-gray-600 text-sm">Avg Duration</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-orange-600 capitalize">
                    {stats.mostTargetedMuscle}
                  </div>
                  <div className="text-gray-600 text-sm">Top Muscle</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                {workoutHistory.length > 0 ? (
                  <div className="space-y-3">
                    {workoutHistory.slice(0, 5).map((workout) => (
                      <div
                        key={workout.id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
                      >
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {workout.workoutType.replace('_', ' ')} Workout
                          </div>
                          <div className="text-sm text-gray-600">
                            {workout.targetMuscles.join(', ')} • {workout.completedSets} sets
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{formatDate(workout.date)}</div>
                          <div className="text-sm text-emerald-600">
                            {getWorkoutDuration(workout.startTime, workout.endTime)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No workouts yet. Start your first workout to see your progress here!
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {workoutHistory.length > 0 ? (
                workoutHistory.map((workout) => (
                  <div
                    key={workout.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {workout.workoutType.replace('_', ' ')} Workout
                        </h4>
                        <p className="text-gray-600 capitalize">
                          Target: {workout.targetMuscles.join(', ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Goal: {workout.goal.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{formatDate(workout.date)}</div>
                        <div className="text-sm text-emerald-600">
                          {getWorkoutDuration(workout.startTime, workout.endTime)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center bg-gray-50 rounded-lg p-3">
                        <div className="font-semibold text-gray-900">{workout.exercises.length}</div>
                        <div className="text-sm text-gray-600">Exercises</div>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-3">
                        <div className="font-semibold text-gray-900">{workout.completedSets}</div>
                        <div className="text-sm text-gray-600">Sets</div>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-3">
                        <div className="font-semibold text-gray-900">
                          {Math.round((workout.completedSets / workout.totalSets) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Complete</div>
                      </div>
                    </div>

                    {workout.notes && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-900 mb-1">Notes:</div>
                        <div className="text-sm text-blue-800">{workout.notes}</div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No workout history available.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile