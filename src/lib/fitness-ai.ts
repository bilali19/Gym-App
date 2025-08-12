import { openai } from './openai'

export async function getFitnessAdvice(question: string): Promise<string> {
  try {
    console.log('🤖 Asking OpenAI:', question)

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cheaper option - about $0.002 per 1K tokens
      messages: [
        {
          role: 'system',
          content: `You are FitForce AI, an expert fitness trainer. Provide helpful, safe, and actionable fitness advice. 
          Focus on:
          - Exercise form and technique
          - Workout programming
          - Safety considerations
          - Equipment alternatives
          Keep responses concise but informative.`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 400, // Limit tokens to control cost
    })

    const answer = response.choices[0].message.content
    console.log('✅ OpenAI Response received')
    
    return answer || 'Sorry, I could not generate a response.'

  } catch (error: any) {
    console.error('❌ OpenAI Error:', error)
    
    // Handle specific errors
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid API key - please check your OpenAI configuration')
    } else if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI quota exceeded - please add credits to your account')
    } else if (error.code === 'rate_limit_exceeded') {
      throw new Error('Too many requests - please try again in a moment')
    }
    
    throw new Error('AI service temporarily unavailable')
  }
}
