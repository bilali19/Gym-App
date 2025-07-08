import React, { useState } from 'react'
import SectionWrapper from './SectionWrapper'
import { SCHEMES, WORKOUTS } from '@/utils/soldier'
import Button from './Button'
import type { GeneratorProps } from '@/types'

interface HeaderProps {
  index: string
  title: string
  description: string
}

const Header = ({ index, title, description }: HeaderProps) => {
  return (
    <div className='flex flex-col gap-3 text-center mb-8'>
      <div className='flex items-center justify-center gap-4'>
        <div className='flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full'>
          <span className='text-xl font-bold text-emerald-600'>{index}</span>
        </div>
        <h4 className='text-2xl sm:text-3xl font-semibold text-gray-900'>{title}</h4>
      </div>
      <p className='text-gray-600 max-w-md mx-auto leading-relaxed'>{description}</p>
    </div>
  )
}

const Generator = ({ 
  muscles, 
  setMuscles, 
  poison, 
  setPoison, 
  goal, 
  setGoal, 
  updateWorkout 
}: GeneratorProps) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [hasAttemptedGenerate, setHasAttemptedGenerate] = useState<boolean>(false)

  const toggleModal = (): void => {
    setShowModal(!showModal)
  }

  const updateMuscles = (muscleGroup: string): void => {
    if (muscles.includes(muscleGroup)) {
      setMuscles(muscles.filter(val => val !== muscleGroup))
      return
    }

    if (muscles.length > 2) {
      return
    }

    if (poison !== 'individual') {
      setMuscles([muscleGroup])
      setShowModal(false)
      return
    }

    setMuscles([...muscles, muscleGroup])
    if (muscles.length === 2) {
      setShowModal(false)
    }
  }

  const handleGenerateWorkout = (): void => {
    setHasAttemptedGenerate(true)
    if (muscles.length > 0) {
      updateWorkout()
    }
  }

  const availableMuscles = poison === 'individual' 
    ? WORKOUTS[poison] 
    : Object.keys(WORKOUTS[poison as keyof typeof WORKOUTS])

  return (
    <SectionWrapper id={'generate'} header={"build your workout"} title={['Time to', 'TRAIN', 'smart']}>
      <div className='space-y-16'>
        {/* Workout Type Selection */}
        <div>
          <Header index={'01'} title={'Choose your workout type'} description={"Select the training style that matches your goals and schedule."} />
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {Object.keys(WORKOUTS).map((type: string, typeIndex: number) => (
              <button 
                key={typeIndex}
                onClick={() => {
                  setMuscles([])
                  setPoison(type)
                  setHasAttemptedGenerate(false)
                }} 
                className={`group relative overflow-hidden border-2 duration-300 px-6 py-5 rounded-2xl transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
                  type === poison 
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl shadow-emerald-500/30' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10'
                }`}
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                    <i className={`text-white text-lg ${
                      type === 'individual' ? 'fas fa-user' :
                      type === 'bro_split' ? 'fas fa-dumbbell' :
                      type === 'bodybuilder_split' ? 'fas fa-trophy' :
                      'fas fa-arrows-alt-v'
                    }`}></i>
                  </div>
                  <p className='capitalize font-semibold text-sm sm:text-base'>
                    {type.replaceAll('_', " ")}
                  </p>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${type === poison ? 'opacity-100' : ''}`}></div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Muscle Group Selection */}
        <div>
          <Header index={'02'} title={'Select target muscles'} description={"Choose the muscle groups you want to focus on for this session."} />
          <div className='max-w-2xl mx-auto'>
            {/* Selected Muscles Display */}
            {muscles.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {muscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                    >
                      <span className="capitalize">{muscle.replace('_', ' ')}</span>
                      <button
                        onClick={() => {
                          setMuscles(muscles.filter(m => m !== muscle))
                          setHasAttemptedGenerate(false)
                        }}
                        className="hover:bg-white/20 rounded-full p-1 transition-colors"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Grid Selection */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableMuscles.map((muscleGroup: string, index: number) => {
                const isSelected = muscles.includes(muscleGroup)
                const isDisabled = !isSelected && muscles.length >= (poison === 'individual' ? 3 : 1)
                
                return (
                  <button
                    key={index}
                    onClick={() => updateMuscles(muscleGroup)}
                    disabled={isDisabled}
                    className={`group relative overflow-hidden p-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700 shadow-lg shadow-emerald-500/20'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-md'
                    }`}
                  >
                    <div className="relative z-10 text-center">
                      <p className="capitalize font-medium text-sm">
                        {muscleGroup.replace('_', ' ')}
                      </p>
                    </div>
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <i className="fas fa-check text-white text-xs"></i>
                      </div>
                    )}
                    
                    {/* Hover effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`}></div>
                  </button>
                )
              })}
            </div>

            {/* Helper Text */}
            <div className="mt-4 text-center text-sm text-gray-600">
              {poison === 'individual' 
                ? `Select up to 3 muscle groups (${muscles.length}/3 selected)`
                : `Select 1 training focus (${muscles.length}/1 selected)`
              }
            </div>

            {muscles.length > 0 && (
              <div className='mt-4 text-center'>
                <button 
                  onClick={() => {
                    setMuscles([])
                    setHasAttemptedGenerate(false)
                  }}
                  className='text-sm text-gray-500 hover:text-red-500 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] bg-white hover:bg-red-50 px-4 py-2 rounded-full border border-gray-200 hover:border-red-200'
                >
                  <i className="fas fa-trash mr-2"></i>
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Goal Selection */}
        <div>
          <Header index={'03'} title={'Set your goal'} description={"Define your training objective to customize exercise intensity and rep ranges."} />
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto'>
            {Object.keys(SCHEMES).map((scheme: string, schemeIndex: number) => (
              <button 
                key={schemeIndex}
                onClick={() => setGoal(scheme)} 
                className={`group relative overflow-hidden bg-white border-2 duration-300 px-8 py-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 ${
                  scheme === goal 
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-xl shadow-emerald-500/20' 
                    : 'border-gray-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10'
                }`}
              >
                <div className="relative z-10 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    scheme === goal 
                      ? 'bg-emerald-500 text-white shadow-lg' 
                      : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'
                  } transition-all duration-300`}>
                    <i className={`text-2xl ${
                      scheme === 'strength_power' ? 'fas fa-weight-hanging' :
                      scheme === 'growth_hypertrophy' ? 'fas fa-dumbbell' :
                      'fas fa-heartbeat'
                    }`}></i>
                  </div>
                  <p className={`capitalize font-bold text-lg mb-2 transition-colors ${
                    scheme === goal ? 'text-emerald-700' : 'text-gray-700 group-hover:text-emerald-700'
                  }`}>
                    {scheme.replaceAll('_', " ")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {scheme === 'strength_power' && 'Build maximum strength with heavy weights'}
                    {scheme === 'growth_hypertrophy' && 'Increase muscle size and definition'}
                    {scheme === 'cardiovascular_endurance' && 'Improve stamina and heart health'}
                  </p>
                </div>
                
                {/* Selection indicator */}
                {scheme === goal && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-check text-white"></i>
                  </div>
                )}
                
                {/* Glow effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${scheme === goal ? 'opacity-100' : ''}`}></div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Generate Button */}
        <div className='flex flex-col items-center pt-8'>
          <Button func={handleGenerateWorkout} text={"Generate Workout"} />
          {hasAttemptedGenerate && muscles.length === 0 && (
            <div className='mt-4 text-sm text-red-500 font-medium animate-pulse'>
              Please select muscle groups first
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Generator