import React, { useState, useEffect, useRef } from 'react'
import { useRestTimerPreferences } from '@/hooks/useRestTimerPreferences'

interface RestTimerProps {
  isActive: boolean
  duration: number // in seconds
  onComplete: () => void
  onSkip: () => void
  onAdjust: (newDuration: number) => void
  exerciseName: string
  setNumber: number
}

const RestTimer: React.FC<RestTimerProps> = ({
  isActive,
  duration,
  onComplete,
  onSkip,
  onAdjust,
  exerciseName,
  setNumber
}) => {
  const { preferences } = useRestTimerPreferences()
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isPaused, setIsPaused] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Reset timer when new timer starts
  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration)
      setIsPaused(false)
      setHasCompleted(false)
    }
  }, [isActive, duration])

  // Timer countdown logic
  useEffect(() => {
    if (!isActive || isPaused || hasCompleted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setHasCompleted(true)
          if (preferences.soundEnabled) {
            playNotificationSound()
          }
          if (preferences.vibrationEnabled) {
            // Vibrate if supported
            if ('navigator' in window && ('vibrate' in navigator)) {
              navigator.vibrate([200, 100, 200, 100, 200])
            }
          }
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, hasCompleted, onComplete, preferences.soundEnabled, preferences.vibrationEnabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Create a pleasant notification sound (two tones)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.8)
    } catch (error) {
      console.log('Audio notification not supported')
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = (): number => {
    return ((duration - timeLeft) / duration) * 100
  }

  const getTimeColor = (): string => {
    if (timeLeft <= 10) return 'text-red-600'
    if (timeLeft <= 30) return 'text-orange-600'
    return 'text-emerald-600'
  }

  const adjustTime = (adjustment: number) => {
    const newDuration = Math.max(10, duration + adjustment) // Minimum 10 seconds
    const newTimeLeft = Math.max(10, timeLeft + adjustment)
    setTimeLeft(newTimeLeft)
    onAdjust(newDuration)
  }

  if (!isActive) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Rest Timer</h3>
            <p className="text-gray-600 capitalize">
              {exerciseName.replace(/_/g, ' ')} - Set {setNumber}
            </p>
          </div>

          {/* Timer Display */}
          <div className="relative mb-8">
            {/* Circular Progress */}
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  className={hasCompleted ? 'text-green-500' : getTimeColor().replace('text-', 'text-')}
                  style={{
                    strokeDasharray: `${2 * Math.PI * 45}`,
                    strokeDashoffset: `${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`,
                    transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease'
                  }}
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getTimeColor()}`}>
                    {formatTime(timeLeft)}
                  </div>
                  {hasCompleted && (
                    <div className="text-green-600 font-semibold mt-2">
                      <i className="fas fa-check mr-2"></i>
                      Ready!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Time Adjustment */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => adjustTime(-15)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors"
              disabled={hasCompleted}
            >
              -15s
            </button>
            <button
              onClick={() => adjustTime(-30)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors"
              disabled={hasCompleted}
            >
              -30s
            </button>
            <button
              onClick={() => adjustTime(30)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors"
              disabled={hasCompleted}
            >
              +30s
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors"
              disabled={hasCompleted}
            >
              +15s
            </button>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3">
            {!hasCompleted ? (
              <>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-colors ${
                    isPaused
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'} mr-2`}></i>
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={onSkip}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <i className="fas fa-forward mr-2"></i>
                  Skip Rest
                </button>
              </>
            ) : (
              <button
                onClick={onSkip}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                <i className="fas fa-dumbbell mr-2"></i>
                Start Next Set
              </button>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Rest Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  hasCompleted ? 'bg-green-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Rest Time Info */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Recommended rest: {formatTime(duration)}
          </div>
        </div>
      </div>
    </>
  )
}

export default RestTimer