import { EXERCISES, SCHEMES, TEMPOS, WORKOUTS } from "./soldier"
import type { Exercise, WorkoutArgs, RawExercise } from "@/types"

// Move the exercisesFlattener function to the top
const exercisesFlattener = (exercisesObj: Record<string, RawExercise>): Record<string, Exercise> => {
  const flattenedObj: Record<string, Exercise> = {}

  for (const [key, val] of Object.entries(exercisesObj)) {
    if (!("variants" in val)) {
      flattenedObj[key] = {
        name: key, // Set name first
        ...val // Then spread the rest
      }
    } else {
      for (const variant in val.variants) {
        let variantName = variant + "_" + key
        let variantSubstitutes = Object.keys(val.variants!).map((element: string) => {
          return element + ' ' + key
        }).filter((element: string) => element.replaceAll(' ', '_') !== variantName)

        flattenedObj[variantName] = {
          name: variantName, // Set name first
          ...val, // Then spread the rest
          description: val.description + '___' + val.variants![variant],
          substitutes: [
            ...val.substitutes, 
            ...variantSubstitutes
          ].slice(0, 5)
        }
      }
    }
  }
  return flattenedObj
}

// Now call it after declaration
const exercises = exercisesFlattener(EXERCISES)

export const generateWorkout = (args: WorkoutArgs): Exercise[] => {
  const { muscles, poison: workout, goal } = args
  let exer = Object.keys(exercises)
  exer = exer.filter((key) => exercises[key].meta.environment !== "home")
  let includedTracker: string[] = []
  let numSets = 5
  let listOfMuscles: string[]

  if (workout === "individual") {
    listOfMuscles = muscles
  } else {
    listOfMuscles = WORKOUTS[workout][muscles[0]]
  }

  listOfMuscles = Array.from(new Set(shuffleArray(listOfMuscles)))
  let arrOfMuscles = listOfMuscles
  let scheme = goal
  let sets = SCHEMES[scheme].ratio
    .reduce((acc: string[], curr: number, index: number) => {
      return [
        ...acc,
        ...[...Array(parseInt(curr.toString())).keys()].map(() =>
          index === 0 ? "compound" : "accessory"
        ),
      ]
    }, [])
    .reduce((acc: Array<{setType: string, muscleGroup: string}>, curr: string, index: number) => {
      const muscleGroupToUse =
        index < arrOfMuscles.length
          ? arrOfMuscles[index]
          : arrOfMuscles[index % arrOfMuscles.length]
      return [
        ...acc,
        {
          setType: curr,
          muscleGroup: muscleGroupToUse,
        },
      ]
    }, [])

  const { compound: compoundExercises, accessory: accessoryExercises } =
    exer.reduce(
      (acc: {compound: Record<string, Exercise>, accessory: Record<string, Exercise>}, curr: string) => {
        let exerciseHasRequiredMuscle = false
        for (const musc of exercises[curr].muscles) {
          if (listOfMuscles.includes(musc)) {
            exerciseHasRequiredMuscle = true
          }
        }
        return exerciseHasRequiredMuscle
          ? {
              ...acc,
              [exercises[curr].type]: {
                ...acc[exercises[curr].type],
                [curr]: exercises[curr],
              },
            }
          : acc
      },
      { compound: {}, accessory: {} }
    )

  const genWOD = sets.map(({ setType, muscleGroup }) => {
    const data = setType === "compound" ? compoundExercises : accessoryExercises
    const filteredObj = Object.keys(data).reduce((acc: Record<string, Exercise>, curr: string) => {
      if (
        includedTracker.includes(curr) ||
        !data[curr].muscles.includes(muscleGroup)
      ) {
        return acc
      }
      return { ...acc, [curr]: exercises[curr] }
    }, {})
    
    const filteredDataList = Object.keys(filteredObj)
    const filteredOppList = Object.keys(
      setType === "compound" ? accessoryExercises : compoundExercises
    ).filter((val: string) => !includedTracker.includes(val))

    let randomExercise =
      filteredDataList[
        Math.floor(Math.random() * filteredDataList.length)
      ] ||
      filteredOppList[
        Math.floor(Math.random() * filteredOppList.length)
      ]

    if (!randomExercise) {
      return {} as Exercise
    }

    let repsOrDuration: number | string =
      exercises[randomExercise].unit === "reps"
        ? Math.min(...SCHEMES[scheme].repRanges) +
          Math.floor(
            Math.random() *
            (Math.max(...SCHEMES[scheme].repRanges) -
              Math.min(...SCHEMES[scheme].repRanges))
          ) +
          (setType === "accessory" ? 4 : 0)
        : Math.floor(Math.random() * 40) + 20

    const tempo = TEMPOS[Math.floor(Math.random() * TEMPOS.length)]

    if (exercises[randomExercise].unit === "reps") {
      const tempoSum = tempo
        .split(" ")
        .reduce((acc: number, curr: string) => acc + parseInt(curr), 0)
      if (tempoSum * parseInt(repsOrDuration.toString()) > 85) {
        repsOrDuration = Math.floor(85 / tempoSum)
      }
    } else {
      repsOrDuration = Math.ceil(parseInt(repsOrDuration.toString()) / 5) * 5
    }
    
    includedTracker.push(randomExercise)

    return {
      ...exercises[randomExercise], // Spread first to get the name and other properties
      tempo,
      rest: SCHEMES[scheme]["rest"][setType === "compound" ? 0 : 1],
      reps: repsOrDuration,
    }
  })

  return genWOD.filter((element: Exercise) => Object.keys(element).length > 0)
}

const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}