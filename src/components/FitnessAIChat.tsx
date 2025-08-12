'use client'

import React, { useState } from 'react'

interface ChatMessage {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

const FitnessAIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your FitForce AI trainer. Ask me about exercises, workouts, form tips, or nutrition!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      console.log('🚀 Sending request to OpenAI API...')

      const response = await fetch('/api/fitness-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: currentInput }),
      })

      const data = await response.json()
      console.log('📨 Response received:', data)

      if (data.success) {
        const aiMessage: ChatMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.advice,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        // Handle error
        const errorMessage: ChatMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: `❌ Error: ${data.error}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }

    } catch (error) {
      console.error('❌ Request failed:', error)
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '❌ Network error - please check your connection and try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        🤖 FitForce AI Trainer
      </h3>

      {/* Messages */}
      <div className="h-80 overflow-y-auto mb-4 space-y-4 bg-gray-50 rounded-lg p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-gray-600 ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about exercises, form, workouts..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          disabled={isLoading}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-2">
        💡 Try asking: "How to do proper squats?" or "What muscles does bench press work?"
      </p>
    </div>
  )
}

export default FitnessAIChat