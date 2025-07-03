import { NextRequest, NextResponse } from 'next/server'
import { workoutSessionModel } from '@/lib/models'

// Update exercise set
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; setId: string } }
) {
  try {
    const { actualReps, weight, completed } = await request.json()

    await workoutSessionModel.updateSet(
      params.setId,
      actualReps,
      weight,
      completed
    )

    return NextResponse.json({ message: 'Set updated successfully' })

  } catch (error) {
    console.error('Update set error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}