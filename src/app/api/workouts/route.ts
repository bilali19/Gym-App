import { NextRequest, NextResponse } from 'next/server'
import { workoutSessionModel, userModel } from '@/lib/models'
import jwt from 'jsonwebtoken'

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    throw new Error('No token provided')
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
  const user = await userModel.findById(decoded.userId)
  
  if (!user) {
    throw new Error('User not found')
  }

  return user
}

// Create new workout session
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    const { workoutType, targetMuscles, goal, exercises } = await request.json()

    if (!workoutType || !targetMuscles || !goal || !exercises) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const session = await workoutSessionModel.create(
      user.id,
      workoutType,
      targetMuscles,
      goal,
      exercises
    )

    return NextResponse.json({ session })

  } catch (error) {
    console.error('Create workout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get user's workout history
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    const sessions = await workoutSessionModel.findByUserId(user.id)

    return NextResponse.json({ sessions })

  } catch (error) {
    console.error('Get workouts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}