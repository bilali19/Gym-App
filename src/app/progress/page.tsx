'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'
import ProgressCharts from '@/components/ProgressCharts'

const ProgressPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { workoutHistory, getWorkoutStats } = useWorkoutTracking()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

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
          <p className="text-gray-600">Loading progress...</p>
        </div>
      </div>
    )
  }

  const stats = getWorkoutStats()

  // Calculate progress metrics
  const getProgressMetrics = () => {
    if (workoutHistory.length === 0) return null

    const now = new Date()
    const periodDays = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    }

    const cutoffDate = new Date(now.getTime() - (periodDays[selectedPeriod] * 24 * 60 * 60 * 1000))
    
    const currentPeriodWorkouts = workoutHistory.filter(w => new Date(w.date) >= cutoffDate)
    const previousPeriodStart = new Date(cutoffDate.getTime() - (periodDays[selectedPeriod] * 24 * 60 * 60 * 1000))
    const previousPeriodWorkouts = workoutHistory.filter(w => {
      const date = new Date(w.date)
      return date >= previousPeriodStart && date < cutoffDate
    })

    const currentStats = {
      workouts: currentPeriodWorkouts.length,
      sets: currentPeriodWorkouts.reduce((sum, w) => sum + w.completedSets, 0),
      duration: currentPeriodWorkouts.reduce((sum, w) => {
        if (w.endTime) {
          return sum + (new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60)
        }
        return sum
      }, 0)
    }

    const previousStats = {
      workouts: previousPeriodWorkouts.length,
      sets: previousPeriodWorkouts.reduce((sum, w) => sum + w.completedSets, 0),
      duration: previousPeriodWorkouts.reduce((sum, w) => {
        if (w.endTime) {
          return sum + (new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60)
        }
        return sum
      }, 0)
    }

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    return {
      current: currentStats,
      previous: previousStats,
      changes: {
        workouts: calculateChange(currentStats.workouts, previousStats.workouts),
        sets: calculateChange(currentStats.sets, previousStats.sets),
        duration: calculateChange(currentStats.duration, previousStats.duration)
      }
    }
  }

  const progressMetrics = getProgressMetrics()

  // Get personal records
  const getPersonalRecords = () => {
    const records: { exercise: string; weight: number; reps: number; date: string }[] = []
    
    workoutHistory.forEach(workout => {
      // Safely handle exercises array
      const exercises = Array.isArray(workout.exercises) ? workout.exercises : []
      exercises.forEach(exercise => {
        if (!exercise || !exercise.sets || !Array.isArray(exercise.sets)) return
        
        const completedSets = exercise.sets.filter(set => 
          set && set.completed && set.weight && set.actualReps
        )
        
        completedSets.forEach(set => {
          if (!set.weight || !set.actualReps) return
          
          const existingRecord = records.find(r => r.exercise === exercise.name)
          
          if (!existingRecord) {
            records.push({
              exercise: exercise.name,
              weight: set.weight,
              reps: set.actualReps,
              date: workout.date
            })
          } else {
            // Update if this is a better record (higher weight or more reps at same weight)
            if (set.weight > existingRecord.weight || 
                (set.weight === existingRecord.weight && set.actualReps > existingRecord.reps)) {
              existingRecord.weight = set.weight
              existingRecord.reps = set.actualReps
              existingRecord.date = workout.date
            }
          }
        })
      })
    })

    return records
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5) // Top 5 PRs
  }

  const personalRecords = getPersonalRecords()

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return 'fas fa-arrow-up'
    if (change < 0) return 'fas fa-arrow-down'
    return 'fas fa-minus'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Progress Analytics
          </h1>
          <p className="text-gray-600">
            Track your fitness journey and see how you're improving over time
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Period</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedPeriod === period
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <div className="font-medium capitalize">{period}</div>
                  <div className="text-sm opacity-75">
                    Last {period === 'week' ? '7 days' : period === 'month' ? '30 days' : period === 'quarter' ? '3 months' : '12 months'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Comparison */}
        {progressMetrics && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Progress Comparison - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {progressMetrics.current.workouts}
                  </div>
                  <div className="text-gray-600 mb-2">Workouts</div>
                  <div className={`flex items-center justify-center gap-1 text-sm ${getChangeColor(progressMetrics.changes.workouts)}`}>
                    <i className={getChangeIcon(progressMetrics.changes.workouts)}></i>
                    <span>{Math.abs(progressMetrics.changes.workouts)}%</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {progressMetrics.current.sets}
                  </div>
                  <div className="text-gray-600 mb-2">Sets Completed</div>
                  <div className={`flex items-center justify-center gap-1 text-sm ${getChangeColor(progressMetrics.changes.sets)}`}>
                    <i className={getChangeIcon(progressMetrics.changes.sets)}></i>
                    <span>{Math.abs(progressMetrics.changes.sets)}%</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatDuration(progressMetrics.current.duration)}
                  </div>
                  <div className="text-gray-600 mb-2">Total Time</div>
                  <div className={`flex items-center justify-center gap-1 text-sm ${getChangeColor(progressMetrics.changes.duration)}`}>
                    <i className={getChangeIcon(progressMetrics.changes.duration)}></i>
                    <span>{Math.abs(progressMetrics.changes.duration)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Charts */}
        <ProgressCharts className="mb-8" />

        {/* Personal Records and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Personal Records */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-trophy text-yellow-500"></i>
              Personal Records
            </h3>
            {personalRecords.length > 0 ? (
              <div className="space-y-4">
                {personalRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {record.exercise.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(record.date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">
                        {record.weight}lbs
                      </div>
                      <div className="text-sm text-gray-600">
                        {record.reps} reps
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Complete workouts with weights to see your personal records!
              </p>
            )}
          </div>

          {/* Consistency Tracker */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-calendar-check text-emerald-500"></i>
              Consistency Tracker
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-bold text-emerald-600">
                  {(() => {
                    // Calculate current streak
                    let streak = 0
                    const today = new Date()
                    const sortedWorkouts = [...workoutHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    
                    for (let i = 0; i < 7; i++) {
                      const checkDate = new Date(today)
                      checkDate.setDate(today.getDate() - i)
                      const dateStr = checkDate.toISOString().split('T')[0]
                      
                      if (sortedWorkouts.some(w => w.date === dateStr)) {
                        streak++
                      } else if (i > 0) {
                        break
                      }
                    }
                    
                    return streak
                  })()} days
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Week</span>
                <span className="font-bold text-blue-600">
                  {workoutHistory.filter(w => {
                    const workoutDate = new Date(w.date)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return workoutDate >= weekAgo
                  }).length} workouts
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Month</span>
                <span className="font-bold text-purple-600">
                  {workoutHistory.filter(w => {
                    const workoutDate = new Date(w.date)
                    const monthAgo = new Date()
                    monthAgo.setDate(monthAgo.getDate() - 30)
                    return workoutDate >= monthAgo
                  }).length} workouts
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Weekly Goal Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, (workoutHistory.filter(w => {
                        const workoutDate = new Date(w.date)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return workoutDate >= weekAgo
                      }).length / 3) * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Goal: 3 workouts per week</div>
              </div>
            </div>
          </div>
        </div>

        {/* All-Time Stats */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">All-Time Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.totalWorkouts}</div>
              <div className="text-emerald-100">Total Workouts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.totalSets}</div>
              <div className="text-emerald-100">Total Sets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {formatDuration(workoutHistory.reduce((sum, w) => {
                  if (w.endTime) {
                    return sum + (new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60)
                  }
                  return sum
                }, 0))}
              </div>
              <div className="text-emerald-100">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 capitalize">
                {stats.mostTargetedMuscle || 'None'}
              </div>
              <div className="text-emerald-100">Favorite Muscle</div>
            </div>
          </div>
        </div>

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

export default ProgressPage