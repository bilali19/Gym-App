import { NextRequest, NextResponse } from 'next/server'
import { getFitnessAdvice } from '@/lib/fitness-ai'
import { getOfflineFitnessAdvice } from '@/lib/offline-fitness-ai'

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

    let advice: string
    let source = 'openai'

    try {
      // Try OpenAI first
      advice = await getFitnessAdvice(question)
      console.log('✅ OpenAI response successful')
    } catch (error: any) {
      console.log('⚠️ OpenAI failed, using offline knowledge...', error.message)
      
      // Fallback to offline knowledge
      advice = getOfflineFitnessAdvice(question)
      source = 'offline'
      
      // Add a note about the fallback
      advice = `🤖 **Offline AI Response** (OpenAI temporarily unavailable)\n\n${advice}\n\n---\n💡 *Full AI services will return once API quota is restored.*`
    }

    return NextResponse.json({
      success: true,
      question: question,
      advice: advice,
      source: source,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Fitness AI API Error:', error)
    
    // Final fallback - basic offline response
    const fallbackQuestion = 'general fitness advice'
    const offlineAdvice = getOfflineFitnessAdvice(fallbackQuestion)
    
    return NextResponse.json({
      success: true,
      question: fallbackQuestion,
      advice: `🤖 **Offline AI Response**\n\n${offlineAdvice}\n\n---\n💡 *AI services temporarily unavailable. Basic guidance provided.*`,
      source: 'offline_fallback',
      timestamp: new Date().toISOString()
    })
  }
}