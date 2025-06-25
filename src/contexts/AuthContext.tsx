'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate API calls with localStorage (in a real app, you'd use a backend)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('fitforce_user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('fitforce_user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Get stored users
      const storedUsers = JSON.parse(localStorage.getItem('fitforce_users') || '[]')
      const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        const userWithoutPassword = { ...foundUser }
        delete userWithoutPassword.password
        setUser(userWithoutPassword)
        localStorage.setItem('fitforce_user', JSON.stringify(userWithoutPassword))
        return true
      } else {
        setError('Invalid email or password')
        return false
      }
    } catch (error) {
      setError('Login failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Get stored users
      const storedUsers = JSON.parse(localStorage.getItem('fitforce_users') || '[]')
      
      // Check if user already exists
      if (storedUsers.find((u: any) => u.email === email)) {
        setError('User with this email already exists')
        return false
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
      }

      // Store new user
      storedUsers.push(newUser)
      localStorage.setItem('fitforce_users', JSON.stringify(storedUsers))

      // Set current user (without password)
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem('fitforce_user', JSON.stringify(userWithoutPassword))
      
      return true
    } catch (error) {
      setError('Signup failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fitforce_user')
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}