'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'
import CustomWorkoutBuilder from '@/components/CustomWorkoutBuilder'
import type { Exercise } from '@/types'

const CustomWorkoutPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { startWorkoutSession } = useWorkoutTracking()

  const handleSaveWorkout = (workout: Exercise[], name: string, description?: string) => {
    // Here you could add API call to save to database if needed
    console.log('Saving workout template:', { name, description, exercises: workout.length })
    
    // Show success message
    // You could implement a toast notification system here
    alert(`Workout template "${name}" saved successfully!`)
  }

  const handleStartWorkout = (workout: Exercise[]) => {
    if (user) {
      // If user is logged in, start tracking session
      startWorkoutSession(workout, 'custom', ['full_body'], 'custom')
      router.push('/workout')
    } else {
      // If not logged in, store in session storage
      sessionStorage.setItem('tempWorkout', JSON.stringify({
        workout,
        poison: 'custom',
        muscles: ['full_body'],
        goal: 'custom'
      }))
      router.push('/workout')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <CustomWorkoutBuilder
        onSaveWorkout={handleSaveWorkout}
        onStartWorkout={handleStartWorkout}
        mode="create"
      />
    </div>
  )
}

export default CustomWorkoutPage