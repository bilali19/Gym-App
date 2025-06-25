'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import Generator from '@/components/Generator'
import Workout from '@/components/Workout'
import { generateWorkout } from '@/utils/functions'
import type { Exercise } from '@/types'

const HomePage = () => {
  const [workout, setWorkout] = useState<Exercise[] | null>(null)
  const [poison, setPoison] = useState<string>('individual')
  const [muscles, setMuscles] = useState<string[]>([])
  const [goal, setGoal] = useState<string>('strength_power')

  const updateWorkout = (): void => {
    if (muscles.length < 1) {
      return
    }
    const newWorkout = generateWorkout({ poison, muscles, goal })
    setWorkout(newWorkout)

    document.getElementById('workout')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50 text-gray-900 text-sm sm:text-base">
      <Hero />
      <Generator 
        poison={poison} 
        setPoison={setPoison} 
        muscles={muscles} 
        setMuscles={setMuscles} 
        goal={goal} 
        setGoal={setGoal} 
        updateWorkout={updateWorkout} 
      />
      {workout && <Workout workout={workout} />}
    </main>
  )
}

export default HomePage