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

  return (
    <SectionWrapper id={'generate'} header={"build your workout"} title={['Time to', 'TRAIN', 'smart']}>
      <div className='space-y-16'>
        {/* Workout Type Selection */}
        <div>
          <Header index={'01'} title={'Choose your workout type'} description={"Select the training style that matches your goals and schedule."} />
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            {Object.keys(WORKOUTS).map((type: string, typeIndex: number) => (
              <button 
                key={typeIndex}
                onClick={() => {
                  setMuscles([])
                  setPoison(type)
                }} 
                className={`relative border-2 duration-200 px-6 py-4 rounded-xl transition-all cursor-pointer ${
                  type === poison 
                    ? 'border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/20'
                }`}
              >
                <p className='capitalize font-medium text-sm sm:text-base'>
                  {type.replaceAll('_', " ")}
                </p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Muscle Group Selection */}
        <div>
          <Header index={'02'} title={'Select target muscles'} description={"Choose the muscle groups you want to focus on for this session."} />
          <div className='max-w-md mx-auto'>
            <div className='bg-white border-2 border-gray-300 rounded-xl overflow-hidden hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300'>
              <button 
                onClick={toggleModal} 
                className='relative w-full p-4 flex items-center justify-between hover:bg-emerald-50 transition-all duration-200 active:bg-emerald-100 group'
              >
                <div className='flex items-center gap-3'>
                  {muscles.length > 0 && (
                    <div className='w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50'>
                      <span className='text-white text-xs font-bold'>{muscles.length}</span>
                    </div>
                  )}
                  <p className={`capitalize font-medium transition-colors ${
                    muscles.length > 0 ? 'text-emerald-700' : 'text-gray-600 group-hover:text-emerald-700'
                  }`}>
                    {muscles.length === 0 ? 'Select muscle groups' : muscles.join(' & ')}
                  </p>
                </div>
                <i className={`fa-solid fa-chevron-down transition-all duration-300 ${
                  showModal ? 'rotate-180 text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'
                }`}></i>
              </button>
              {showModal && (
                <div className='border-t border-gray-200 bg-gray-50 max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-200'>
                  {(poison === 'individual' 
                    ? WORKOUTS[poison] 
                    : Object.keys(WORKOUTS[poison as keyof typeof WORKOUTS])
                  ).map((muscleGroup: string, muscleGroupIndex: number) => (
                    <button 
                      key={muscleGroupIndex}
                      onClick={() => updateMuscles(muscleGroup)} 
                      className={`group relative w-full px-4 py-3 text-left transition-all duration-200 border-b border-gray-200 last:border-b-0 active:bg-emerald-200 hover:bg-emerald-100 hover:shadow-lg hover:shadow-emerald-500/20 ${
                        muscles.includes(muscleGroup) ? 'text-emerald-700 bg-emerald-100 shadow-md shadow-emerald-500/20' : 'text-gray-700'
                      }`}
                    >
                      <p className={`capitalize font-medium transition-colors ${
                        muscles.includes(muscleGroup) ? '' : 'group-hover:text-emerald-700'
                      }`}>
                        {muscleGroup.replaceAll('_', ' ')}
                      </p>
                      {/* Subtle glow effect on hover */}
                      <div className='absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {muscles.length > 0 && (
              <div className='mt-3 text-center'>
                <button 
                  onClick={() => setMuscles([])}
                  className='text-sm text-gray-500 hover:text-red-500 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Goal Selection */}
        <div>
          <Header index={'03'} title={'Set your goal'} description={"Define your training objective to customize exercise intensity and rep ranges."} />
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto'>
            {Object.keys(SCHEMES).map((scheme: string, schemeIndex: number) => (
              <button 
                key={schemeIndex}
                onClick={() => setGoal(scheme)} 
                className={`group relative bg-white border-2 duration-300 px-6 py-5 rounded-xl transition-all hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-50 ${
                  scheme === goal 
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/30' 
                    : 'border-gray-300'
                }`}
              >
                <p className={`capitalize font-medium transition-colors ${
                  scheme === goal ? 'text-emerald-700' : 'text-gray-700 group-hover:text-emerald-700'
                }`}>
                  {scheme.replaceAll('_', " ")}
                </p>
                {/* Glow effect overlay */}
                <div className='absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Generate Button */}
        <div className='flex justify-center pt-8'>
          <div className='relative'>
            <Button func={updateWorkout} text={"Generate Workout"} />
            {muscles.length === 0 && (
              <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-red-500'>
                Please select muscle groups first
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Generator