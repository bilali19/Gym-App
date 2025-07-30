import React, { useState, useEffect, useRef } from 'react'
import { useRestTimerPreferences } from '@/hooks/useRestTimerPreferences'

interface RestTimerProps {
  isActive: boolean
  duration: number // in seconds
  onComplete: () => void
  onSkip?: () => void
  onAdjust?: (newDuration: number) => void
  exerciseName: string
  setNumber: number
  inline?: boolean // New prop to determine inline vs modal display
}

const RestTimer: React.FC<RestTimerProps> = ({
  isActive,
  duration,
  onComplete,
  onSkip,
  onAdjust,
  exerciseName,
  setNumber,
  inline = false
}) => {
  const { preferences } = useRestTimerPreferences()
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isPaused, setIsPaused] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const pausedTimeRef = useRef<number>(0)
  const timerRef = useRef<number | null>(null)
  const beepIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Reset timer when new timer starts
  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration)
      setIsPaused(false)
      setHasCompleted(false)
      setIsFinished(false)
      startTimeRef.current = performance.now()
      pausedTimeRef.current = 0
      
      // Clear any existing beeping
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current)
        beepIntervalRef.current = null
      }
    }
  }, [isActive, duration])

  // High precision timer countdown logic
  useEffect(() => {
    if (!isActive || hasCompleted) {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current)
        timerRef.current = null
      }
      return
    }

    const updateTimer = () => {
      if (startTimeRef.current === null) return

      if (isPaused) {
        timerRef.current = requestAnimationFrame(updateTimer)
        return
      }

      const elapsed = (performance.now() - startTimeRef.current - pausedTimeRef.current) / 1000
      const remaining = Math.max(0, duration - elapsed)
      
      setTimeLeft(Math.ceil(remaining))
      
      if (remaining <= 0) {
        setHasCompleted(true)
        setIsFinished(true)
        
        // Play sound if enabled
        if (preferences.soundEnabled) {
          playBeepSound()
          // Start continuous beeping every 3 seconds
          beepIntervalRef.current = setInterval(() => {
            playBeepSound()
          }, 3000)
        }
        
        // Show browser notification if enabled
        if (preferences.browserNotificationsEnabled) {
          showNotification()
        }
        
        // Vibrate if enabled and on mobile
        if (preferences.vibrationEnabled && isMobile() && 'vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200])
        }
        
        onComplete()
        return
      }
      
      timerRef.current = requestAnimationFrame(updateTimer)
    }

    updateTimer()

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current)
      }
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current)
      }
    }
  }, [isActive, isPaused, hasCompleted, duration, preferences, onComplete])

  const isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0)
  }

  const playBeepSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      if (inline) {
        // Gentler beep for inline timers
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } else {
        // Triple beep for modal timers
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.4)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.5)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.6)
      }
    } catch (error) {
      console.log('Could not play sound:', error)
    }
  }

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification('🏋️ Rest Complete!', {
          body: `Time to start your next set of ${exerciseName.replace(/_/g, ' ')}`,
          icon: '/favicon.ico',
          tag: 'rest-timer'
        })
        
        setTimeout(() => notification.close(), 5000)
      } catch (error) {
        console.log('Could not show notification:', error)
      }
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
    if (isFinished) return 'text-green-600 animate-pulse'
    if (hasCompleted) return 'text-green-600'
    if (timeLeft <= 10) return 'text-red-600'
    if (timeLeft <= 30) return 'text-orange-600'
    return 'text-emerald-600'
  }

  const handleDismiss = () => {
    setIsFinished(false)
    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current)
      beepIntervalRef.current = null
    }
    if (onSkip) onSkip()
  }

  // Handle pause/resume for modal timer
  const pauseStartTimeRef = useRef<number | null>(null)

  const togglePause = () => {
    if (isPaused) {
      if (pauseStartTimeRef.current !== null) {
        pausedTimeRef.current += performance.now() - pauseStartTimeRef.current
        pauseStartTimeRef.current = null
      }
      setIsPaused(false)
    } else {
      pauseStartTimeRef.current = performance.now()
      setIsPaused(true)
    }
  }

  const adjustTime = (adjustment: number) => {
    if (!onAdjust) return
    
    const newDuration = Math.max(10, duration + adjustment)
    const newTimeLeft = Math.max(0, timeLeft + adjustment)
    
    if (startTimeRef.current !== null) {
      startTimeRef.current += adjustment * 1000
    }
    
    setTimeLeft(newTimeLeft)
    onAdjust(newDuration)
  }

  if (!isActive) return null

  // Inline timer display
  if (inline) {
    return (
      <div className="flex items-center gap-2 ml-2">
        <div className={`text-sm font-mono font-bold ${getTimeColor()}`}>
          {isFinished ? '✅ Ready!' : `⏱️ ${formatTime(timeLeft)}`}
        </div>
        {isFinished && (
          <button
            onClick={handleDismiss}
            className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors animate-pulse"
          >
            Dismiss
          </button>
        )}
        {timeLeft <= 5 && !isFinished && (
          <div className="text-xs text-red-500 animate-bounce">
            Almost!
          </div>
        )}
      </div>
    )
  }

  // Modal timer display
  return (
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
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
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
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getTimeColor()}`}>
                  {formatTime(timeLeft)}
                </div>
                {hasCompleted && (
                  <div className="text-green-600 font-semibold mt-2 animate-pulse">
                    <i className="fas fa-check mr-2"></i>
                    Ready!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Time Adjustment */}
        {!hasCompleted && onAdjust && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => adjustTime(-15)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              -15s
            </button>
            <button
              onClick={() => adjustTime(-30)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              -30s
            </button>
            <button
              onClick={() => adjustTime(30)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              +30s
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              +15s
            </button>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3">
          {!hasCompleted ? (
            <>
              <button
                onClick={togglePause}
                className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-colors ${
                  isPaused
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'} mr-2`}></i>
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <i className="fas fa-forward mr-2"></i>
                  Skip Rest
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleDismiss}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors animate-pulse"
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

        <div className="mt-4 text-center text-sm text-gray-500">
          Recommended rest: {formatTime(duration)}
        </div>
      </div>
    </div>
  )
}

export default RestTimer