import { EXERCISES } from '../../utils/soldier'
import { FitnessRAGSystem } from './vectorStore'

export class FitnessKnowledgeIngestion {
  private ragSystem: FitnessRAGSystem

  constructor() {
    this.ragSystem = new FitnessRAGSystem()
  }

  // Ingest exercise data from your existing EXERCISES database
  async ingestExercises(): Promise<void> {
    console.log('Starting exercise ingestion...')
    
    for (const [exerciseName, exerciseData] of Object.entries(EXERCISES)) {
      try {
        // Create comprehensive exercise knowledge chunks
        const exerciseKnowledge: Array<{
          content: string
          sourceType: string
          sourceId: string
          metadata: Record<string, any>
        }> = [
          // Basic exercise info
          {
            content: `${exerciseName.replace(/_/g, ' ')}: ${exerciseData.description}`,
            sourceType: 'exercise_description',
            sourceId: exerciseName,
            metadata: { 
              muscles: exerciseData.muscles,
              type: exerciseData.type,
              equipment: exerciseData.meta.equipment || [],
              level: exerciseData.meta.level || []
            }
          },
          
          // Exercise form and technique
          {
            content: `How to perform ${exerciseName.replace(/_/g, ' ')}: ${exerciseData.description}. Target muscles: ${exerciseData.muscles.join(', ')}. Exercise type: ${exerciseData.type}`,
            sourceType: 'exercise_form',
            sourceId: exerciseName,
            metadata: { 
              muscles: exerciseData.muscles,
              type: exerciseData.type
            }
          },

          // Equipment and alternatives
          {
            content: `${exerciseName.replace(/_/g, ' ')} equipment needed: ${exerciseData.meta.equipment?.length ? exerciseData.meta.equipment.join(', ') : 'bodyweight only'}. Alternative exercises: ${exerciseData.substitutes.join(', ')}`,
            sourceType: 'exercise_equipment',
            sourceId: exerciseName,
            metadata: {
              equipment: exerciseData.meta.equipment || [],
              substitutes: exerciseData.substitutes
            }
          }
        ]

        // Add variants if they exist
        if ('variants' in exerciseData && exerciseData.variants) {
          for (const [variantName, variantDescription] of Object.entries(exerciseData.variants)) {
            exerciseKnowledge.push({
              content: `${exerciseName.replace(/_/g, ' ')} ${variantName} variation: ${variantDescription}`,
              sourceType: 'exercise_variant',
              sourceId: `${exerciseName}_${variantName}`,
              metadata: {
                parentExercise: exerciseName,
                variant: variantName,
                muscles: exerciseData.muscles,
                type: exerciseData.type
              }
            })
          }
        }

        // Store all knowledge chunks
        for (const knowledge of exerciseKnowledge) {
          await this.ragSystem.addKnowledge(
            knowledge.content,
            knowledge.sourceType,
            knowledge.sourceId,
            knowledge.metadata
          )
        }

        console.log(`✅ Ingested ${exerciseName}`)
      } catch (error) {
        console.error(`❌ Failed to ingest ${exerciseName}:`, error)
      }
    }
    
    console.log('Exercise ingestion completed!')
  }

  // Ingest general fitness knowledge
  async ingestFitnessKnowledge(): Promise<void> {
    const fitnessKnowledge: Array<{
      content: string
      sourceType: string
      metadata: Record<string, any>
    }> = [
      {
        content: "Progressive overload is the gradual increase of stress placed on the body during exercise training. This is achieved by increasing weight, repetitions, or frequency over time.",
        sourceType: "training_principle",
        metadata: { topic: "progressive_overload" }
      },
      {
        content: "Proper warm-up before workouts should include 5-10 minutes of light cardio followed by dynamic stretching targeting the muscles you'll be working.",
        sourceType: "workout_preparation",
        metadata: { topic: "warm_up" }
      },
      {
        content: "Rest periods between sets depend on your goal: 1-2 minutes for endurance, 2-3 minutes for hypertrophy, 3-5 minutes for strength and power.",
        sourceType: "training_guidance",
        metadata: { topic: "rest_periods" }
      },
      {
        content: "Post-workout nutrition should include protein within 30-60 minutes and carbohydrates to replenish glycogen stores.",
        sourceType: "nutrition",
        metadata: { topic: "post_workout_nutrition" }
      },
      {
        content: "Signs of overtraining include persistent fatigue, decreased performance, increased injury risk, and mood changes. Allow adequate recovery time.",
        sourceType: "recovery",
        metadata: { topic: "overtraining" }
      }
    ]

    for (const knowledge of fitnessKnowledge) {
      await this.ragSystem.addKnowledge(
        knowledge.content,
        knowledge.sourceType,
        undefined,
        knowledge.metadata
      )
    }
  }
}