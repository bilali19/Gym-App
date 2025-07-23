import React, { useState, useEffect } from 'react'
import type { Exercise } from '@/types'

interface ScheduleWorkoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (scheduledWorkout: {
    date: string
    time?: string
    name: string
    type: 'generated' | 'custom' | 'template'
    exercises: Exercise[]
    workoutType: string
    targetMuscles: string[]
    goal: string
    notes?: string
  }) => void
  initialDate?: string
  workout?: {
    exercises: Exercise[]
    workoutType: string
    targetMuscles: string[]
    goal: string
    name?: string
  }
}

interface WorkoutTemplate {
  id: string
  name: string
  description?: string
  exercises: Exercise[]
  workoutType: string
  targetMuscles: string[]
  goal: string
}

const ScheduleWorkoutModal: React.FC<ScheduleWorkoutModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  initialDate = '',
  workout
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [workoutName, setWorkoutName] = useState('')
  const [notes, setNotes] = useState('')
  const [scheduleType, setScheduleType] = useState<'current' | 'template' | 'quick'>('current')
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null)
  const [savedTemplates, setSavedTemplates] = useState<WorkoutTemplate[]>([])
  const [recurringPattern, setRecurringPattern] = useState<'none' | 'daily' | 'weekly'>('none')
  const [recurringEnd, setRecurringEnd] = useState('')

  // Load saved templates
  useEffect(() => {
    const saved = localStorage.getItem('customWorkoutTemplates')
    if (saved) {
      setSavedTemplates(JSON.parse(saved))
    }
  }, [])

  // Set initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(initialDate)
      if (workout) {
        setWorkoutName(workout.name || `${workout.workoutType} Workout`)
        setScheduleType('current')
      } else {
        setScheduleType('quick')
        setWorkoutName('')
      }
      setNotes('')
      setSelectedTime('09:00')
      setRecurringPattern('none')
      setRecurringEnd('')
    }
  }, [isOpen, initialDate, workout])

  if (!isOpen) return null

  const quickWorkoutOptions = [
    {
      name: 'Push Day',
      workoutType: 'bro_split',
      targetMuscles: ['chest', 'shoulders', 'triceps'],
      goal: 'growth_hypertrophy',
      description: 'Chest, Shoulders, Triceps'
    },
    {
      name: 'Pull Day',
      workoutType: 'bro_split',
      targetMuscles: ['back', 'biceps'],
      goal: 'growth_hypertrophy',
      description: 'Back, Biceps'
    },
    {
      name: 'Leg Day',
      workoutType: 'bro_split',
      targetMuscles: ['quads', 'hamstrings', 'glutes', 'calves'],
      goal: 'strength_power',
      description: 'Quads, Hamstrings, Glutes'
    },
    {
      name: 'Upper Body',
      workoutType: 'upper_lower',
      targetMuscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
      goal: 'growth_hypertrophy',
      description: 'Full upper body'
    },
    {
      name: 'Lower Body',
      workoutType: 'upper_lower',
      targetMuscles: ['quads', 'hamstrings', 'glutes', 'calves'],
      goal: 'strength_power',
      description: 'Full lower body'
    },
    {
      name: 'Full Body',
      workoutType: 'individual',
      targetMuscles: ['chest', 'back', 'shoulders', 'quads', 'hamstrings'],
      goal: 'growth_hypertrophy',
      description: 'Complete workout'
    }
  ]

  const handleSchedule = () => {
    let scheduleData: any = {
      date: selectedDate,
      time: selectedTime,
      notes
    }

    if (scheduleType === 'current' && workout) {
      scheduleData = {
        ...scheduleData,
        name: workoutName || `${workout.workoutType} Workout`,
        type: 'generated',
        exercises: workout.exercises,
        workoutType: workout.workoutType,
        targetMuscles: workout.targetMuscles,
        goal: workout.goal
      }
    } else if (scheduleType === 'template' && selectedTemplate) {
      scheduleData = {
        ...scheduleData,
        name: selectedTemplate.name,
        type: 'template',
        exercises: selectedTemplate.exercises,
        workoutType: selectedTemplate.workoutType,
        targetMuscles: selectedTemplate.targetMuscles,
        goal: selectedTemplate.goal
      }
    } else if (scheduleType === 'quick') {
      // For quick workouts, we'll generate exercises later
      const quickWorkout = quickWorkoutOptions.find(w => w.name === workoutName)
      if (quickWorkout) {
        scheduleData = {
          ...scheduleData,
          name: quickWorkout.name,
          type: 'generated',
          exercises: [], // Will be generated when workout starts
          workoutType: quickWorkout.workoutType,
          targetMuscles: quickWorkout.targetMuscles,
          goal: quickWorkout.goal
        }
      }
    }

    // Handle recurring workouts
    if (recurringPattern !== 'none' && recurringEnd) {
      const endDate = new Date(recurringEnd)
      const startDate = new Date(selectedDate)
      const workouts = []

      let currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        workouts.push({
          ...scheduleData,
          id: `${Date.now()}-${currentDate.getTime()}`,
          date: currentDate.toISOString().split('T')[0]
        })

        if (recurringPattern === 'daily') {
          currentDate.setDate(currentDate.getDate() + 1)
        } else if (recurringPattern === 'weekly') {
          currentDate.setDate(currentDate.getDate() + 7)
        }
      }

      // Schedule all recurring workouts
      workouts.forEach(workoutData => onSchedule(workoutData))
    } else {
      // Schedule single workout
      onSchedule({
        ...scheduleData,
        id: Date.now().toString()
      })
    }

    onClose()
  }

  const isFormValid = () => {
    if (!selectedDate || !workoutName) return false
    
    if (scheduleType === 'template' && !selectedTemplate) return false
    
    if (recurringPattern !== 'none' && !recurringEnd) return false
    
    return true
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Schedule Workout</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-emerald-200 text-xl bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time (Optional)
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Workout Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Workout Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {workout && (
                  <button
                    onClick={() => setScheduleType('current')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      scheduleType === 'current'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-300 hover:border-emerald-300'
                    }`}
                  >
                    <div className="font-medium">Current Workout</div>
                    <div className="text-sm opacity-75">Use generated/custom workout</div>
                  </button>
                )}
                
                <button
                  onClick={() => setScheduleType('template')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    scheduleType === 'template'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-medium">Saved Template</div>
                  <div className="text-sm opacity-75">Use saved workout</div>
                </button>
                
                <button
                  onClick={() => setScheduleType('quick')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    scheduleType === 'quick'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-medium">Quick Schedule</div>
                  <div className="text-sm opacity-75">Choose preset workout</div>
                </button>
              </div>
            </div>

            {/* Workout Selection based on type */}
            {scheduleType === 'current' && workout && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Name *
                </label>
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Enter workout name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <div className="mt-2 p-3 bg-emerald-50 rounded-lg">
                  <div className="text-sm font-medium text-emerald-800">
                    {workout.exercises.length} exercises • Target: {workout.targetMuscles.join(', ')} • Goal: {workout.goal.replace('_', ' ')}
                  </div>
                </div>
              </div>
            )}

            {scheduleType === 'template' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Template *
                </label>
                {savedTemplates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                    <i className="fas fa-folder-open text-2xl mb-2"></i>
                    <p>No saved templates found</p>
                    <p className="text-sm">Create templates in the Custom Workout Builder</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {savedTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template)
                          setWorkoutName(template.name)
                        }}
                        className={`w-full text-left p-3 border rounded-lg transition-colors ${
                          selectedTemplate?.id === template.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-600">
                          {template.exercises.length} exercises
                          {template.description && ` • ${template.description}`}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {scheduleType === 'quick' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Workout Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickWorkoutOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => setWorkoutName(option.name)}
                      className={`text-left p-3 border rounded-lg transition-colors ${
                        workoutName === option.name
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recurring Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Recurring Schedule (Optional)
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => setRecurringPattern('none')}
                  className={`p-3 border rounded-lg transition-colors ${
                    recurringPattern === 'none'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-medium">One Time</div>
                </button>
                
                <button
                  onClick={() => setRecurringPattern('weekly')}
                  className={`p-3 border rounded-lg transition-colors ${
                    recurringPattern === 'weekly'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-medium">Weekly</div>
                </button>
                
                <button
                  onClick={() => setRecurringPattern('daily')}
                  className={`p-3 border rounded-lg transition-colors ${
                    recurringPattern === 'daily'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-medium">Daily</div>
                </button>
              </div>

              {recurringPattern !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={recurringEnd}
                    onChange={(e) => setRecurringEnd(e.target.value)}
                    min={selectedDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this workout..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={!isFormValid()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {recurringPattern !== 'none' ? 'Schedule Recurring' : 'Schedule Workout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleWorkoutModal