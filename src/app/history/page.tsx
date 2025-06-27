'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'

const HistoryPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { workoutHistory } = useWorkoutTracking()
  
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getWorkoutDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'Incomplete'
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    return formatDuration((end - start) / (1000 * 60))
  }

  // Filter workouts based on selected filters
  const filteredWorkouts = workoutHistory.filter(workout => {
    // Filter by workout type
    if (selectedFilter !== 'all' && workout.workoutType !== selectedFilter) {
      return false
    }

    // Filter by timeframe
    if (selectedTimeframe !== 'all') {
      const workoutDate = new Date(workout.date)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (selectedTimeframe) {
        case 'week':
          if (daysDiff > 7) return false
          break
        case 'month':
          if (daysDiff > 30) return false
          break
        case 'quarter':
          if (daysDiff > 90) return false
          break
      }
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        workout.workoutType.toLowerCase().includes(searchLower) ||
        workout.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchLower)) ||
        workout.goal.toLowerCase().includes(searchLower) ||
        (workout.notes && workout.notes.toLowerCase().includes(searchLower))
      )
    }

    return true
  })

  // Get unique workout types for filter
  const workoutTypes = ['all', ...Array.from(new Set(workoutHistory.map(w => w.workoutType)))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Workout History
          </h1>
          <p className="text-gray-600">
            Track your fitness journey and see how far you've come
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Workouts
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by type, muscle, or notes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>

            {/* Workout Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Type
              </label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {workoutTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeframe
              </label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Showing {filteredWorkouts.length} of {workoutHistory.length} workouts
            </p>
          </div>
        </div>

        {/* Workout List */}
        {filteredWorkouts.length > 0 ? (
          <div className="space-y-6">
            {filteredWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Workout Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-dumbbell text-emerald-600"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 capitalize">
                          {workout.workoutType.replace('_', ' ')} Workout
                        </h3>
                        <p className="text-gray-600">
                          {formatDate(workout.date)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="font-semibold text-gray-900">
                          {Math.round((workout.completedSets / workout.totalSets) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Complete</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {workout.goal.replace('_', ' ')}
                      </span>
                      {workout.targetMuscles.map((muscle) => (
                        <span
                          key={muscle}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium capitalize"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>

                    {workout.notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-900 mb-1">Notes:</div>
                        <div className="text-sm text-blue-800">{workout.notes}</div>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="lg:text-right">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      {workout.completedSets}
                    </div>
                    <div className="text-gray-600 text-sm">sets completed</div>
                    
                    {workout.endTime && (
                      <div className="mt-3">
                        <div className="text-lg font-semibold text-gray-900">
                          {getWorkoutDuration(workout.startTime, workout.endTime)}
                        </div>
                        <div className="text-gray-600 text-sm">workout time</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Exercise Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <strong>Exercises:</strong> {workout.exercises.slice(0, 3).map(ex => ex.name.replace(/_/g, ' ')).join(', ')}
                      {workout.exercises.length > 3 && ` and ${workout.exercises.length - 3} more`}
                    </div>
                    <button
                      onClick={() => {
                        // Could expand to show full workout details
                        console.log('Show workout details:', workout.id)
                      }}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No workouts found
            </h3>
            <p className="text-gray-600 mb-6">
              {workoutHistory.length === 0 
                ? "You haven't completed any workouts yet. Start your fitness journey today!"
                : "Try adjusting your filters to find the workouts you're looking for."
              }
            </p>
            {workoutHistory.length === 0 ? (
              <button
                onClick={() => router.push('/generate')}
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <i className="fas fa-plus mr-2"></i>
                Generate First Workout
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedFilter('all')
                  setSelectedTimeframe('all')
                  setSearchTerm('')
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <i className="fas fa-refresh mr-2"></i>
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Statistics Summary */}
        {workoutHistory.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">Your Fitness Journey</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{workoutHistory.length}</div>
                <div className="text-emerald-100">Total Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {workoutHistory.reduce((sum, w) => sum + w.completedSets, 0)}
                </div>
                <div className="text-emerald-100">Total Sets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {Math.round(workoutHistory.reduce((sum, w) => {
                    if (w.endTime) {
                      const duration = (new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60)
                      return sum + duration
                    }
                    return sum
                  }, 0))}m
                </div>
                <div className="text-emerald-100">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {(() => {
                    const completedWorkouts = workoutHistory.filter(w => w.endTime).length
                    if (completedWorkouts === 0) return '0%'
                    const totalSets = workoutHistory.reduce((sum, w) => sum + w.totalSets, 0)
                    const completedSets = workoutHistory.reduce((sum, w) => sum + w.completedSets, 0)
                    return Math.round((completedSets / totalSets) * 100) + '%'
                  })()}
                </div>
                <div className="text-emerald-100">Completion Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-lg transition-all duration-200"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage