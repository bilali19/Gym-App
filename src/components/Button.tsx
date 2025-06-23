import React from 'react'
import type { ButtonProps } from '@/types'

const Button = ({ text, func }: ButtonProps) => {
  return (
    <button 
      onClick={func} 
      className='group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-500/30 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]'
    >
      <span className='relative z-10 flex items-center gap-2'>
        {text}
        <i className='fa-solid fa-arrow-right transition-transform group-hover:translate-x-1'></i>
      </span>
      
      {/* Enhanced glow effect */}
      <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm'></div>
      
      {/* Ripple effect */}
      <div className='absolute inset-0 rounded-xl overflow-hidden'>
        <div className='absolute inset-0 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 rounded-xl'></div>
      </div>
    </button>
  )
}

export default Button