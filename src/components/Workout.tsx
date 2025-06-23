import React from 'react'
import SectionWrapper from './SectionWrapper'
import ExerciseCard from './ExerciseCard'
import type { WorkoutProps } from '@/types'

const Workout = ({ workout }: WorkoutProps) => {
  return (
    <SectionWrapper id={'workout'} header={"welcome to"} title={['The', 'DANGER', 'zone']}>
      <div className='flex flex-col gap-4'>
        {workout.map((exercise, i) => (
          <ExerciseCard key={i} i={i} exercise={exercise} />
        ))}
      </div>
    </SectionWrapper>
  )
}

export default Workout