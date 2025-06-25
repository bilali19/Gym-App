import React from 'react'
import type { ButtonProps } from '@/types'

const Button = ({ text, func }: ButtonProps) => {
  return (
    <button 
      onClick={func} 
      className='group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]'
    >
      <span className='relative z-10 flex items-center gap-2'>
        {text}
        <i className='fa-solid fa-arrow-right transition-transform group-hover:translate-x-1'></i>
      </span>
      
      {/* Enhanced glow effect */}
      <div className='absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm'></div>
      
      {/* Ripple effect */}
      <div className='absolute inset-0 rounded-xl overflow-hidden'>
        <div className='absolute inset-0 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 rounded-xl'></div>
      </div>
    </button>
  )
}

export default Button