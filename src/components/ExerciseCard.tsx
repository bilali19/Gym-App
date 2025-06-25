import React, { useState } from 'react'
import type { ExerciseCardProps } from '@/types'

const ExerciseCard = ({ exercise, i }: ExerciseCardProps) => {
  const [setsCompleted, setSetsComplete] = useState<number>(0)
  const [showVideo, setShowVideo] = useState<boolean>(false)

  const handleSetIncrement = (): void => {
    setSetsComplete((setsCompleted + 1) % 6)
  }

  const toggleVideo = (): void => {
    setShowVideo(!showVideo)
  }

  return (
    <div className='p-6 rounded-xl flex flex-col gap-4 bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 sm:flex-wrap'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-x-4'>
        <h4 className='text-3xl hidden sm:inline sm:text-4xl md:text-5xl font-semibold text-gray-400'>
          0{i + 1}
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
            <div className='relative w-full' style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
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
      
      <div className='flex flex-col'>
        <h3 className='text-gray-600 text-sm font-medium'>Muscle Groups</h3>
        <p className='capitalize text-gray-800 font-medium'>{exercise.muscles.join(' & ')}</p>
      </div>

      <div className='flex flex-col bg-gray-50 rounded-lg p-4 gap-2 border border-gray-200'>
        {exercise.description.split('___').map((val: string, index: number) => (
          <div key={index} className='text-sm text-gray-700 leading-relaxed'>
            {val}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 sm:place-items-center gap-2'>
        {(['reps', 'rest', 'tempo'] as const).map((info) => (
          <div key={info} className='flex flex-col p-3 rounded-lg border border-gray-200 bg-white w-full hover:shadow-md transition-shadow duration-200'>
            <h3 className='capitalize text-gray-600 text-sm font-medium'>
              {info === 'reps' ? `${exercise.unit}` : info}
            </h3>
            <p className='font-semibold text-gray-900'>{exercise[info]}</p>
          </div>
        ))}
        <button 
          onClick={handleSetIncrement} 
          className='flex flex-col p-3 rounded-lg border-2 duration-200 border-emerald-300 hover:border-emerald-500 w-full transition-all hover:shadow-md hover:shadow-emerald-500/20 bg-emerald-50 hover:bg-emerald-100'
        >
          <h3 className='text-emerald-700 text-sm capitalize font-medium'>Sets completed</h3>
          <p className='font-semibold text-emerald-800'>{setsCompleted} / 5</p>
        </button>
      </div>
    </div>
  )
}

export default ExerciseCard