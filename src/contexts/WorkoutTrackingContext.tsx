'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import type { Exercise } from '@/types'

interface CompletedSet {
  id: string
  setNumber: number
  targetReps?: number
  actualReps?: number
  weight?: number
  completed: boolean
  completedAt?: string
}

interface TrackedExercise extends Exercise {
  id: string
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
  startWorkoutSession: (workout: Exercise[], workoutType: string, targetMuscles: string[], goal: string) => Promise<void>
  updateExerciseSet: (exerciseId: string, setId: string, data: Partial<CompletedSet>) => Promise<void>
  addExerciseNote: (exerciseId: string, note: string) => Promise<void>
  completeWorkout: (notes?: string) => Promise<void>
  cancelWorkout: () => Promise<void>
  getWorkoutStats: () => {
    totalWorkouts: number
    totalSets: number
    averageWorkoutTime: number
    mostTargetedMuscle: string
  }
  refreshWorkoutHistory: () => Promise<void>
}

const WorkoutTrackingContext = createContext<WorkoutTrackingContextType | undefined>(undefined)

export const useWorkoutTracking = () => {
  const context = useContext(WorkoutTrackingContext)
  if (context === undefined) {
    throw new Error('useWorkoutTracking must be used within a WorkoutTrackingProvider')
  }
  return context
}

// Helper function to ensure arrays are properly handled
const ensureArray = (value: any): string[] => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    // Handle PostgreSQL array string format like "{chest,triceps}"
    if (value.startsWith('{') && value.endsWith('}')) {
      return value.slice(1, -1).split(',').filter(Boolean)
    }
    return [value]
  }
  return []
}

// Transform raw session data to ensure proper types
const transformSessionData = (rawSession: any): WorkoutSession => {
  return {
    id: rawSession.id,
    userId: rawSession.userId || rawSession.user_id,
    date: rawSession.date,
    startTime: rawSession.startTime || rawSession.start_time,
    endTime: rawSession.endTime || rawSession.end_time,
    workoutType: rawSession.workoutType || rawSession.workout_type,
    targetMuscles: ensureArray(rawSession.targetMuscles || rawSession.target_muscles),
    goal: rawSession.goal,
    totalSets: rawSession.totalSets || rawSession.total_sets || 0,
    completedSets: rawSession.completedSets || rawSession.completed_sets || 0,
    notes: rawSession.notes,
    exercises: Array.isArray(rawSession.exercises) ? rawSession.exercises.map((ex: any) => ({
      id: ex.id,
      name: ex.name || ex.exercise_name,
      type: ex.type || ex.exercise_type,
      muscles: ensureArray(ex.muscles),
      description: ex.description || '',
      unit: ex.unit || 'reps',
      reps: ex.reps || ex.target_reps,
      rest: ex.rest || ex.target_rest,
      tempo: ex.tempo,
      notes: ex.notes,
      meta: ex.meta || { environment: 'gym', level: [1], equipment: [] },
      substitutes: ex.substitutes || [],
      videoId: ex.videoId,
      videoTitle: ex.videoTitle,
      sets: Array.isArray(ex.sets) ? ex.sets.map((set: any) => ({
        id: set.id,
        setNumber: set.setNumber || set.set_number,
        targetReps: set.targetReps || set.target_reps,
        actualReps: set.actualReps || set.actual_reps,
        weight: set.weight,
        completed: Boolean(set.completed),
        completedAt: set.completedAt || set.completed_at
      })) : []
    })) : []
  }
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

  const loadWorkoutHistory = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/workouts', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        const transformedSessions = Array.isArray(data.sessions) 
          ? data.sessions.map(transformSessionData)
          : []
        setWorkoutHistory(transformedSessions)
      }
    } catch (error) {
      console.error('Error loading workout history:', error)
      setWorkoutHistory([])
    }
  }

  const startWorkoutSession = async (
    workout: Exercise[], 
    workoutType: string, 
    targetMuscles: string[], 
    goal: string
  ) => {
    if (!user) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          workoutType,
          targetMuscles,
          goal,
          exercises: workout
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Get the full session data with exercises
        const sessionResponse = await fetch(`/api/workouts/${data.session.id}`, {
          credentials: 'include'
        })
        
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json()
          const transformedSession = transformSessionData(sessionData.session)
          setCurrentSession(transformedSession)
        }
      }
    } catch (error) {
      console.error('Error starting workout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateExerciseSet = async (
    exerciseId: string, 
    setId: string, 
    data: Partial<CompletedSet>
  ) => {
    if (!currentSession) return

    try {
      const response = await fetch(`/api/workouts/${currentSession.id}/sets/${setId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (response.ok) {
        // Update local state
        const updatedSession = { ...currentSession }
        const exercise = updatedSession.exercises.find(ex => ex.id === exerciseId)
        
        if (exercise) {
          const set = exercise.sets.find(s => s.id === setId)
          if (set) {
            Object.assign(set, data)
            
            if (data.completed && !set.completedAt) {
              set.completedAt = new Date().toISOString()
            }
          }
        }

        // Recalculate completed sets
        updatedSession.completedSets = updatedSession.exercises.reduce(
          (total, ex) => total + ex.sets.filter(s => s.completed).length,
          0
        )

        setCurrentSession(updatedSession)
      }
    } catch (error) {
      console.error('Error updating exercise set:', error)
    }
  }

  const addExerciseNote = async (exerciseId: string, note: string) => {
    if (!currentSession) return

    try {
      const response = await fetch(`/api/workouts/exercises/${exerciseId}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ notes: note }),
      })

      if (response.ok) {
        // Update local state
        const updatedSession = { ...currentSession }
        const exercise = updatedSession.exercises.find(ex => ex.id === exerciseId)
        if (exercise) {
          exercise.notes = note
        }
        setCurrentSession(updatedSession)
      }
    } catch (error) {
      console.error('Error adding exercise note:', error)
    }
  }

  const completeWorkout = async (notes?: string) => {
    if (!currentSession || !user) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/workouts/${currentSession.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          complete: true,
          notes
        }),
      })

      if (response.ok) {
        await loadWorkoutHistory()
        setCurrentSession(null)
      }
    } catch (error) {
      console.error('Error completing workout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelWorkout = async () => {
    if (!currentSession) return

    try {
      await fetch(`/api/workouts/${currentSession.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error canceling workout:', error)
    } finally {
      setCurrentSession(null)
    }
  }

  const refreshWorkoutHistory = async () => {
    await loadWorkoutHistory()
  }

  const getWorkoutStats = () => {
    const totalWorkouts = workoutHistory.length
    const totalSets = workoutHistory.reduce((total, session) => total + (session.completedSets || 0), 0)
    
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
      const muscles = ensureArray(session.targetMuscles)
      muscles.forEach(muscle => {
        if (muscle) {
          muscleCount[muscle] = (muscleCount[muscle] || 0) + 1
        }
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
    getWorkoutStats,
    refreshWorkoutHistory
  }

  return (
    <WorkoutTrackingContext.Provider value={value}>
      {children}
    </WorkoutTrackingContext.Provider>
  )
}