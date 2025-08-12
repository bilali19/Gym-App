import { FitnessKnowledgeIngestion } from '../lib/rag/ingestion'

async function initializeRAG() {
  console.log('🚀 Initializing FitForce RAG System...')
  
  const ingestion = new FitnessKnowledgeIngestion()
  
  try {
    // Ingest exercise data
    await ingestion.ingestExercises()
    
    // Ingest general fitness knowledge
    await ingestion.ingestFitnessKnowledge()
    
    console.log('✅ RAG System initialized successfully!')
  } catch (error) {
    console.error('❌ RAG initialization failed:', error)
  }
}

// Run initialization
if (require.main === module) {
  initializeRAG()
}