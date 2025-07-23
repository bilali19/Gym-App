'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'
import WorkoutCalendar from '@/components/WorkoutCalendar'
import ScheduleWorkoutModal from '@/components/ScheduleWorkoutModal'
import type { Exercise } from '@/types'

interface ScheduledWorkout {
  id: string
  date: string
  time?: string
  name: string
  type: 'generated' | 'custom' | 'template'
  exercises: Exercise[]
  workoutType: string
  targetMuscles: string[]
  goal: string
  notes?: string
  completed?: boolean
  completedAt?: string
}

const SchedulePage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { startWorkoutSession } = useWorkoutTracking()
  
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([])
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [todaysWorkouts, setTodaysWorkouts] = useState<ScheduledWorkout[]>([])
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<ScheduledWorkout[]>([])

  // Load scheduled workouts
  useEffect(() => {
    const saved = localStorage.getItem('scheduledWorkouts')
    if (saved) {
      const workouts = JSON.parse(saved)
      setScheduledWorkouts(workouts)
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0]
      
      // Filter today's workouts
      const todayWorkouts = workouts.filter((w: ScheduledWorkout) => w.date === today && !w.completed)
      setTodaysWorkouts(todayWorkouts)
      
      // Filter upcoming workouts (next 7 days, excluding today)
      const upcoming = workouts.filter((w: ScheduledWorkout) => {
        const workoutDate = new Date(w.date)
        const todayDate = new Date(today)
        const weekFromToday = new Date(todayDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        
        return workoutDate > todayDate && workoutDate <= weekFromToday && !w.completed
      }).slice(0, 5)
      setUpcomingWorkouts(upcoming)
    }
  }, [])

  // Save scheduled workouts whenever they change
  useEffect(() => {
    if (scheduledWorkouts.length > 0) {
      localStorage.setItem('scheduledWorkouts', JSON.stringify(scheduledWorkouts))
    }
  }, [scheduledWorkouts])

  const handleScheduleWorkout = (workout: any, date?: string) => {
    setSelectedWorkout(workout)
    setSelectedDate(date || new Date().toISOString().split('T')[0])
    setShowScheduleModal(true)
  }

  const handleScheduleConfirm = (scheduledWorkout: any) => {
    const newWorkout: ScheduledWorkout = {
      ...scheduledWorkout,
      id: Date.now().toString() // Generate unique ID here instead of inside the object
    }
    
    setScheduledWorkouts(prev => [...prev, newWorkout])
    
    // Update today's workouts if it's for today
    const today = new Date().toISOString().split('T')[0]
    if (scheduledWorkout.date === today) {
      setTodaysWorkouts(prev => [...prev, newWorkout])
    }
    
    setShowScheduleModal(false)
    setSelectedWorkout(null)
  }

  const handleStartWorkout = (workout: ScheduledWorkout) => {
    if (!workout.exercises || workout.exercises.length === 0) {
      // If no exercises (quick schedule), redirect to generator with pre-filled data
      const params = new URLSearchParams({
        type: workout.workoutType,
        muscles: workout.targetMuscles.join(','),
        goal: workout.goal
      })
      router.push(`/generate?${params.toString()}`)
      return
    }

    if (user) {
      // Mark workout as started and start tracking
      startWorkoutSession(workout.exercises, workout.workoutType, workout.targetMuscles, workout.goal)
      router.push('/workout')
    } else {
      // Store in session for guest users
      sessionStorage.setItem('tempWorkout', JSON.stringify({
        workout: workout.exercises,
        poison: workout.workoutType,
        muscles: workout.targetMuscles,
        goal: workout.goal
      }))
      router.push('/workout')
    }
  }

  const handleCompleteWorkout = (workoutId: string) => {
    setScheduledWorkouts(prev => 
      prev.map(w => 
        w.id === workoutId 
          ? { ...w, completed: true, completedAt: new Date().toISOString() }
          : w
      )
    )
    
    // Remove from today's workouts
    setTodaysWorkouts(prev => prev.filter(w => w.id !== workoutId))
  }

  const handleDeleteWorkout = (workoutId: string) => {
    setScheduledWorkouts(prev => prev.filter(w => w.id !== workoutId))
    setTodaysWorkouts(prev => prev.filter(w => w.id !== workoutId))
    setUpcomingWorkouts(prev => prev.filter(w => w.id !== workoutId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const hour12 = parseInt(hours) % 12 || 12
    const amPm = parseInt(hours) >= 12 ? 'PM' : 'AM' // Fixed variable name
    return `${hour12}:${minutes} ${amPm}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Workout Schedule
          </h1>
          <p className="text-gray-600">
            Plan your workouts and stay consistent with your fitness goals
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => handleScheduleWorkout(null)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Schedule New Workout
          </button>
          
          <button
            onClick={() => router.push('/generate')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <i className="fas fa-robot mr-2"></i>
            Generate & Schedule
          </button>
          
          <button
            onClick={() => router.push('/custom-workout')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <i className="fas fa-wrench mr-2"></i>
            Build & Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Today's Workouts & Upcoming */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Workouts */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-calendar-day text-emerald-600"></i>
                Today's Workouts
              </h3>
              
              {todaysWorkouts.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <i className="fas fa-calendar-plus text-2xl mb-2"></i>
                  <p className="text-sm">No workouts scheduled for today</p>
                  <button
                    onClick={() => handleScheduleWorkout(null, new Date().toISOString().split('T')[0])}
                    className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Schedule one now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysWorkouts.map((workout) => (
                    <div key={workout.id} className="border border-emerald-200 rounded-lg p-3 bg-emerald-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-emerald-900">{workout.name}</h4>
                          {workout.time && (
                            <p className="text-sm text-emerald-700">{formatTime(workout.time)}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartWorkout(workout)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                        >
                          <i className="fas fa-play mr-1"></i>
                          Start
                        </button>
                        <button
                          onClick={() => handleCompleteWorkout(workout.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Workouts */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-clock text-blue-600"></i>
                Upcoming
              </h3>
              
              {upcomingWorkouts.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <i className="fas fa-calendar-alt text-2xl mb-2"></i>
                  <p className="text-sm">No upcoming workouts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingWorkouts.map((workout) => (
                    <div key={workout.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{workout.name}</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(workout.date)}
                            {workout.time && ` at ${formatTime(workout.time)}`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Calendar */}
          <div className="lg:col-span-3">
            <WorkoutCalendar
              onScheduleWorkout={(workout) => {
                const newWorkout: ScheduledWorkout = {
                  ...workout,
                  id: Date.now().toString()
                }
                setScheduledWorkouts(prev => [...prev, newWorkout])
              }}
              onStartWorkout={handleStartWorkout}
              onDeleteScheduledWorkout={handleDeleteWorkout}
              className="h-full"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">Weekly Schedule Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {scheduledWorkouts.filter(w => {
                  const workoutDate = new Date(w.date)
                  const today = new Date()
                  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
                  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
                  return workoutDate >= weekStart && workoutDate <= weekEnd
                }).length}
              </div>
              <div className="text-emerald-100">This Week</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {scheduledWorkouts.filter(w => w.completed).length}
              </div>
              <div className="text-emerald-100">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {scheduledWorkouts.filter(w => {
                  const workoutDate = new Date(w.date)
                  const today = new Date()
                  return workoutDate > today && !w.completed
                }).length}
              </div>
              <div className="text-emerald-100">Upcoming</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {Math.round((scheduledWorkouts.filter(w => w.completed).length / Math.max(scheduledWorkouts.length, 1)) * 100)}%
              </div>
              <div className="text-emerald-100">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleWorkoutModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false)
          setSelectedWorkout(null)
        }}
        onSchedule={handleScheduleConfirm}
        initialDate={selectedDate}
        workout={selectedWorkout}
      />
    </div>
  )
}

export default SchedulePage