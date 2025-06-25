'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'

const HomePage = () => {
  const { user } = useAuth()
  const { currentSession, getWorkoutStats } = useWorkoutTracking()

  const stats = user ? getWorkoutStats() : null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <p className="text-emerald-600 font-medium tracking-wider mb-4">ELEVATE YOUR FITNESS</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                FitForce
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your fitness journey with personalized workout routines designed to help you reach your goals. 
              Track your progress, stay motivated, and achieve{' '}
              <span className="text-emerald-600 font-semibold">optimal physical performance</span>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {currentSession ? (
              <Link
                href="/workout"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-3"></div>
                Continue Active Workout
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            ) : (
              <Link
                href="/generate"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Generate Workout
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            )}
            
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-xl transition-all duration-300"
              >
                View Dashboard
                <i className="fas fa-chart-line ml-2"></i>
              </Link>
            ) : (
              <Link
                href="/generate"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-xl transition-all duration-300"
              >
                Try Without Account
                <i className="fas fa-play ml-2"></i>
              </Link>
            )}
          </div>

          {/* User Stats or Features */}
          {user && stats ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.totalWorkouts}</div>
                  <div className="text-gray-600">Workouts Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalSets}</div>
                  <div className="text-gray-600">Total Sets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {Math.round(stats.averageWorkoutTime)}m
                  </div>
                  <div className="text-gray-600">Avg Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2 capitalize">
                    {stats.mostTargetedMuscle || 'None'}
                  </div>
                  <div className="text-gray-600">Top Muscle</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <i className="fas fa-dumbbell text-emerald-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Workouts</h3>
                <p className="text-gray-600">AI-generated routines tailored to your goals and preferences</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <i className="fas fa-chart-line text-blue-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-gray-600">Monitor your sets, reps, and workout history over time</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <i className="fas fa-play-circle text-purple-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Guides</h3>
                <p className="text-gray-600">Learn proper form with integrated exercise demonstration videos</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Join thousands of users who have already started their fitness journey with FitForce
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 hover:text-emerald-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your First Workout
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage