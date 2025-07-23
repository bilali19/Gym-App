import React, { useState, useEffect } from 'react'
import { EXERCISES } from '@/utils/soldier'
import type { Exercise, RawExercise } from '@/types'

// Helper function to flatten exercises (same as in your functions.ts)
const exercisesFlattener = (exercisesObj: Record<string, RawExercise>): Record<string, Exercise> => {
  const flattenedObj: Record<string, Exercise> = {}

  for (const [key, val] of Object.entries(exercisesObj)) {
    if (!("variants" in val)) {
      flattenedObj[key] = {
        name: key,
        ...val
      }
    } else {
      for (const variant in val.variants) {
        let variantName = variant + "_" + key
        let variantSubstitutes = Object.keys(val.variants!).map((element: string) => {
          return element + ' ' + key
        }).filter((element: string) => element.replaceAll(' ', '_') !== variantName)

        flattenedObj[variantName] = {
          name: variantName,
          ...val,
          description: val.description + '___' + val.variants![variant],
          substitutes: [
            ...val.substitutes, 
            ...variantSubstitutes
          ].slice(0, 5)
        }
      }
    }
  }
  return flattenedObj
}

// Flatten exercises for easier access
const allExercises = exercisesFlattener(EXERCISES)

interface CustomWorkoutBuilderProps {
  onSaveWorkout: (workout: Exercise[], name: string, description?: string) => void
  onStartWorkout: (workout: Exercise[]) => void
  initialWorkout?: Exercise[]
  mode?: 'create' | 'edit'
}

interface WorkoutTemplate {
  id: string
  name: string
  description?: string
  exercises: Exercise[]
  createdAt: string
}

const CustomWorkoutBuilder: React.FC<CustomWorkoutBuilderProps> = ({
  onSaveWorkout,
  onStartWorkout,
  initialWorkout = [],
  mode = 'create'
}) => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(initialWorkout)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('all')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all')
  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState<string>('all')
  const [workoutName, setWorkoutName] = useState('')
  const [workoutDescription, setWorkoutDescription] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [savedTemplates, setSavedTemplates] = useState<WorkoutTemplate[]>([])

  // Load saved templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customWorkoutTemplates')
    if (saved) {
      setSavedTemplates(JSON.parse(saved))
    }
  }, [])

  // Get unique values for filters
  const allMuscles = Array.from(new Set(
    Object.values(allExercises).flatMap(ex => ex.muscles)
  )).sort()

  const allTypes = Array.from(new Set(
    Object.values(allExercises).map(ex => ex.type)
  )).sort()

  const allEquipment = Array.from(new Set(
    Object.values(allExercises).flatMap(ex => ex.meta.equipment)
  )).sort()

  // Filter exercises based on search and filters
  const filteredExercises = Object.values(allExercises).filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesMuscle = selectedMuscleFilter === 'all' || 
                         exercise.muscles.includes(selectedMuscleFilter)
    
    const matchesType = selectedTypeFilter === 'all' || 
                       exercise.type === selectedTypeFilter
    
    const matchesEquipment = selectedEquipmentFilter === 'all' || 
                            exercise.meta.equipment.includes(selectedEquipmentFilter) ||
                            (selectedEquipmentFilter === 'bodyweight' && exercise.meta.equipment.length === 0)

    return matchesSearch && matchesMuscle && matchesType && matchesEquipment
  })

  const addExercise = (exercise: Exercise) => {
    if (!selectedExercises.find(ex => ex.name === exercise.name)) {
      setSelectedExercises([...selectedExercises, exercise])
    }
  }

  const removeExercise = (exerciseName: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.name !== exerciseName))
  }

  const moveExercise = (fromIndex: number, toIndex: number) => {
    const newExercises = [...selectedExercises]
    const [movedExercise] = newExercises.splice(fromIndex, 1)
    newExercises.splice(toIndex, 0, movedExercise)
    setSelectedExercises(newExercises)
  }

  const saveTemplate = () => {
    if (!workoutName.trim()) return

    const newTemplate: WorkoutTemplate = {
      id: Date.now().toString(),
      name: workoutName,
      description: workoutDescription,
      exercises: selectedExercises,
      createdAt: new Date().toISOString()
    }

    const updatedTemplates = [...savedTemplates, newTemplate]
    setSavedTemplates(updatedTemplates)
    localStorage.setItem('customWorkoutTemplates', JSON.stringify(updatedTemplates))
    
    onSaveWorkout(selectedExercises, workoutName, workoutDescription)
    setShowSaveModal(false)
    setWorkoutName('')
    setWorkoutDescription('')
  }

  const loadTemplate = (template: WorkoutTemplate) => {
    setSelectedExercises(template.exercises)
    setWorkoutName(template.name)
    setWorkoutDescription(template.description || '')
    setShowTemplates(false)
  }

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = savedTemplates.filter(t => t.id !== templateId)
    setSavedTemplates(updatedTemplates)
    localStorage.setItem('customWorkoutTemplates', JSON.stringify(updatedTemplates))
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === 'edit' ? 'Edit Workout' : 'Custom Workout Builder'}
        </h1>
        <p className="text-gray-600">
          Build your perfect workout by selecting exercises and customizing your routine
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowTemplates(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <i className="fas fa-folder-open mr-2"></i>
          Load Template
        </button>
        
        {selectedExercises.length > 0 && (
          <>
            <button
              onClick={() => setShowSaveModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <i className="fas fa-save mr-2"></i>
              Save as Template
            </button>
            
            <button
              onClick={() => onStartWorkout(selectedExercises)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <i className="fas fa-play mr-2"></i>
              Start Workout ({selectedExercises.length} exercises)
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exercise Library */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Exercise Library</h2>
            
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <select
                  value={selectedMuscleFilter}
                  onChange={(e) => setSelectedMuscleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Muscles</option>
                  {allMuscles.map(muscle => (
                    <option key={muscle} value={muscle} className="capitalize">
                      {muscle.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Types</option>
                  {allTypes.map(type => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedEquipmentFilter}
                  onChange={(e) => setSelectedEquipmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Equipment</option>
                  <option value="bodyweight">Bodyweight</option>
                  {allEquipment.map(equipment => (
                    <option key={equipment} value={equipment} className="capitalize">
                      {equipment}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exercise List */}
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 gap-3">
                {filteredExercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 capitalize mb-1">
                          {exercise.name.replace(/_/g, ' ')}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium capitalize">
                            {exercise.type}
                          </span>
                          {exercise.muscles.map(muscle => (
                            <span key={muscle} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium capitalize">
                              {muscle}
                            </span>
                          ))}
                          {exercise.meta.equipment.length > 0 && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                              {exercise.meta.equipment.join(', ')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {exercise.description.split('___')[0]}
                        </p>
                      </div>
                      <button
                        onClick={() => addExercise(exercise)}
                        disabled={!!selectedExercises.find(ex => ex.name === exercise.name)}
                        className="ml-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-lg transition-colors"
                      >
                        {selectedExercises.find(ex => ex.name === exercise.name) ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          <i className="fas fa-plus"></i>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredExercises.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No exercises found matching your criteria
              </div>
            )}
          </div>
        </div>

        {/* Selected Exercises */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Workout ({selectedExercises.length})
            </h2>

            {selectedExercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-dumbbell text-4xl mb-3"></i>
                <p>Start adding exercises to build your workout</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedExercises.map((exercise, index) => (
                  <div
                    key={exercise.name}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-medium text-gray-900 capitalize text-sm">
                          {exercise.name.replace(/_/g, ' ')}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeExercise(exercise.name)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs capitalize">
                        {exercise.type}
                      </span>
                      {exercise.muscles.slice(0, 2).map(muscle => (
                        <span key={muscle} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs capitalize">
                          {muscle}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveExercise(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="fas fa-arrow-up"></i>
                        </button>
                        <button
                          onClick={() => moveExercise(index, Math.min(selectedExercises.length - 1, index + 1))}
                          disabled={index === selectedExercises.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="fas fa-arrow-down"></i>
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">
                        {exercise.reps || '8-12'} {exercise.unit || 'reps'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Save Workout Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Upper Body Strength"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={workoutDescription}
                  onChange={(e) => setWorkoutDescription(e.target.value)}
                  placeholder="Describe your workout..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveTemplate}
                disabled={!workoutName.trim()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Save Template
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Saved Templates</h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {savedTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-folder-open text-4xl mb-3"></i>
                <p>No saved templates yet</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-3">
                {savedTemplates.map(template => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        {template.description && (
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {template.exercises.length} exercises • {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => loadTemplate(template)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-3 rounded transition-colors"
                      >
                        Load
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomWorkoutBuilder