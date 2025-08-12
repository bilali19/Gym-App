-- Enable pgvector extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;

-- Table to store fitness knowledge chunks
CREATE TABLE fitness_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embedding dimension
  source_type VARCHAR(50) NOT NULL, -- 'exercise', 'nutrition', 'form_tip', 'workout_plan'
  source_id TEXT, -- Reference to specific exercise, workout, etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX ON fitness_knowledge USING hnsw (embedding vector_cosine_ops);

-- Table to store user queries and responses for improvement
CREATE TABLE rag_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  query TEXT NOT NULL,
  response TEXT,
  retrieved_chunks JSONB,
  rating INTEGER, -- User feedback 1-5
  created_at TIMESTAMP DEFAULT NOW()
);