import { NextRequest, NextResponse } from 'next/server'
import { getFitnessAdvice } from '@/lib/fitness-ai'
import { getOfflineFitnessAdviceStructured } from '@/lib/offline-fitness-ai'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { query, sourceType } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Get user ID if authenticated
    const token = request.cookies.get('auth-token')?.value
    let userId: string | undefined

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
        userId = decoded.userId
      } catch (error) {
        // Continue without user ID if token is invalid
      }
    }

    let result: any

    try {
      // Try OpenAI simple fitness AI first
      console.log('🤖 Using OpenAI Simple AI for:', query)
      const advice = await getFitnessAdvice(query)
      
      result = {
        response: advice,
        sources: [{
          content: 'OpenAI Fitness AI',
          source_type: 'openai_simple',
          similarity: 0.95
        }],
        confidence: 0.95
      }
      
      console.log('✅ OpenAI Simple AI response successful')
      
    } catch (error: any) {
      console.log('⚠️ OpenAI failed, using offline knowledge...', error.message)
      
      // Fallback to offline knowledge
      const offlineResult = getOfflineFitnessAdviceStructured(query)
      
      result = {
        response: `🤖 **Offline AI Response** (OpenAI temporarily unavailable)\n\n${offlineResult.response}\n\n---\n💡 *Full AI services will return once API quota is restored.*`,
        sources: [{
          content: 'Offline Knowledge Base',
          source_type: 'offline_knowledge',
          similarity: 0.9,
          category: offlineResult.category
        }],
        confidence: offlineResult.confidence
      }
    }

    return NextResponse.json({
      response: result.response,
      sources: result.sources,
      confidence: result.confidence
    })

  } catch (error) {
    console.error('❌ RAG Chat error:', error)
    
    // Final emergency fallback
    const fallbackQuery = 'general fitness advice'
    const offlineResult = getOfflineFitnessAdviceStructured(fallbackQuery)
    
    return NextResponse.json({
      response: `🤖 **Emergency Offline Mode**\n\n${offlineResult.response}\n\n---\n💡 *All AI services temporarily unavailable.*`,
      sources: [{
        content: 'Offline Emergency Knowledge',
        source_type: 'offline_emergency',
        similarity: 0.5
      }],
      confidence: 0.5
    })
  }
}