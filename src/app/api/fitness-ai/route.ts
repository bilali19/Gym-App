import { NextRequest, NextResponse } from 'next/server'
import { getFitnessAdvice } from '@/lib/fitness-ai'

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()

    // Validate input
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      )
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: 'Question too long - please keep it under 500 characters' },
        { status: 400 }
      )
    }

    // Get AI response
    const advice = await getFitnessAdvice(question)

    return NextResponse.json({
      success: true,
      question: question,
      advice: advice,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Fitness AI API Error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}