import React from 'react'
import { useRestTimerPreferences } from '@/hooks/useRestTimerPreferences'

interface RestTimerSettingsProps {
  isOpen: boolean
  onClose: () => void
}

const RestTimerSettings: React.FC<RestTimerSettingsProps> = ({ isOpen, onClose }) => {
  const { 
    preferences, 
    updatePreferences, 
    notificationPermission, 
    requestNotificationPermission 
  } = useRestTimerPreferences()

  if (!isOpen) return null

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs === 0 ? `${mins}m` : `${mins}m ${secs}s`
  }

  const handleBrowserNotificationsToggle = async () => {
    if (preferences.browserNotificationsEnabled) {
      // Disable notifications
      updatePreferences({ browserNotificationsEnabled: false })
    } else {
      // Request permission and enable if granted
      const granted = await requestNotificationPermission()
      if (granted) {
        updatePreferences({ browserNotificationsEnabled: true })
      }
    }
  }

  const isDesktop = typeof window !== 'undefined' && !('ontouchstart' in window)
  const hasNotificationSupport = typeof window !== 'undefined' && 'Notification' in window

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Rest Timer Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Auto-start Setting */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Auto-start Timer</h4>
              <p className="text-sm text-gray-600">Automatically start rest timer when you complete a set</p>
            </div>
            <button
              onClick={() => updatePreferences({ autoStart: !preferences.autoStart })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.autoStart ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.autoStart ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sound Setting */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sound Notifications</h4>
              <p className="text-sm text-gray-600">Play sound when rest time is complete</p>
            </div>
            <button
              onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.soundEnabled ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Browser Notifications Setting */}
          {hasNotificationSupport && (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  Browser Notifications
                  {isDesktop && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Desktop</span>}
                </h4>
                <p className="text-sm text-gray-600">
                  Show notification popup when rest time is complete
                  {notificationPermission === 'denied' && (
                    <span className="text-red-600 block">Permission denied. Enable in browser settings.</span>
                  )}
                </p>
              </div>
              <button
                onClick={handleBrowserNotificationsToggle}
                disabled={notificationPermission === 'denied'}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.browserNotificationsEnabled && notificationPermission === 'granted'
                    ? 'bg-emerald-600' 
                    : 'bg-gray-300'
                } ${notificationPermission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.browserNotificationsEnabled && notificationPermission === 'granted'
                      ? 'translate-x-6' 
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Vibration Setting */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                Vibration
                {!isDesktop && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Mobile</span>}
              </h4>
              <p className="text-sm text-gray-600">
                {isDesktop 
                  ? 'Vibration not available on desktop devices'
                  : 'Vibrate device when rest time is complete'
                }
              </p>
            </div>
            <button
              onClick={() => updatePreferences({ vibrationEnabled: !preferences.vibrationEnabled })}
              disabled={isDesktop}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.vibrationEnabled && !isDesktop ? 'bg-emerald-600' : 'bg-gray-300'
              } ${isDesktop ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.vibrationEnabled && !isDesktop ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Default Rest Times */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Default Rest Times</h4>
            
            {/* Compound Exercise Rest Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compound Exercises (Squats, Deadlifts, etc.)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="60"
                  max="300"
                  step="15"
                  value={preferences.defaultRestTimes.compound}
                  onChange={(e) => updatePreferences({
                    defaultRestTimes: {
                      ...preferences.defaultRestTimes,
                      compound: parseInt(e.target.value)
                    }
                  })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900 w-16">
                  {formatTime(preferences.defaultRestTimes.compound)}
                </span>
              </div>
            </div>

            {/* Accessory Exercise Rest Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accessory Exercises (Curls, Extensions, etc.)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="15"
                  value={preferences.defaultRestTimes.accessory}
                  onChange={(e) => updatePreferences({
                    defaultRestTimes: {
                      ...preferences.defaultRestTimes,
                      accessory: parseInt(e.target.value)
                    }
                  })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900 w-16">
                  {formatTime(preferences.defaultRestTimes.accessory)}
                </span>
              </div>
            </div>
          </div>

          {/* Platform-specific Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">
                  {isDesktop ? 'Desktop Notifications:' : 'Mobile Notifications:'}
                </p>
                <ul className="space-y-1 text-xs">
                  {isDesktop ? (
                    <>
                      <li>• Sound alerts work in all browsers</li>
                      <li>• Browser notifications appear in system tray</li>
                      <li>• Notifications work even if tab is not active</li>
                      <li>• Vibration not available on desktop devices</li>
                    </>
                  ) : (
                    <>
                      <li>• Sound alerts work when app is active</li>
                      <li>• Vibration works on most mobile devices</li>
                      <li>• Browser notifications may require permission</li>
                      <li>• Keep app open for best notification experience</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Test Notification Button */}
          {hasNotificationSupport && notificationPermission === 'granted' && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  // Test notification functionality
                  if (preferences.browserNotificationsEnabled) {
                    new Notification('FitForce Rest Timer', {
                      body: 'This is a test notification! Your rest timer alerts will look like this.',
                      icon: '/favicon.ico',
                      tag: 'rest-timer-test'
                    })
                  }
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <i className="fas fa-bell mr-2"></i>
                Test Notification
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default RestTimerSettings