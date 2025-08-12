import { NextRequest, NextResponse } from 'next/server'
import { FitnessRAGSystem } from '@/lib/rag/vectorStore'
import jwt from 'jsonwebtoken'

const ragSystem = new FitnessRAGSystem()

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

    // Process the query through RAG
    const result = await ragSystem.askQuestion(query, userId, sourceType)

    return NextResponse.json({
      response: result.response,
      sources: result.sources,
      confidence: result.confidence
    })

  } catch (error) {
    console.error('RAG Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}