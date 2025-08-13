interface FitnessKnowledge {
    [key: string]: {
      keywords: string[]
      response: string
      category: 'exercise' | 'nutrition' | 'form' | 'programming' | 'recovery'
    }
  }
  
  const FITNESS_KNOWLEDGE: FitnessKnowledge = {
    // Exercise Form & Technique
    squat_form: {
      keywords: ['squat', 'form', 'technique', 'proper', 'how to squat'],
      response: `**Proper Squat Form:**
  
  🎯 **Setup:**
  - Feet shoulder-width apart, toes slightly pointed out
  - Core braced, chest up, eyes forward
  - Weight evenly distributed across feet
  
  🔽 **Descent:**
  - Initiate by pushing hips back
  - Bend at hips and knees simultaneously
  - Keep knees tracking over toes
  - Descend until thighs are parallel to floor
  
  🔼 **Ascent:**
  - Drive through heels
  - Push the floor away
  - Keep chest up throughout movement
  - Squeeze glutes at the top
  
  ⚠️ **Common Mistakes:** Knee cave, forward lean, heel rise, shallow depth`,
      category: 'form'
    },
  
    deadlift_form: {
      keywords: ['deadlift', 'form', 'technique', 'proper', 'how to deadlift'],
      response: `**Proper Deadlift Form:**
  
  🎯 **Setup:**
  - Bar over mid-foot, close to shins
  - Feet hip-width apart
  - Grip just outside legs
  - Shoulders over bar, chest up
  
  🔽 **Lift:**
  - Drive through heels
  - Keep bar close to body
  - Lift chest and hips simultaneously
  - Squeeze glutes at top
  
  🔽 **Lowering:**
  - Hinge at hips first
  - Keep bar close to legs
  - Bend knees once bar passes them
  
  ⚠️ **Safety:** Never round your back, keep neutral spine throughout`,
      category: 'form'
    },
  
    bench_press: {
      keywords: ['bench press', 'bench', 'chest', 'press', 'form'],
      response: `**Bench Press Form:**
  
  🛏️ **Setup:**
  - Lie flat, eyes under bar
  - Grip slightly wider than shoulders
  - Feet flat on floor
  - Tight back arch, shoulder blades retracted
  
  📉 **Descent:**
  - Lower bar to chest with control
  - Elbows at 45-degree angle
  - Touch chest lightly
  
  📈 **Press:**
  - Drive feet into ground
  - Press bar straight up
  - Lock out arms at top
  
  💪 **Muscles:** Primary: Chest, shoulders, triceps`,
      category: 'form'
    },
  
    // Workout Programming
    muscle_building: {
      keywords: ['muscle building', 'hypertrophy', 'gain muscle', 'bigger', 'size'],
      response: `**Muscle Building Guidelines:**
  
  📊 **Rep Ranges:** 6-15 reps for optimal hypertrophy
  ⏱️ **Rest:** 2-3 minutes between sets
  📈 **Volume:** 10-20 sets per muscle per week
  🎯 **Frequency:** Train each muscle 2-3x per week
  
  🍽️ **Nutrition:**
  - Caloric surplus (200-500 calories above maintenance)
  - 1.6-2.2g protein per kg body weight
  - Adequate carbs for energy
  
  ⏰ **Progressive Overload:**
  - Gradually increase weight, reps, or sets
  - Track your workouts
  - Be consistent`,
      category: 'programming'
    },
  
    strength_training: {
      keywords: ['strength', 'strong', 'powerlifting', '1rm', 'max'],
      response: `**Strength Training:**
  
  📊 **Rep Ranges:** 1-5 reps at 85-95% 1RM
  ⏱️ **Rest:** 3-5 minutes between sets
  🎯 **Frequency:** 3-4x per week
  📈 **Focus:** Compound movements (squat, bench, deadlift)
  
  ⚡ **Key Principles:**
  - Progressive overload
  - Perfect form before adding weight
  - Adequate recovery
  - Consistent training
  
  🍽️ **Nutrition:** Maintain/slight surplus with high protein`,
      category: 'programming'
    },
  
    fat_loss: {
      keywords: ['lose weight', 'fat loss', 'cutting', 'lean', 'burn fat'],
      response: `**Fat Loss Strategy:**
  
  🔥 **Caloric Deficit:** Eat 200-500 calories below maintenance
  🏋️ **Training:** 
  - Maintain strength training
  - Add cardio 3-4x per week
  - Higher rep ranges (8-15)
  
  🍽️ **Nutrition:**
  - High protein (2.2-3.3g per kg bodyweight)
  - Plenty of vegetables
  - Stay hydrated
  - Don't drastically cut calories
  
  📊 **Realistic Goals:** 0.5-1kg per week
  ⏰ **Patience:** Sustainable fat loss takes time`,
      category: 'nutrition'
    },
  
    // Nutrition
    post_workout_nutrition: {
      keywords: ['post workout', 'after workout', 'protein shake', 'recovery meal'],
      response: `**Post-Workout Nutrition:**
  
  ⏰ **Timing:** Within 2 hours (not critical if you ate before)
  
  🥩 **Protein:** 20-40g high-quality protein
  - Whey protein shake
  - Chicken breast
  - Greek yogurt
  - Eggs
  
  🍌 **Carbs:** 30-60g to replenish glycogen
  - Banana
  - Rice
  - Oats
  - Sweet potato
  
  💧 **Hydration:** Replace fluids lost through sweat
  
  💡 **Tip:** If you had a pre-workout meal within 3 hours, post-workout timing is less critical`,
      category: 'nutrition'
    },
  
    // Recovery
    rest_days: {
      keywords: ['rest day', 'recovery', 'off day', 'how often'],
      response: `**Rest and Recovery:**
  
  📅 **Frequency:** At least 1-2 full rest days per week
  🛌 **Sleep:** 7-9 hours for optimal recovery
  💧 **Hydration:** Adequate water intake
  
  🚶 **Active Recovery:**
  - Light walking
  - Stretching
  - Yoga
  - Easy bike ride
  
  ⚠️ **Signs You Need Rest:**
  - Persistent fatigue
  - Declining performance
  - Mood changes
  - Increased injury risk
  
  💡 **Remember:** Muscle growth happens during rest, not just training!`,
      category: 'recovery'
    },
  
    // Common Questions
    how_many_sets: {
      keywords: ['how many sets', 'sets', 'reps', 'volume'],
      response: `**Sets and Reps Guidelines:**
  
  🎯 **Beginners:** 2-3 sets per exercise
  🎯 **Intermediate:** 3-4 sets per exercise
  🎯 **Advanced:** 4-6 sets per exercise
  
  📊 **Rep Ranges by Goal:**
  - Strength: 1-5 reps
  - Muscle Building: 6-15 reps
  - Endurance: 15+ reps
  
  📈 **Weekly Volume:**
  - 10-20 sets per muscle group per week
  - Start lower and gradually increase
  
  ⏱️ **Rest Between Sets:**
  - Strength: 3-5 minutes
  - Hypertrophy: 2-3 minutes
  - Endurance: 1-2 minutes`,
      category: 'programming'
    },
  
    cardio: {
      keywords: ['cardio', 'running', 'treadmill', 'endurance', 'heart'],
      response: `**Cardio Guidelines:**
  
  🎯 **For Fat Loss:**
  - 150-300 minutes moderate intensity per week
  - Or 75-150 minutes vigorous intensity
  - Can be split into shorter sessions
  
  💪 **For Heart Health:**
  - Minimum 150 minutes moderate per week
  - Include both steady-state and intervals
  
  🏃 **Types:**
  - LISS: Walking, jogging, cycling
  - HIIT: Sprint intervals, bike intervals
  - Sports: Basketball, tennis, swimming
  
  ⚖️ **Balance:** Don't let cardio interfere with strength training recovery`,
      category: 'programming'
    }
  }
  
  // Simple keyword matching function
  function findBestMatch(query: string): string {
    const queryLower = query.toLowerCase()
    let bestMatch = ''
    let maxMatches = 0
  
    for (const [key, knowledge] of Object.entries(FITNESS_KNOWLEDGE)) {
      let matches = 0
      for (const keyword of knowledge.keywords) {
        if (queryLower.includes(keyword.toLowerCase())) {
          matches++
        }
      }
      
      if (matches > maxMatches) {
        maxMatches = matches
        bestMatch = key
      }
    }
  
    return bestMatch
  }
  
  // Main offline AI function
  export function getOfflineFitnessAdvice(question: string): string {
    const bestMatch = findBestMatch(question)
    
    if (bestMatch && FITNESS_KNOWLEDGE[bestMatch]) {
      return FITNESS_KNOWLEDGE[bestMatch].response
    }
  
    // Default responses for common question types
    if (question.toLowerCase().includes('workout') || question.toLowerCase().includes('routine')) {
      return `**General Workout Advice:**
  
  🏋️ **For Beginners:**
  - Start with compound movements
  - 3 full-body workouts per week
  - Focus on form over weight
  - Progressive overload gradually
  
  📅 **Sample Beginner Routine:**
  - Squats: 3 sets x 8-12 reps
  - Push-ups/Bench Press: 3 sets x 8-12 reps  
  - Rows: 3 sets x 8-12 reps
  - Planks: 3 sets x 30-60 seconds
  
  💡 **Key Principles:**
  - Consistency beats perfection
  - Track your progress
  - Listen to your body
  - Ask for help with form`
    }
  
    if (question.toLowerCase().includes('diet') || question.toLowerCase().includes('eat')) {
      return `**General Nutrition Guidelines:**
  
  🍽️ **Balanced Diet:**
  - Lean proteins (chicken, fish, eggs, legumes)
  - Complex carbs (rice, oats, potatoes)
  - Healthy fats (nuts, avocado, olive oil)
  - Plenty of vegetables and fruits
  
  💧 **Hydration:** Aim for 8-10 glasses of water daily
  
  ⏰ **Meal Timing:**
  - Eat every 3-4 hours
  - Don't skip breakfast
  - Have protein with each meal
  
  📊 **Portions:** Use your hand as a guide
  - Palm-sized protein
  - Fist-sized vegetables
  - Cupped-hand carbs
  - Thumb-sized fats`
    }
  
    // Fallback response
    return `**General Fitness Guidance:**
  
  I'd love to help with your fitness question! While my AI services are temporarily unavailable, here are some key principles:
  
  💪 **Training Basics:**
  - Consistency is key
  - Progressive overload
  - Proper form first
  - Allow adequate recovery
  
  🍽️ **Nutrition Basics:**
  - Eat whole foods
  - Adequate protein
  - Stay hydrated
  - Match calories to goals
  
  ❓ **Try asking more specific questions like:**
  - "How to do proper squats?"
  - "How many sets should I do?"
  - "What to eat after workout?"
  - "How often should I train?"
  
  🔧 **Note:** Full AI services will return once API quota is restored.`
  }
  
  // Alternative function that returns structured data
  export function getOfflineFitnessAdviceStructured(question: string) {
    const advice = getOfflineFitnessAdvice(question)
    const bestMatch = findBestMatch(question)
    
    return {
      response: advice,
      source: 'offline_knowledge',
      category: bestMatch ? FITNESS_KNOWLEDGE[bestMatch].category : 'general',
      confidence: bestMatch ? 0.9 : 0.3
    }
  }