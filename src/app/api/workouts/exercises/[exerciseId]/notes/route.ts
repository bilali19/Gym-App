import { NextRequest, NextResponse } from 'next/server'
import { workoutSessionModel } from '@/lib/models'

// Add note to exercise
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; exerciseId: string } }
) {
  try {
    const { notes } = await request.json()

    await workoutSessionModel.addExerciseNote(params.exerciseId, notes)

    return NextResponse.json({ message: 'Exercise note added successfully' })

  } catch (error) {
    console.error('Add exercise note error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}