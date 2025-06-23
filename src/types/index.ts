export interface Exercise {
    name: string
    type: 'compound' | 'accessory'
    meta: {
      environment: string
      level: number[]
      equipment: string[]
    }
    unit: 'reps' | 'duration'
    muscles: string[]
    description: string
    substitutes: string[]
    tempo?: string
    rest?: number
    reps?: number | string
    variants?: Record<string, string>
  }

  // Add this new interface for raw exercises from soldier.ts
  export interface RawExercise extends Omit<Exercise, 'name'> {
    variants?: Record<string, string>
  }
  
  export interface WorkoutArgs {
    muscles: string[]
    poison: string
    goal: string
  }
  
  export interface Scheme {
    repRanges: number[]
    ratio: number[]
    rest: number[]
  }
  
  export interface ButtonProps {
    text: string
    func: () => void
  }
  
  export interface ExerciseCardProps {
    exercise: Exercise
    i: number
  }
  
  export interface GeneratorProps {
    muscles: string[]
    setMuscles: (muscles: string[]) => void
    poison: string
    setPoison: (poison: string) => void
    goal: string
    setGoal: (goal: string) => void
    updateWorkout: () => void
  }
  
  export interface HeroProps {}
  
  export interface SectionWrapperProps {
    children: React.ReactNode
    header: string
    title: string[]
    id: string
  }
  
  export interface WorkoutProps {
    workout: Exercise[]
  }