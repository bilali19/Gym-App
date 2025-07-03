export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { workoutSessionModel } from '@/lib/models'

// Get specific workout session with exercises
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await workoutSessionModel.findByIdWithExercises(params.id)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Workout session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ session })

  } catch (error) {
    console.error('Get workout session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update workout session (complete or add notes)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { notes, complete } = await request.json()

    if (complete) {
      await workoutSessionModel.complete(params.id, notes)
    }

    return NextResponse.json({ message: 'Workout updated successfully' })

  } catch (error) {
    console.error('Update workout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete workout session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await workoutSessionModel.delete(params.id)
    return NextResponse.json({ message: 'Workout deleted successfully' })

  } catch (error) {
    console.error('Delete workout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}