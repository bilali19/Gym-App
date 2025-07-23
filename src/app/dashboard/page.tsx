'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'

const DashboardPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { workoutHistory, getWorkoutStats, currentSession, startWorkoutSession } = useWorkoutTracking()

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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = getWorkoutStats()
  const recentWorkouts = workoutHistory.slice(0, 5)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getWorkoutDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'In Progress'
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    return formatDuration((end - start) / (1000 * 60))
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            Ready to crush your fitness goals today?
          </p>
        </div>

        {/* Active Workout Alert */}
        {currentSession && (
          <div className="mb-8">
            <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div>
                    <h3 className="font-semibold text-emerald-800">
                      Active Workout in Progress
                    </h3>
                    <p className="text-emerald-700">
                      {currentSession.workoutType.replace('_', ' ')} • 
                      {currentSession.completedSets}/{currentSession.totalSets} sets completed
                    </p>
                  </div>
                </div>
                <Link
                  href="/workout"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Continue
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Today's Scheduled Workouts */}
        {(() => {
          const today = new Date().toISOString().split('T')[0]
          const scheduledWorkouts = typeof window !== 'undefined' 
            ? JSON.parse(localStorage.getItem('scheduledWorkouts') || '[]')
            : []
          const todaysWorkouts = scheduledWorkouts.filter((w: any) => w.date === today && !w.completed)
          
          return todaysWorkouts.length > 0 && (
            <div className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-calendar-day text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Today's Scheduled Workouts
                      </h3>
                      <p className="text-blue-700 text-sm">
                        You have {todaysWorkouts.length} workout{todaysWorkouts.length > 1 ? 's' : ''} planned for today
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/schedule"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View Schedule
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todaysWorkouts.slice(0, 2).map((workout: any) => (
                    <div key={workout.id} className="bg-white border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{workout.name}</h4>
                          {workout.time && (
                            <p className="text-sm text-gray-600">
                              {new Date(`2000-01-01 ${workout.time}`).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                          )}
                        </div>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          Scheduled
                        </span>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            // Handle starting scheduled workout
                            if (workout.exercises && workout.exercises.length > 0) {
                              if (user) {
                                startWorkoutSession(workout.exercises, workout.workoutType, workout.targetMuscles, workout.goal)
                                router.push('/workout')
                              } else {
                                sessionStorage.setItem('tempWorkout', JSON.stringify({
                                  workout: workout.exercises,
                                  poison: workout.workoutType,
                                  muscles: workout.targetMuscles,
                                  goal: workout.goal
                                }))
                                router.push('/workout')
                              }
                            } else {
                              // Redirect to generator for quick workouts
                              router.push('/generate')
                            }
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                        >
                          <i className="fas fa-play mr-1"></i>
                          Start
                        </button>
                        <button
                          onClick={() => {
                            // Mark as completed
                            const updatedWorkouts = scheduledWorkouts.map((w: any) =>
                              w.id === workout.id ? { ...w, completed: true, completedAt: new Date().toISOString() } : w
                            )
                            localStorage.setItem('scheduledWorkouts', JSON.stringify(updatedWorkouts))
                            window.location.reload()
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {todaysWorkouts.length > 2 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-600">+{todaysWorkouts.length - 2}</div>
                        <div className="text-sm text-gray-500">More workouts</div>
                        <Link
                          href="/schedule"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/generate"
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Generate Workout</h3>
                <p className="text-emerald-100">AI-powered routine creation</p>
              </div>
              <i className="fas fa-robot text-3xl text-emerald-200"></i>
            </div>
          </Link>

          <Link
            href="/custom-workout"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Custom Builder</h3>
                <p className="text-blue-100">Build your own routine</p>
              </div>
              <i className="fas fa-wrench text-3xl text-blue-200"></i>
            </div>
          </Link>

          <Link
            href="/schedule"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Schedule</h3>
                <p className="text-purple-100">Plan your workouts</p>
              </div>
              <i className="fas fa-calendar-alt text-3xl text-purple-200"></i>
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.totalWorkouts}</div>
            <div className="text-gray-600">Total Workouts</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalSets}</div>
            <div className="text-gray-600">Sets Completed</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {formatDuration(stats.averageWorkoutTime)}
            </div>
            <div className="text-gray-600">Avg Duration</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-lg font-bold text-orange-600 mb-2 capitalize">
              {stats.mostTargetedMuscle || 'None'}
            </div>
            <div className="text-gray-600">Top Muscle</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            {workoutHistory.length > 5 && (
              <Link
                href="/history"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All
              </Link>
            )}
          </div>

          {recentWorkouts.length > 0 ? (
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-dumbbell text-emerald-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {workout.workoutType.replace('_', ' ')} Workout
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {workout.targetMuscles.join(', ')} • {workout.completedSets} sets • {workout.exercises.length} exercises
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 font-medium">{formatDate(workout.date)}</div>
                    <div className="text-emerald-600 text-sm">
                      {getWorkoutDuration(workout.startTime, workout.endTime)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dumbbell text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No workouts yet</h3>
              <p className="text-gray-600 mb-6">
                Start your fitness journey by generating your first workout!
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <i className="fas fa-plus mr-2"></i>
                Create First Workout
              </Link>
            </div>
          )}
        </div>

        {/* Motivational Section */}
        <div className="mt-8 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Keep Going Strong! 💪</h3>
          <p className="text-emerald-100 mb-6">
            {stats.totalWorkouts === 0 
              ? "Every expert was once a beginner. Start your journey today!"
              : stats.totalWorkouts < 5
              ? "You're building great habits! Keep up the momentum."
              : stats.totalWorkouts < 20
              ? "You're on fire! Your consistency is paying off."
              : "You're a true fitness warrior! Your dedication is inspiring."
            }
          </p>
          {!currentSession && (
            <Link
              href="/generate"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-emerald-600 hover:text-emerald-700 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Today's Workout
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage