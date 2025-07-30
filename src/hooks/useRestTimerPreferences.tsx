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
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

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

    // Check current notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('restTimerPreferences', JSON.stringify(preferences))
  }, [preferences])

  const updatePreferences = (updates: Partial<RestTimerPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      return permission === 'granted'
    }
    return false
  }

  const getRestTimeForExercise = (exerciseType: 'compound' | 'accessory', exerciseRestTime?: number) => {
    // Use exercise-specific rest time if available, otherwise use preference
    return exerciseRestTime || preferences.defaultRestTimes[exerciseType]
  }

  const showNotification = (title: string, body: string, exerciseName?: string) => {
    if (preferences.browserNotificationsEnabled && notificationPermission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico', // Use your app's icon
        badge: '/favicon.ico',
        tag: 'rest-timer', // This replaces previous notifications
        requireInteraction: false,
        silent: !preferences.soundEnabled // Don't play default notification sound if our custom sound is enabled
      })

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
    return null
  }

  return {
    preferences,
    updatePreferences,
    getRestTimeForExercise,
    notificationPermission,
    requestNotificationPermission,
    showNotification
  }
}