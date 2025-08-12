'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'
import Generator from '@/components/Generator'
import CustomWorkoutBuilder from '@/components/CustomWorkoutBuilder'
import ScheduleWorkoutModal from '@/components/ScheduleWorkoutModal'
import { generateWorkout } from '@/utils/functions'
import type { Exercise } from '@/types'

const GeneratePage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { startWorkoutSession } = useWorkoutTracking()
  
  const [workout, setWorkout] = useState<Exercise[] | null>(null)
  const [poison, setPoison] = useState<string>('individual')
  const [muscles, setMuscles] = useState<string[]>([])
  const [goal, setGoal] = useState<string>('strength_power')
  const [showCustomBuilder, setShowCustomBuilder] = useState<boolean>(false)
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false)

  const updateWorkout = (): void => {
    if (muscles.length < 1) {
      return
    }
    const newWorkout = generateWorkout({ poison, muscles, goal })
    setWorkout(newWorkout)
    setShowCustomBuilder(false)
  }

  const startWorkout = () => {
    if (!workout) return
    
    if (user) {
      startWorkoutSession(workout, poison, muscles, goal)
      router.push('/workout')
    } else {
      sessionStorage.setItem('tempWorkout', JSON.stringify({
        workout,
        poison,
        muscles,
        goal
      }))
      router.push('/workout')
    }
  }

  const handleEditWorkout = () => {
    setShowCustomBuilder(true)
  }

  const handleScheduleWorkout = () => {
    setShowScheduleModal(true)
  }

  const handleScheduleConfirm = (scheduledWorkout: any) => {
    // Save to localStorage (in a real app, this would go to your backend)
    const existingSchedule = JSON.parse(localStorage.getItem('scheduledWorkouts') || '[]')
    const newScheduledWorkout = {
      id: Date.now().toString(),
      ...scheduledWorkout
    }
    localStorage.setItem('scheduledWorkouts', JSON.stringify([...existingSchedule, newScheduledWorkout]))
    
    setShowScheduleModal(false)
    
    // Show success message or redirect to schedule page
    router.push('/schedule')
  }

  const handleSaveEditedWorkout = (editedWorkout: Exercise[], name: string, description?: string) => {
    setWorkout(editedWorkout)
    setShowCustomBuilder(false)
    console.log('Workout edited and saved as template:', name)
  }

  const handleStartEditedWorkout = (editedWorkout: Exercise[]) => {
    setWorkout(editedWorkout)
    setShowCustomBuilder(false)
    
    if (user) {
      startWorkoutSession(editedWorkout, poison, muscles, goal)
      router.push('/workout')
    } else {
      sessionStorage.setItem('tempWorkout', JSON.stringify({
        workout: editedWorkout,
        poison,
        muscles,
        goal
      }))
      router.push('/workout')
    }
  }

  // If showing custom builder for editing
  if (showCustomBuilder && workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => setShowCustomBuilder(false)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Generated Workout
          </button>

          <CustomWorkoutBuilder
            initialWorkout={workout}
            mode="edit"
            onSaveWorkout={handleSaveEditedWorkout}
            onStartWorkout={handleStartEditedWorkout}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Build Your <span className="text-emerald-600">Perfect</span> Workout
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Customize your training based on your goals, available time, and target muscle groups
          </p>
        </div>

        {/* Generator Component */}
        <Generator 
          poison={poison} 
          setPoison={setPoison} 
          muscles={muscles} 
          setMuscles={setMuscles} 
          goal={goal} 
          setGoal={setGoal} 
          updateWorkout={updateWorkout} 
        />

        {/* Generated Workout Preview */}
        {workout && (
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Your Workout is Ready!
                  </h2>
                  <p className="text-gray-600">
                    {workout.length} exercises • Target: {muscles.join(', ')} • Goal: {goal.replace('_', ' ')}
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-dumbbell text-emerald-600 text-2xl"></i>
                  </div>
                </div>
              </div>

              {/* Workout Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {workout.slice(0, 4).map((exercise, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {exercise.name.replaceAll("_", " ")}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded capitalize">
                        {exercise.type}
                      </span>
                      <span>{exercise.reps} {exercise.unit}</span>
                      <span>{exercise.rest}s rest</span>
                    </div>
                  </div>
                ))}
                {workout.length > 4 && (
                  <div className="bg-emerald-50 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        +{workout.length - 4}
                      </div>
                      <div className="text-emerald-700 text-sm">More exercises</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={startWorkout}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i className="fas fa-play mr-2"></i>
                  Start Now
                </button>
                
                <button
                  onClick={handleScheduleWorkout}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300"
                >
                  <i className="fas fa-calendar-plus mr-2"></i>
                  Schedule
                </button>
                
                <button
                  onClick={handleEditWorkout}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit
                </button>
                
                <button
                  onClick={updateWorkout}
                  className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Generate New
                </button>
              </div>

              {/* Login Prompt for Guest Users */}
              {!user && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-info-circle text-blue-600 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Want to track your progress?
                      </h4>
                      <p className="text-blue-800 text-sm">
                        Sign up for a free account to save your workouts, track your sets, and monitor your progress over time.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Choose FitForce Workouts?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dumbbell text-emerald-600 text-2xl"></i>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Personalized Workouts</h4>
              <p className="text-gray-600">
              Workouts tailored to your goals and preferences
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-blue-600 text-2xl"></i>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h4>
              <p className="text-gray-600">
              Monitor your sets, reps, and workout history over time
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-play text-purple-600 text-2xl"></i>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Video Guides</h4>
              <p className="text-gray-600">
              Learn proper form with integrated exercise demonstration videos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleWorkoutModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleConfirm}
        workout={workout ? {
          exercises: workout,
          workoutType: poison,
          targetMuscles: muscles,
          goal: goal,
          name: `${poison.replace('_', ' ')} Workout`
        } : undefined}
      />
    </div>
  )
}

export default GeneratePage