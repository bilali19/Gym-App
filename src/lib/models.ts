import pool from './database'
import bcrypt from 'bcryptjs'
import { Exercise } from '@/types'

export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface WorkoutSession {
  id: string
  user_id: string
  date: string
  start_time: string
  end_time?: string
  workout_type: string
  target_muscles: string[]
  goal: string
  total_sets: number
  completed_sets: number
  notes?: string
  exercises?: WorkoutExercise[]
}

export interface WorkoutExercise {
  id: string
  workout_session_id: string
  exercise_name: string
  exercise_type: string
  muscles: string[]
  description: string
  unit: string
  target_reps?: number
  target_rest?: number
  tempo?: string
  notes?: string
  order_index: number
  sets?: ExerciseSet[]
}

export interface ExerciseSet {
  id: string
  workout_exercise_id: string
  set_number: number
  target_reps?: number
  actual_reps?: number
  weight?: number
  completed: boolean
  completed_at?: string
}

// Helper function to ensure arrays are properly handled
const ensureArray = (value: any): string[] => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    // Handle PostgreSQL array string format like "{chest,triceps}"
    if (value.startsWith('{') && value.endsWith('}')) {
      return value.slice(1, -1).split(',').filter(Boolean)
    }
    return [value]
  }
  return []
}

// User methods
export const userModel = {
  async create(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `
    
    const result = await pool.query(query, [name, email, hashedPassword])
    return result.rows[0]
  },

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT id, name, email, created_at FROM users WHERE email = $1'
    const result = await pool.query(query, [email])
    return result.rows[0] || null
  },

  async findByEmailWithPassword(email: string): Promise<(User & { password_hash: string }) | null> {
    const query = 'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1'
    const result = await pool.query(query, [email])
    return result.rows[0] || null
  },

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  },

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}

// Workout session methods
export const workoutSessionModel = {
  async create(
    userId: string,
    workoutType: string,
    targetMuscles: string[],
    goal: string,
    exercises: Exercise[]
  ): Promise<WorkoutSession> {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Create workout session
      const sessionQuery = `
        INSERT INTO workout_sessions (user_id, date, start_time, workout_type, target_muscles, goal, total_sets)
        VALUES ($1, CURRENT_DATE, CURRENT_TIMESTAMP, $2, $3, $4, $5)
        RETURNING *
      `
      
      const totalSets = exercises.length * 5 // 5 sets per exercise
      const sessionResult = await client.query(sessionQuery, [
        userId,
        workoutType,
        targetMuscles,
        goal,
        totalSets
      ])
      
      const session = sessionResult.rows[0]

      // Create workout exercises
      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i]
        
        const exerciseQuery = `
          INSERT INTO workout_exercises 
          (workout_session_id, exercise_name, exercise_type, muscles, description, unit, target_reps, target_rest, tempo, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
        `
        
        const exerciseResult = await client.query(exerciseQuery, [
          session.id,
          exercise.name,
          exercise.type,
          exercise.muscles,
          exercise.description,
          exercise.unit,
          exercise.reps,
          exercise.rest,
          exercise.tempo,
          i
        ])
        
        const workoutExercise = exerciseResult.rows[0]

        // Create 5 sets for each exercise
        for (let setNum = 1; setNum <= 5; setNum++) {
          const setQuery = `
            INSERT INTO exercise_sets (workout_exercise_id, set_number, target_reps)
            VALUES ($1, $2, $3)
          `
          
          await client.query(setQuery, [
            workoutExercise.id,
            setNum,
            exercise.reps
          ])
        }
      }

      await client.query('COMMIT')
      
      // Transform the session data to ensure arrays are properly formatted
      return {
        ...session,
        target_muscles: ensureArray(session.target_muscles)
      }

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  },

  async findByUserId(userId: string): Promise<WorkoutSession[]> {
    const query = `
      SELECT 
        ws.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', we.id,
              'name', we.exercise_name,
              'type', we.exercise_type,
              'muscles', we.muscles,
              'description', we.description,
              'unit', we.unit,
              'target_reps', we.target_reps,
              'target_rest', we.target_rest,
              'tempo', we.tempo,
              'notes', we.notes,
              'order_index', we.order_index,
              'sets', COALESCE(
                (
                  SELECT json_agg(
                    json_build_object(
                      'id', es.id,
                      'setNumber', es.set_number,
                      'targetReps', es.target_reps,
                      'actualReps', es.actual_reps,
                      'weight', es.weight,
                      'completed', es.completed,
                      'completedAt', es.completed_at
                    ) ORDER BY es.set_number
                  )
                  FROM exercise_sets es 
                  WHERE es.workout_exercise_id = we.id
                ), '[]'::json
              )
            ) ORDER BY we.order_index
          ) FILTER (WHERE we.id IS NOT NULL), 
          '[]'::json
        ) as exercises
      FROM workout_sessions ws
      LEFT JOIN workout_exercises we ON ws.id = we.workout_session_id
      WHERE ws.user_id = $1 
      GROUP BY ws.id
      ORDER BY ws.start_time DESC
    `
    
    const result = await pool.query(query, [userId])
    
    return result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      date: row.date,
      start_time: row.start_time,
      end_time: row.end_time,
      workout_type: row.workout_type,
      target_muscles: ensureArray(row.target_muscles),
      goal: row.goal,
      total_sets: row.total_sets,
      completed_sets: row.completed_sets,
      notes: row.notes,
      exercises: Array.isArray(row.exercises) ? row.exercises.map((ex: any) => ({
        id: ex.id,
        workout_session_id: row.id,
        exercise_name: ex.name,
        exercise_type: ex.type,
        muscles: ensureArray(ex.muscles),
        description: ex.description,
        unit: ex.unit,
        target_reps: ex.target_reps,
        target_rest: ex.target_rest,
        tempo: ex.tempo,
        notes: ex.notes,
        order_index: ex.order_index,
        sets: Array.isArray(ex.sets) ? ex.sets : []
      })) : []
    }))
  },

  async findByIdWithExercises(sessionId: string): Promise<WorkoutSession | null> {
    const sessionQuery = 'SELECT * FROM workout_sessions WHERE id = $1'
    const sessionResult = await pool.query(sessionQuery, [sessionId])
    
    if (sessionResult.rows.length === 0) return null
    
    const session = sessionResult.rows[0]

    // Get exercises with sets
    const exercisesQuery = `
      SELECT we.*, 
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', es.id,
                   'setNumber', es.set_number,
                   'targetReps', es.target_reps,
                   'actualReps', es.actual_reps,
                   'weight', es.weight,
                   'completed', es.completed,
                   'completedAt', es.completed_at
                 ) ORDER BY es.set_number
               ) FILTER (WHERE es.id IS NOT NULL), 
               '[]'
             ) as sets
      FROM workout_exercises we
      LEFT JOIN exercise_sets es ON we.id = es.workout_exercise_id
      WHERE we.workout_session_id = $1
      GROUP BY we.id
      ORDER BY we.order_index
    `
    
    const exercisesResult = await pool.query(exercisesQuery, [sessionId])
    
    return {
      id: session.id,
      user_id: session.user_id,
      date: session.date,
      start_time: session.start_time,
      end_time: session.end_time,
      workout_type: session.workout_type,
      target_muscles: ensureArray(session.target_muscles),
      goal: session.goal,
      total_sets: session.total_sets,
      completed_sets: session.completed_sets,
      notes: session.notes,
      exercises: exercisesResult.rows.map(row => ({
        id: row.id,
        workout_session_id: sessionId,
        exercise_name: row.exercise_name,
        exercise_type: row.exercise_type,
        muscles: ensureArray(row.muscles),
        description: row.description,
        unit: row.unit,
        target_reps: row.target_reps,
        target_rest: row.target_rest,
        tempo: row.tempo,
        notes: row.notes,
        order_index: row.order_index,
        sets: Array.isArray(row.sets) ? row.sets : []
      }))
    }
  },

  async updateSet(
    setId: string,
    actualReps?: number,
    weight?: number,
    completed?: boolean
  ): Promise<void> {
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (actualReps !== undefined) {
      updates.push(`actual_reps = $${paramCount}`)
      values.push(actualReps)
      paramCount++
    }

    if (weight !== undefined) {
      updates.push(`weight = $${paramCount}`)
      values.push(weight)
      paramCount++
    }

    if (completed !== undefined) {
      updates.push(`completed = $${paramCount}`)
      values.push(completed)
      paramCount++
      
      if (completed) {
        updates.push(`completed_at = CURRENT_TIMESTAMP`)
      }
    }

    if (updates.length === 0) return

    values.push(setId)
    
    const query = `
      UPDATE exercise_sets 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
    `
    
    await pool.query(query, values)

    // Update completed sets count in workout session
    if (completed !== undefined) {
      await this.updateCompletedSetsCount(setId)
    }
  },

  async updateCompletedSetsCount(setId: string): Promise<void> {
    const query = `
      UPDATE workout_sessions 
      SET completed_sets = (
        SELECT COUNT(*) 
        FROM exercise_sets es
        JOIN workout_exercises we ON es.workout_exercise_id = we.id
        WHERE we.workout_session_id = workout_sessions.id 
        AND es.completed = true
      )
      WHERE id = (
        SELECT we.workout_session_id 
        FROM exercise_sets es
        JOIN workout_exercises we ON es.workout_exercise_id = we.id
        WHERE es.id = $1
      )
    `
    
    await pool.query(query, [setId])
  },

  async addExerciseNote(exerciseId: string, notes: string): Promise<void> {
    const query = 'UPDATE workout_exercises SET notes = $1 WHERE id = $2'
    await pool.query(query, [notes, exerciseId])
  },

  async complete(sessionId: string, notes?: string): Promise<void> {
    const query = `
      UPDATE workout_sessions 
      SET end_time = CURRENT_TIMESTAMP, notes = $1 
      WHERE id = $2
    `
    
    await pool.query(query, [notes, sessionId])
  },

  async delete(sessionId: string): Promise<void> {
    const query = 'DELETE FROM workout_sessions WHERE id = $1'
    await pool.query(query, [sessionId])
  }
}

// Stats methods
export const statsModel = {
  async getUserStats(userId: string) {
    const query = `
      SELECT 
        COUNT(*) as total_workouts,
        COALESCE(SUM(completed_sets), 0) as total_sets,
        COALESCE(AVG(
          CASE 
            WHEN end_time IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 60 
            ELSE NULL 
          END
        ), 0) as average_workout_time,
        (
          SELECT unnest_val
          FROM (
            SELECT unnest(target_muscles) as unnest_val
            FROM workout_sessions 
            WHERE user_id = $1 AND end_time IS NOT NULL
          ) subq
          GROUP BY unnest_val
          ORDER BY COUNT(*) DESC
          LIMIT 1
        ) as most_targeted_muscle
      FROM workout_sessions 
      WHERE user_id = $1 AND end_time IS NOT NULL
    `
    
    const result = await pool.query(query, [userId])
    const stats = result.rows[0]
    
    return {
      totalWorkouts: parseInt(stats.total_workouts) || 0,
      totalSets: parseInt(stats.total_sets) || 0,
      averageWorkoutTime: parseFloat(stats.average_workout_time) || 0,
      mostTargetedMuscle: stats.most_targeted_muscle || 'None'
    }
  }
}