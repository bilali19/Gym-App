import React from 'react'
import Button from './Button'

const Hero = () => {
  const scrollToGenerate = (): void => {
    document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='min-h-screen flex flex-col gap-10 items-center justify-center text-center max-w-[800px] w-full mx-auto p-4'>
      <div className='flex flex-col gap-4'>
        <p className='text-emerald-600 font-medium tracking-wider'>ELEVATE YOUR FITNESS</p>
        <h1 className='uppercase font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900'>
          Fit<span className='text-emerald-600'>Force</span>
        </h1>
      </div>
      <p className='text-sm md:text-base font-light text-gray-700 leading-relaxed'>
        Transform your fitness journey with personalized workout routines designed to help you reach your goals. 
        I acknowledge that consistent training may lead to{' '}
        <span className='text-emerald-600 font-medium'>significant strength gains</span>{' '}
        and accept the commitment required to achieve{' '}
        <span className='text-emerald-600 font-medium'>optimal physical performance</span>.
      </p>
      <Button func={scrollToGenerate} text="Start Your Journey" />
    </div>
  )
}

export default Hero