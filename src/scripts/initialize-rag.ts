
import { FitnessKnowledgeIngestion } from '@/lib/rag/ingestion'

async function initializeRAGSystem() {
  console.log('🚀 Starting RAG System Initialization...')
  
  try {
    const ingestion = new FitnessKnowledgeIngestion()
    
    console.log('📚 Ingesting exercise knowledge...')
    await ingestion.ingestExercises()
    
    console.log('🧠 Ingesting general fitness knowledge...')
    await ingestion.ingestFitnessKnowledge()
    
    console.log('✅ RAG System initialization completed successfully!')
    console.log('🎉 Your AI trainer is now ready with enhanced knowledge!')
    
  } catch (error) {
    console.error('❌ RAG initialization failed:', error)
    console.log('💡 Make sure your database tables are set up and OpenAI API key is valid')
  }
}

// Run if called directly
if (require.main === module) {
  initializeRAGSystem()
}

export { initializeRAGSystem }