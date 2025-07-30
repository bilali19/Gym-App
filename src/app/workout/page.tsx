'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'
import ExerciseCard from '@/components/ExerciseCard'
import RestTimerSettings from '@/components/RestTimerSettings'
import type { Exercise } from '@/types'

const WorkoutPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { currentSession, completeWorkout, cancelWorkout } = useWorkoutTracking()
  
  const [guestWorkout, setGuestWorkout] = useState<Exercise[] | null>(null)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [elapsedTime, setElapsedTime] = useState(0)

  // Load guest workout if no session
  useEffect(() => {
    if (!currentSession && !user) {
      const tempWorkout = sessionStorage.getItem('tempWorkout')
      if (tempWorkout) {
        const data = JSON.parse(tempWorkout)
        setGuestWorkout(data.workout)
      } else {
        router.push('/generate')
      }
    }
  }, [currentSession, user, router])

  // Timer for workout duration
  useEffect(() => {
    const sessionStart = currentSession ? new Date(currentSession.startTime) : startTime
    
    const timer = setInterval(() => {
      const now = new Date()
      const elapsed = Math.floor((now.getTime() - sessionStart.getTime()) / 1000)
      setElapsedTime(elapsed)
    }, 1000)

    return () => clearInterval(timer)
  }, [currentSession, startTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleCompleteWorkout = () => {
    if (currentSession) {
      completeWorkout(workoutNotes)
      router.push('/dashboard')
    } else {
      // For guest users, just redirect
      sessionStorage.removeItem('tempWorkout')
      router.push('/')
    }
  }

  const handleCancelWorkout = () => {
    if (currentSession) {
      cancelWorkout()
    } else {
      sessionStorage.removeItem('tempWorkout')
    }
    router.push('/')
  }

  const workoutData = currentSession || guestWorkout
  const exercises = currentSession?.exercises || guestWorkout || []

  if (!workoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workout...</p>
        </div>
      </div>
    )
  }

  const completedSets = currentSession?.completedSets || 0
  const totalSets = currentSession?.totalSets || exercises.length * 5
  const progressPercentage = Math.round((completedSets / totalSets) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">Active Workout</h1>
              <p className="text-emerald-100">
                {currentSession ? (
                  <>
                    {currentSession.workoutType.replace('_', ' ')} • 
                    Target: {currentSession.targetMuscles.join(', ')} • 
                    Goal: {currentSession.goal.replace('_', ' ')}
                  </>
                ) : (
                  'Guest Workout Session'
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
                <div className="text-emerald-200 text-sm">Duration</div>
              </div>
              
              {currentSession && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{completedSets}/{totalSets}</div>
                  <div className="text-emerald-200 text-sm">Sets</div>
                </div>
              )}

              {/* Settings Button */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors duration-200"
                title="Rest Timer Settings"
              >
                <i className="fas fa-cog text-lg"></i>
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          {currentSession && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-emerald-100 text-sm">Workout Progress</span>
                <span className="text-white font-semibold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-emerald-700 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workout Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowCompleteModal(true)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <i className="fas fa-check mr-2"></i>
            Complete Workout
          </button>
          
          <button
            onClick={handleCancelWorkout}
            className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel
          </button>
        </div>

        {/* Exercises */}
        <div className="space-y-6">
          {exercises.map((exercise, index) => (
            <ExerciseCard 
              key={index} 
              exercise={exercise} 
              i={index}
            />
          ))}
        </div>

        {/* Guest User Notice */}
        {!user && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-blue-600 mt-1"></i>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Track Your Progress
                </h3>
                <p className="text-blue-800 mb-4">
                  Sign up for a free account to automatically save your workout data, 
                  track your progress over time, and get personalized insights.
                </p>
                <button 
                  onClick={() => router.push('/?auth=signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Complete Workout Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Complete Workout?
            </h3>
            <p className="text-gray-600 mb-6">
              Great job! You've been working out for {formatTime(elapsedTime)}. 
              {currentSession && ` You completed ${completedSets} out of ${totalSets} sets.`}
            </p>
            
            {user && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Notes (Optional)
                </label>
                <textarea
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="How did the workout feel? Any observations?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                />
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                onClick={handleCompleteWorkout}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Complete
              </button>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest Timer Settings Modal */}
      <RestTimerSettings
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  )
}

export default WorkoutPage