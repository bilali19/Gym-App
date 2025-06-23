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
        <div className='flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full'>
          <span className='text-xl font-bold text-blue-400'>{index}</span>
        </div>
        <h4 className='text-2xl sm:text-3xl font-semibold'>{title}</h4>
      </div>
      <p className='text-slate-300 max-w-md mx-auto leading-relaxed'>{description}</p>
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
                    ? 'border-blue-400 bg-blue-600 text-white' 
                    : 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-blue-500 hover:text-white hover:border-blue-400'
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
            <div className='bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300'>
              <button 
                onClick={toggleModal} 
                className='relative w-full p-4 flex items-center justify-between hover:bg-blue-500/10 transition-all duration-200 active:bg-slate-700/50 group'
              >
                <div className='flex items-center gap-3'>
                  {muscles.length > 0 && (
                    <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50'>
                      <span className='text-white text-xs font-bold'>{muscles.length}</span>
                    </div>
                  )}
                  <p className={`capitalize font-medium transition-colors ${
                    muscles.length > 0 ? 'text-blue-200' : 'text-slate-300 group-hover:text-blue-200'
                  }`}>
                    {muscles.length === 0 ? 'Select muscle groups' : muscles.join(' & ')}
                  </p>
                </div>
                <i className={`fa-solid fa-chevron-down transition-all duration-300 ${
                  showModal ? 'rotate-180 text-blue-400' : 'text-slate-400 group-hover:text-blue-400'
                }`}></i>
              </button>
              {showModal && (
                <div className='border-t border-slate-700 bg-slate-800/30 max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-200'>
                  {(poison === 'individual' 
                    ? WORKOUTS[poison] 
                    : Object.keys(WORKOUTS[poison as keyof typeof WORKOUTS])
                  ).map((muscleGroup: string, muscleGroupIndex: number) => (
                    <button 
                      key={muscleGroupIndex}
                      onClick={() => updateMuscles(muscleGroup)} 
                      className={`group relative w-full px-4 py-3 text-left transition-all duration-200 border-b border-slate-700/50 last:border-b-0 active:bg-slate-600/50 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 ${
                        muscles.includes(muscleGroup) ? 'text-blue-400 bg-blue-500/10 shadow-md shadow-blue-500/20' : 'text-slate-300'
                      }`}
                    >
                      <p className={`capitalize font-medium transition-colors ${
                        muscles.includes(muscleGroup) ? '' : 'group-hover:text-blue-300'
                      }`}>
                        {muscleGroup.replaceAll('_', ' ')}
                      </p>
                      {/* Subtle glow effect on hover */}
                      <div className='absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {muscles.length > 0 && (
              <div className='mt-3 text-center'>
                <button 
                  onClick={() => setMuscles([])}
                  className='text-sm text-slate-400 hover:text-red-400 hover:glow-red transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
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
                className={`group relative bg-slate-900/50 backdrop-blur-sm border-2 duration-300 px-6 py-5 rounded-xl transition-all hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-blue-500/40 hover:border-blue-400 hover:bg-blue-500/10 ${
                  scheme === goal 
                    ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/30' 
                    : 'border-slate-700'
                }`}
              >
                <p className={`capitalize font-medium transition-colors ${
                  scheme === goal ? 'text-blue-200' : 'text-slate-300 group-hover:text-blue-200'
                }`}>
                  {scheme.replaceAll('_', " ")}
                </p>
                {/* Glow effect overlay */}
                <div className='absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Generate Button */}
        <div className='flex justify-center pt-8'>
          <div className='relative'>
            <Button func={updateWorkout} text={"Generate Workout"} />
            {muscles.length === 0 && (
              <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-red-400'>
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