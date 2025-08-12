import { FitnessKnowledgeIngestion } from '../lib/rag/ingestion'

async function initializeRAG() {
  console.log('🚀 Initializing RAG system...')
  
  const ingestion = new FitnessKnowledgeIngestion()
  
  try {
    await ingestion.ingestExercises()
    await ingestion.ingestFitnessKnowledge()
    console.log('✅ RAG system ready!')
  } catch (error) {
    console.error('❌ RAG initialization failed:', error)
  }
}