'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import type { Exercise } from '@/types'

interface CompletedSet {
  setNumber: number
  reps: number
  weight?: number
  completed: boolean
  completedAt?: string
}

interface TrackedExercise extends Exercise {
  sets: CompletedSet[]
  notes?: string
}

interface WorkoutSession {
  id: string
  userId: string
  date: string
  startTime: string
  endTime?: string
  exercises: TrackedExercise[]
  totalSets: number
  completedSets: number
  notes?: string
  workoutType: string
  targetMuscles: string[]
  goal: string
}

interface WorkoutTrackingContextType {
  currentSession: WorkoutSession | null
  workoutHistory: WorkoutSession[]
  isLoading: boolean
  startWorkoutSession: (workout: Exercise[], workoutType: string, targetMuscles: string[], goal: string) => void
  updateExerciseSet: (exerciseIndex: number, setIndex: number, data: Partial<CompletedSet>) => void
  addExerciseNote: (exerciseIndex: number, note: string) => void
  completeWorkout: (notes?: string) => void
  cancelWorkout: () => void
  getWorkoutStats: () => {
    totalWorkouts: number
    totalSets: number
    averageWorkoutTime: number
    mostTargetedMuscle: string
  }
}

const WorkoutTrackingContext = createContext<WorkoutTrackingContextType | undefined>(undefined)

export const useWorkoutTracking = () => {
  const context = useContext(WorkoutTrackingContext)
  if (context === undefined) {
    throw new Error('useWorkoutTracking must be used within a WorkoutTrackingProvider')
  }
  return context
}

export const WorkoutTrackingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null)
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load workout history when user changes
  useEffect(() => {
    if (user) {
      loadWorkoutHistory()
    } else {
      setWorkoutHistory([])
      setCurrentSession(null)
    }
  }, [user])

  const loadWorkoutHistory = () => {
    if (!user) return

    try {
      const storedHistory = localStorage.getItem(`fitforce_workouts_${user.id}`)
      if (storedHistory) {
        setWorkoutHistory(JSON.parse(storedHistory))
      }
    } catch (error) {
      console.error('Error loading workout history:', error)
    }
  }

  const saveWorkoutHistory = (history: WorkoutSession[]) => {
    if (!user) return

    try {
      localStorage.setItem(`fitforce_workouts_${user.id}`, JSON.stringify(history))
      setWorkoutHistory(history)
    } catch (error) {
      console.error('Error saving workout history:', error)
    }
  }

  const startWorkoutSession = (workout: Exercise[], workoutType: string, targetMuscles: string[], goal: string) => {
    if (!user) return

    const session: WorkoutSession = {
      id: Date.now().toString(),
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      exercises: workout.map(exercise => ({
        ...exercise,
        sets: Array.from({ length: 5 }, (_, index) => ({
          setNumber: index + 1,
          reps: 0,
          weight: 0,
          completed: false
        }))
      })),
      totalSets: workout.length * 5,
      completedSets: 0,
      workoutType,
      targetMuscles,
      goal
    }

    setCurrentSession(session)
  }

  const updateExerciseSet = (exerciseIndex: number, setIndex: number, data: Partial<CompletedSet>) => {
    if (!currentSession) return

    const updatedSession = { ...currentSession }
    const exercise = updatedSession.exercises[exerciseIndex]
    const set = exercise.sets[setIndex]

    // Update the set
    exercise.sets[setIndex] = { ...set, ...data }
    
    // If marking as completed, add timestamp
    if (data.completed && !set.completed) {
      exercise.sets[setIndex].completedAt = new Date().toISOString()
    }

    // Recalculate completed sets
    updatedSession.completedSets = updatedSession.exercises.reduce(
      (total, ex) => total + ex.sets.filter(s => s.completed).length,
      0
    )

    setCurrentSession(updatedSession)
  }

  const addExerciseNote = (exerciseIndex: number, note: string) => {
    if (!currentSession) return

    const updatedSession = { ...currentSession }
    updatedSession.exercises[exerciseIndex].notes = note
    setCurrentSession(updatedSession)
  }

  const completeWorkout = (notes?: string) => {
    if (!currentSession || !user) return

    setIsLoading(true)

    const completedSession: WorkoutSession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      notes
    }

    const updatedHistory = [completedSession, ...workoutHistory]
    saveWorkoutHistory(updatedHistory)
    setCurrentSession(null)
    setIsLoading(false)
  }

  const cancelWorkout = () => {
    setCurrentSession(null)
  }

  const getWorkoutStats = () => {
    const totalWorkouts = workoutHistory.length
    const totalSets = workoutHistory.reduce((total, session) => total + session.completedSets, 0)
    
    const totalTime = workoutHistory.reduce((total, session) => {
      if (session.endTime) {
        const start = new Date(session.startTime).getTime()
        const end = new Date(session.endTime).getTime()
        return total + (end - start)
      }
      return total
    }, 0)
    
    const averageWorkoutTime = totalWorkouts > 0 ? totalTime / totalWorkouts / (1000 * 60) : 0 // in minutes

    const muscleCount: { [key: string]: number } = {}
    workoutHistory.forEach(session => {
      session.targetMuscles.forEach(muscle => {
        muscleCount[muscle] = (muscleCount[muscle] || 0) + 1
      })
    })

    const mostTargetedMuscle = Object.keys(muscleCount).reduce((a, b) => 
      muscleCount[a] > muscleCount[b] ? a : b, 'None'
    )

    return {
      totalWorkouts,
      totalSets,
      averageWorkoutTime,
      mostTargetedMuscle
    }
  }

  const value = {
    currentSession,
    workoutHistory,
    isLoading,
    startWorkoutSession,
    updateExerciseSet,
    addExerciseNote,
    completeWorkout,
    cancelWorkout,
    getWorkoutStats
  }

  return (
    <WorkoutTrackingContext.Provider value={value}>
      {children}
    </WorkoutTrackingContext.Provider>
  )
}