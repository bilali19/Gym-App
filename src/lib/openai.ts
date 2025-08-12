import { OpenAI } from 'openai'

// ✅ CORRECT: Uses environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This reads from your .env.local file
})

export { openai }
