'use client'

import React, { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  content: string
  isUser: boolean
  sources?: any[]
  confidence?: number
}

const RAGChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm FitForce AI, your fitness assistant. Ask me about exercises, workout tips, nutrition, or anything fitness-related!",
      isUser: false
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Check if input is empty or just whitespace
    if (!input.trim() || isLoading) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      console.log('🚀 Sending request to Fitness AI API...', { question: currentInput })

      // Try RAG first, fallback to simple AI if it fails
      let response
      let data
      
      try {
        response = await fetch('/api/rag/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ query: currentInput })
        })

        if (response.ok) {
          data = await response.json()
          console.log('📨 RAG Response received:', data)
        } else {
          throw new Error(`RAG API failed: ${response.status}`)
        }
      } catch (ragError) {
        console.log('⚠️ RAG failed, trying simple AI...', ragError)
        
        // Fallback to simple fitness AI
        response = await fetch('/api/fitness-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ question: currentInput })
        })

        if (!response.ok) {
          throw new Error(`Both APIs failed. Status: ${response.status}`)
        }

        data = await response.json()
        console.log('📨 Simple AI Response received:', data)
        
        // Transform simple AI response to match RAG format
        if (data.success) {
          data = {
            response: data.advice,
            sources: [],
            confidence: 0.8
          }
        } else {
          throw new Error(data.error || 'Simple AI failed')
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Sorry, I could not generate a response.',
        isUser: false,
        sources: data.sources,
        confidence: data.confidence
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      console.error('❌ AI Chat error:', error)
      
      // Provide specific error messages
      let errorContent = 'Sorry, I encountered an error. Please try again in a moment.'
      
      if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('429')) {
          errorContent = '⚠️ AI service temporarily unavailable due to quota limits. Please try again later or contact support.'
        } else if (error.message.includes('rate_limit')) {
          errorContent = '⚠️ Too many requests. Please wait a moment and try again.'
        } else if (error.message.includes('invalid_api_key')) {
          errorContent = '⚠️ AI service configuration issue. Please contact support.'
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        isUser: false
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Trigger form submission
      const form = e.currentTarget.closest('form')
      if (form) {
        form.requestSubmit()
      }
    }
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 rounded-t-xl">
        <h3 className="text-white font-semibold">FitForce AI Assistant</h3>
        <p className="text-emerald-100 text-sm">Ask me anything about fitness!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {/* Show confidence and sources for AI messages */}
              {!message.isUser && message.confidence && message.confidence > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className="text-xs text-gray-600">
                    {message.confidence === 0.8 ? 'Simple AI' : `Confidence: ${Math.round(message.confidence * 100)}%`}
                  </p>
                  {message.sources && message.sources.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      Sources: {message.sources.length} knowledge chunks
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about exercises, workouts, nutrition..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
        
        {/* Helper text */}
        <p className="text-xs text-gray-500 mt-2">
          💡 Try asking: "How to do proper squats?" or "What muscles does bench press work?"
        </p>
      </form>
    </div>
  )
}

export default RAGChat