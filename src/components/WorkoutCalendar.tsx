import React, { useState, useEffect } from 'react'
import type { Exercise } from '@/types'

interface ScheduledWorkout {
  id: string
  date: string // YYYY-MM-DD format
  time?: string // HH:MM format
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

interface WorkoutCalendarProps {
  onScheduleWorkout?: (workout: ScheduledWorkout) => void
  onStartWorkout?: (workout: ScheduledWorkout) => void
  onEditScheduledWorkout?: (workout: ScheduledWorkout) => void
  onDeleteScheduledWorkout?: (workoutId: string) => void
  className?: string
}

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  onScheduleWorkout,
  onStartWorkout,
  onEditScheduledWorkout,
  onDeleteScheduledWorkout,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('week')
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([])
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [draggedWorkout, setDraggedWorkout] = useState<ScheduledWorkout | null>(null)

  // Load scheduled workouts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('scheduledWorkouts')
    if (saved) {
      setScheduledWorkouts(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage whenever scheduledWorkouts changes
  useEffect(() => {
    localStorage.setItem('scheduledWorkouts', JSON.stringify(scheduledWorkouts))
  }, [scheduledWorkouts])

  // Helper functions for date manipulation
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const parseDate = (dateString: string): Date => {
    return new Date(dateString + 'T00:00:00')
  }

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  const startOfWeek = (date: Date): Date => {
    const result = new Date(date)
    const day = result.getDay()
    const diff = result.getDate() - day
    result.setDate(diff)
    return result
  }

  const startOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  const endOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
  }

  const isSameDate = (date1: Date, date2: Date): boolean => {
    return formatDate(date1) === formatDate(date2)
  }

  // Get workouts for a specific date
  const getWorkoutsForDate = (date: string): ScheduledWorkout[] => {
    return scheduledWorkouts.filter(workout => workout.date === date)
  }

  // Get dates to display based on current view
  const getDatesToDisplay = (): Date[] => {
    if (view === 'week') {
      const start = startOfWeek(currentDate)
      return Array.from({ length: 7 }, (_, i) => addDays(start, i))
    } else {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      const startOfFirstWeek = startOfWeek(start)
      const daysInView = Math.ceil((end.getTime() - startOfFirstWeek.getTime()) / (1000 * 60 * 60 * 24)) + 7
      return Array.from({ length: daysInView }, (_, i) => addDays(startOfFirstWeek, i))
    }
  }

  const dates = getDatesToDisplay()
  const today = new Date()

  // Navigation functions
  const goToPrevious = () => {
    if (view === 'week') {
      setCurrentDate(addDays(currentDate, -7))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }
  }

  const goToNext = () => {
    if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Schedule workout functions
  const handleScheduleClick = (date: string) => {
    setSelectedDate(date)
    setShowScheduleModal(true)
  }

  const handleQuickSchedule = (date: string, workoutType: string) => {
    const newWorkout: ScheduledWorkout = {
      id: Date.now().toString(),
      date,
      name: `${workoutType} Workout`,
      type: 'generated',
      exercises: [], // Would be populated based on workout type
      workoutType,
      targetMuscles: ['full_body'],
      goal: 'strength_power',
      time: '09:00'
    }
    
    setScheduledWorkouts([...scheduledWorkouts, newWorkout])
    onScheduleWorkout?.(newWorkout)
  }

  // Drag and drop functions
  const handleDragStart = (e: React.DragEvent, workout: ScheduledWorkout) => {
    setDraggedWorkout(workout)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, newDate: string) => {
    e.preventDefault()
    if (draggedWorkout && draggedWorkout.date !== newDate) {
      const updatedWorkouts = scheduledWorkouts.map(workout =>
        workout.id === draggedWorkout.id
          ? { ...workout, date: newDate }
          : workout
      )
      setScheduledWorkouts(updatedWorkouts)
    }
    setDraggedWorkout(null)
  }

  // Delete workout
  const handleDeleteWorkout = (workoutId: string) => {
    setScheduledWorkouts(scheduledWorkouts.filter(w => w.id !== workoutId))
    onDeleteScheduledWorkout?.(workoutId)
  }

  // Complete workout
  const handleCompleteWorkout = (workoutId: string) => {
    const updatedWorkouts = scheduledWorkouts.map(workout =>
      workout.id === workoutId
        ? { ...workout, completed: true, completedAt: new Date().toISOString() }
        : workout
    )
    setScheduledWorkouts(updatedWorkouts)
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Calendar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric',
                ...(view === 'week' ? { day: 'numeric' } : {})
              })}
            </h2>
            <p className="text-gray-600">
              {view === 'week' ? 'Weekly View' : 'Monthly View'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === 'week'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === 'month'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Month
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevious}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <button
                onClick={goToToday}
                className="px-3 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Today
              </button>
              
              <button
                onClick={goToNext}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className={`grid ${view === 'week' ? 'grid-cols-7' : 'grid-cols-7'} gap-2 mb-4`}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className={`grid ${view === 'week' ? 'grid-cols-7' : 'grid-cols-7'} gap-2`}>
          {dates.map((date, index) => {
            const dateString = formatDate(date)
            const dayWorkouts = getWorkoutsForDate(dateString)
            const isToday = isSameDate(date, today)
            const isCurrentMonth = view === 'month' ? date.getMonth() === currentDate.getMonth() : true

            return (
              <div
                key={index}
                className={`min-h-24 p-2 border rounded-lg transition-colors ${
                  isToday
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, dateString)}
              >
                {/* Date Number */}
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-emerald-700' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {date.getDate()}
                  </span>
                  
                  {/* Quick Add Button */}
                  <button
                    onClick={() => handleScheduleClick(dateString)}
                    className="w-5 h-5 text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    <i className="fas fa-plus text-xs"></i>
                  </button>
                </div>

                {/* Scheduled Workouts */}
                <div className="space-y-1">
                  {dayWorkouts.slice(0, view === 'week' ? 5 : 2).map((workout) => (
                    <div
                      key={workout.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, workout)}
                      className={`text-xs p-1 rounded cursor-move transition-colors ${
                        workout.completed
                          ? 'bg-green-100 text-green-800 line-through'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                      onClick={() => onStartWorkout?.(workout)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">
                          {workout.time && `${workout.time} `}
                          {workout.name}
                        </span>
                        <div className="flex gap-1">
                          {!workout.completed && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCompleteWorkout(workout.id)
                              }}
                              className="text-green-600 hover:text-green-700"
                            >
                              <i className="fas fa-check text-xs"></i>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteWorkout(workout.id)
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {dayWorkouts.length > (view === 'week' ? 5 : 2) && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayWorkouts.length - (view === 'week' ? 5 : 2)} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Schedule Workout for {selectedDate}
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  handleQuickSchedule(selectedDate, 'Push')
                  setShowScheduleModal(false)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Push Day</div>
                <div className="text-sm text-gray-600">Chest, Shoulders, Triceps</div>
              </button>
              
              <button
                onClick={() => {
                  handleQuickSchedule(selectedDate, 'Pull')
                  setShowScheduleModal(false)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Pull Day</div>
                <div className="text-sm text-gray-600">Back, Biceps</div>
              </button>
              
              <button
                onClick={() => {
                  handleQuickSchedule(selectedDate, 'Legs')
                  setShowScheduleModal(false)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Leg Day</div>
                <div className="text-sm text-gray-600">Quads, Hamstrings, Glutes</div>
              </button>
              
              <button
                onClick={() => {
                  handleQuickSchedule(selectedDate, 'Upper Body')
                  setShowScheduleModal(false)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Upper Body</div>
                <div className="text-sm text-gray-600">Full upper body workout</div>
              </button>
              
              <button
                onClick={() => {
                  handleQuickSchedule(selectedDate, 'Full Body')
                  setShowScheduleModal(false)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Full Body</div>
                <div className="text-sm text-gray-600">Complete workout</div>
              </button>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutCalendar