import { useState, useEffect } from 'react'

interface RestTimerPreferences {
  soundEnabled: boolean
  vibrationEnabled: boolean
  browserNotificationsEnabled: boolean
  autoStart: boolean
  defaultRestTimes: {
    compound: number
    accessory: number
  }
}

const defaultPreferences: RestTimerPreferences = {
  soundEnabled: true,
  vibrationEnabled: true,
  browserNotificationsEnabled: true,
  autoStart: true,
  defaultRestTimes: {
    compound: 120, // 2 minutes
    accessory: 60   // 1 minute
  }
}

export const useRestTimerPreferences = () => {
  const [preferences, setPreferences] = useState<RestTimerPreferences>(defaultPreferences)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('restTimerPreferences')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPreferences({ ...defaultPreferences, ...parsed })
      } catch (error) {
        console.error('Failed to parse rest timer preferences:', error)
      }
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('restTimerPreferences', JSON.stringify(preferences))
  }, [preferences])

  const updatePreferences = (updates: Partial<RestTimerPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  const getRestTimeForExercise = (exerciseType: 'compound' | 'accessory', exerciseRestTime?: number) => {
    // Use exercise-specific rest time if available, otherwise use preference
    return exerciseRestTime || preferences.defaultRestTimes[exerciseType]
  }

  return {
    preferences,
    updatePreferences,
    getRestTimeForExercise,
    requestNotificationPermission
  }
}