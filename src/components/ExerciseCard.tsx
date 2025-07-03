import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'
import type { ExerciseCardProps, TrackedExercise, CompletedSet } from '@/types'

const ExerciseCard = ({ exercise, i }: ExerciseCardProps) => {
  const { user } = useAuth()
  const { currentSession, updateExerciseSet, addExerciseNote } = useWorkoutTracking()
  
  const [showVideo, setShowVideo] = useState<boolean>(false)
  const [showNotes, setShowNotes] = useState<boolean>(false)
  const [localNote, setLocalNote] = useState<string>('')
  
  // For guest users or non-tracked exercises, use local state
  const [guestSetsCompleted, setGuestSetsCompleted] = useState<number>(0)

  // Get the exercise data from current session or use the passed exercise
  const exerciseData = currentSession?.exercises[i] || exercise
  
  // Type guard to check if this is a tracked exercise
  const isTrackedExercise = (ex: any): ex is TrackedExercise => {
    return ex && typeof ex === 'object' && 'id' in ex && 'sets' in ex
  }
  
  const sets: CompletedSet[] = isTrackedExercise(exerciseData) ? exerciseData.sets : []
  const completedSets = sets.filter(set => set.completed).length
  const displayCompletedSets = currentSession ? completedSets : guestSetsCompleted

  // Initialize local note with existing note
  React.useEffect(() => {
    if (isTrackedExercise(exerciseData) && exerciseData.notes) {
      setLocalNote(exerciseData.notes)
    }
  }, [exerciseData])

  const handleSetToggle = async (setId: string) => {
    if (currentSession && user && isTrackedExercise(exerciseData)) {
      // For logged-in users with active session
      const currentSet = sets.find(s => s.id === setId)
      if (currentSet) {
        await updateExerciseSet(exerciseData.id, setId, {
          completed: !currentSet.completed,
          actualReps: currentSet.actualReps || parseInt(exercise.reps?.toString() || '0'),
          weight: currentSet.weight || 0
        })
      }
    } else {
      // For guest users
      const newCount = (guestSetsCompleted + 1) % 6
      setGuestSetsCompleted(newCount)
    }
  }

  const handleSetDataUpdate = async (setId: string, field: 'actualReps' | 'weight', value: number) => {
    if (currentSession && user && isTrackedExercise(exerciseData)) {
      await updateExerciseSet(exerciseData.id, setId, {
        [field]: value
      })
    }
  }

  const handleSaveNote = async () => {
    if (currentSession && user && isTrackedExercise(exerciseData)) {
      await addExerciseNote(exerciseData.id, localNote)
    }
    setShowNotes(false)
  }

  const toggleVideo = (): void => {
    setShowVideo(!showVideo)
  }

  return (
    <div className='p-6 rounded-xl flex flex-col gap-4 bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-x-4'>
        <h4 className='text-3xl hidden sm:inline sm:text-4xl md:text-5xl font-semibold text-gray-400'>
          {String(i + 1).padStart(2, '0')}
        </h4>
        <h2 className='capitalize whitespace-nowrap truncate max-w-full text-lg sm:text-xl md:text-2xl flex-1 sm:text-center text-gray-900 font-semibold'>
          {exercise.name.replaceAll("_", " ")}
        </h2>
        <div className='flex items-center gap-2'>
          <p className='text-sm text-emerald-600 capitalize font-medium bg-emerald-100 px-2 py-1 rounded-md'>
            {exercise.type}
          </p>
          {exercise.videoId && (
            <button
              onClick={toggleVideo}
              className='flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors duration-200 font-medium'
            >
              <i className='fa-brands fa-youtube'></i>
              {showVideo ? 'Hide' : 'Watch'}
            </button>
          )}
          {user && currentSession && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className='flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200 font-medium'
            >
              <i className='fas fa-sticky-note'></i>
              Notes
            </button>
          )}
        </div>
      </div>
      
      {/* Video Section */}
      {showVideo && exercise.videoId && (
        <div className='w-full'>
          <div className='bg-gray-100 p-4 rounded-lg'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2'>
              <i className='fa-solid fa-play text-red-500'></i>
              {exercise.videoTitle || 'Exercise Demonstration'}
            </h3>
            <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
              <iframe
                className='absolute top-0 left-0 w-full h-full rounded-lg shadow-md'
                src={`https://www.youtube.com/embed/${exercise.videoId}?rel=0&modestbranding=1`}
                title={exercise.videoTitle || exercise.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className='text-sm text-gray-600 mt-2'>
              💡 Watch this video to learn proper form and technique
            </p>
          </div>
        </div>
      )}

      {/* Notes Section */}
      {showNotes && (
        <div className='w-full bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <label className='block text-sm font-medium text-blue-900 mb-2'>
            Exercise Notes
          </label>
          <textarea
            value={localNote}
            onChange={(e) => setLocalNote(e.target.value)}
            placeholder="Add notes about form, weight used, or how the exercise felt..."
            className='w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
            rows={3}
          />
          <div className='flex gap-2 mt-3'>
            <button
              onClick={handleSaveNote}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
            >
              Save
            </button>
            <button
              onClick={() => setShowNotes(false)}
              className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Muscle Groups */}
      <div className='flex flex-col'>
        <h3 className='text-gray-600 text-sm font-medium'>Muscle Groups</h3>
        <p className='capitalize text-gray-800 font-medium'>{exercise.muscles.join(' & ')}</p>
      </div>

      {/* Description */}
      <div className='flex flex-col bg-gray-50 rounded-lg p-4 gap-2 border border-gray-200'>
        {exercise.description.split('___').map((val: string, index: number) => (
          <div key={index} className='text-sm text-gray-700 leading-relaxed'>
            {val}
          </div>
        ))}
      </div>

      {/* Exercise Info Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-4 sm:place-items-center gap-2'>
        {(['reps', 'rest', 'tempo'] as const).map((info) => (
          <div key={info} className='flex flex-col p-3 rounded-lg border border-gray-200 bg-white w-full hover:shadow-md transition-shadow duration-200'>
            <h3 className='capitalize text-gray-600 text-sm font-medium'>
              {info === 'reps' ? `${exercise.unit}` : info}
            </h3>
            <p className='font-semibold text-gray-900'>{exercise[info]}</p>
          </div>
        ))}
        
        {/* Sets Tracker */}
        <div className='flex flex-col p-3 rounded-lg border-2 border-emerald-300 hover:border-emerald-500 w-full transition-all hover:shadow-md hover:shadow-emerald-500/20 bg-emerald-50 hover:bg-emerald-100'>
          <h3 className='text-emerald-700 text-sm capitalize font-medium'>Sets completed</h3>
          <p className='font-semibold text-emerald-800'>{displayCompletedSets} / 5</p>
        </div>
      </div>

      {/* Individual Set Tracking for Logged-in Users */}
      {currentSession && user && isTrackedExercise(exerciseData) && (
        <div className='mt-4'>
          <h4 className='text-gray-700 font-medium mb-3'>Track Your Sets</h4>
          <div className='grid grid-cols-1 gap-3'>
            {sets.map((set) => (
              <div key={set.id} className={`border-2 rounded-lg p-3 transition-all ${
                set.completed 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-300 bg-white hover:border-emerald-300'
              }`}>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => handleSetToggle(set.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        set.completed
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-gray-300 hover:border-emerald-500'
                      }`}
                    >
                      {set.completed && <i className='fas fa-check text-sm'></i>}
                    </button>
                    <span className='font-medium text-gray-900'>Set {set.setNumber}</span>
                  </div>
                  
                  <div className='flex items-center gap-2'>
                    {exercise.unit === 'reps' && (
                      <>
                        <input
                          type="number"
                          placeholder="Reps"
                          value={set.actualReps || ''}
                          onChange={(e) => handleSetDataUpdate(set.id, 'actualReps', parseInt(e.target.value) || 0)}
                          className='w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center'
                        />
                        <input
                          type="number"
                          placeholder="Weight"
                          value={set.weight || ''}
                          onChange={(e) => handleSetDataUpdate(set.id, 'weight', parseInt(e.target.value) || 0)}
                          className='w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center'
                        />
                        <span className='text-xs text-gray-500'>lbs</span>
                      </>
                    )}
                  </div>
                </div>
                
                {set.completed && set.completedAt && (
                  <div className='mt-2 text-xs text-emerald-600'>
                    ✓ Completed at {new Date(set.completedAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple Set Counter for Guest Users */}
      {!currentSession && (
        <button 
          onClick={() => handleSetToggle('')}
          className='mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200'
        >
          <i className='fas fa-plus mr-2'></i>
          Mark Set Complete ({displayCompletedSets}/5)
        </button>
      )}

      {/* Saved Notes Display */}
      {isTrackedExercise(exerciseData) && exerciseData.notes && (
        <div className='mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3'>
          <div className='text-sm font-medium text-blue-900 mb-1'>Your Notes:</div>
          <div className='text-sm text-blue-800'>{exerciseData.notes}</div>
        </div>
      )}
    </div>
  )
}

export default ExerciseCard