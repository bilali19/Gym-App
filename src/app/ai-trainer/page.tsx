'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import RAGChat from '@/components/RAGChat'

const AITrainerPage = () => {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 FitForce AI Trainer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant, personalized fitness guidance powered by AI. Ask about exercises, 
            workout plans, nutrition, form tips, and more!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-dumbbell text-emerald-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Exercise Guidance</h3>
            <p className="text-gray-600">Get detailed form instructions and technique tips for any exercise</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-chart-line text-blue-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Workout Planning</h3>
            <p className="text-gray-600">Create custom workout plans tailored to your goals and equipment</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-apple-alt text-purple-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nutrition Advice</h3>
            <p className="text-gray-600">Get personalized nutrition recommendations and meal timing tips</p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto">
          <RAGChat />
        </div>

        {/* Example Questions */}
        <div className="mt-8 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Try asking:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">"How do I perform a proper deadlift?"</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">"What exercises work the chest muscles?"</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">"How many sets should I do for muscle growth?"</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">"What should I eat after a workout?"</p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-lg transition-all duration-200"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default AITrainerPage