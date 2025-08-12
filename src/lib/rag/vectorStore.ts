import { OpenAI } from 'openai'
import pool from '../database'

export class FitnessRAGSystem {
  private openai: OpenAI
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  // Generate embeddings for content
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.trim(),
        encoding_format: 'float'
      })
      return response.data[0].embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  // Store fitness knowledge with embeddings
  async addKnowledge(
    content: string, 
    sourceType: string, 
    sourceId?: string, 
    metadata?: any
  ): Promise<void> {
    const embedding = await this.generateEmbedding(content)
    
    await pool.query(`
      INSERT INTO fitness_knowledge 
      (content, embedding, source_type, source_id, metadata)
      VALUES ($1, $2, $3, $4, $5)
    `, [content, JSON.stringify(embedding), sourceType, sourceId, metadata])
  }

  // Search for relevant knowledge using vector similarity
  async searchSimilar(
    query: string, 
    limit: number = 5, 
    sourceType?: string
  ): Promise<any[]> {
    const queryEmbedding = await this.generateEmbedding(query)
    
    let searchQuery = `
      SELECT 
        content,
        source_type,
        source_id,
        metadata,
        1 - (embedding <=> $1) as similarity
      FROM fitness_knowledge
    `
    
    const params: any[] = [JSON.stringify(queryEmbedding)]
    
    if (sourceType) {
      searchQuery += ` WHERE source_type = $2`
      params.push(sourceType)
      searchQuery += ` ORDER BY embedding <=> $1 LIMIT $3`
      params.push(limit)
    } else {
      searchQuery += ` ORDER BY embedding <=> $1 LIMIT $2`
      params.push(limit)
    }
    
    const result = await pool.query(searchQuery, params)
    return result.rows
  }

  // Generate response using retrieved context
  async generateResponse(query: string, context: string[]): Promise<string> {
    const systemPrompt = `You are FitForce AI, an expert fitness assistant. Use the provided context to answer questions about exercises, workouts, nutrition, and fitness. 

    Key guidelines:
    - Always prioritize safety and proper form
    - Provide evidence-based fitness advice
    - If unsure about medical conditions, recommend consulting healthcare professionals
    - Be encouraging and motivational
    - Use the context provided to give accurate, specific answers
    
    Context: ${context.join('\n\n')}`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.7,
      max_tokens: 800
    })

    return response.choices[0].message.content || 'Sorry, I could not generate a response.'
  }

  // Complete RAG pipeline
  async askQuestion(
    query: string, 
    userId?: string, 
    sourceType?: string
  ): Promise<{
    response: string
    sources: any[]
    confidence: number
  }> {
    try {
      // Retrieve relevant knowledge
      const retrievedChunks = await this.searchSimilar(query, 5, sourceType)
      
      if (retrievedChunks.length === 0) {
        return {
          response: "I don't have specific information about that topic. Please try rephrasing your question or contact our support team.",
          sources: [],
          confidence: 0
        }
      }

      // Extract content for context
      const context = retrievedChunks.map(chunk => chunk.content)
      
      // Generate response
      const response = await this.generateResponse(query, context)
      
      // Calculate confidence based on similarity scores
      const avgSimilarity = retrievedChunks.reduce((sum, chunk) => 
        sum + chunk.similarity, 0) / retrievedChunks.length
      
      // Store interaction for learning
      if (userId) {
        await pool.query(`
          INSERT INTO rag_interactions 
          (user_id, query, response, retrieved_chunks)
          VALUES ($1, $2, $3, $4)
        `, [userId, query, response, JSON.stringify(retrievedChunks)])
      }

      return {
        response,
        sources: retrievedChunks,
        confidence: avgSimilarity
      }
    } catch (error) {
      console.error('Error in RAG pipeline:', error)
      throw error
    }
  }
}