'use client'

import React, { useState, useMemo } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { useWorkoutTracking } from '@/contexts/WorkoutTrackingContext'

interface ProgressChartsProps {
  className?: string
}

interface ChartData {
  id: string
  date: string
  [key: string]: string | number
}

const ProgressCharts = ({ className = '' }: ProgressChartsProps) => {
  const { workoutHistory } = useWorkoutTracking()
  const [chartType, setChartType] = useState<'workout' | 'exercise' | 'muscle'>('workout')
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'all'>('month')
  const [selectedExercise, setSelectedExercise] = useState<string>('')

  // Filter workouts by timeframe
  const filteredWorkouts = useMemo(() => {
    const now = new Date()
    return workoutHistory.filter(workout => {
      const workoutDate = new Date(workout.date)
      const daysDiff = Math.floor((now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (timeframe) {
        case 'week': return daysDiff <= 7
        case 'month': return daysDiff <= 30
        case 'quarter': return daysDiff <= 90
        default: return true
      }
    })
  }, [workoutHistory, timeframe])

  // Get all unique exercises from workout history
  const allExercises = useMemo(() => {
    const exercises = new Set<string>()
    workoutHistory.forEach(workout => {
      // Safely handle exercises array
      const exerciseList = Array.isArray(workout.exercises) ? workout.exercises : []
      exerciseList.forEach(exercise => {
        if (exercise && exercise.name) {
          exercises.add(exercise.name.replace(/_/g, ' '))
        }
      })
    })
    return Array.from(exercises).sort()
  }, [workoutHistory])

  // Workout Progress Chart Data
  const workoutChartData = useMemo(() => {
    const groupedByDate = filteredWorkouts.reduce((acc, workout) => {
      const date = workout.date
      if (!acc[date]) {
        acc[date] = {
          date,
          workouts: 0,
          totalSets: 0,
          completedSets: 0,
          duration: 0
        }
      }
      
      acc[date].workouts += 1
      acc[date].totalSets += workout.totalSets
      acc[date].completedSets += workout.completedSets
      
      if (workout.endTime) {
        const duration = (new Date(workout.endTime).getTime() - new Date(workout.startTime).getTime()) / (1000 * 60)
        acc[date].duration += duration
      }
      
      return acc
    }, {} as Record<string, any>)

    return Object.values(groupedByDate)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item: any) => ({
        id: item.date,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'Sets Completed': item.completedSets,
        'Duration (min)': Math.round(item.duration),
        'Completion %': Math.round((item.completedSets / item.totalSets) * 100) || 0
      }))
  }, [filteredWorkouts])

  // Exercise Progress Chart Data
  const exerciseChartData = useMemo(() => {
    if (!selectedExercise) return []

    const exerciseData = filteredWorkouts.reduce((acc, workout) => {
      // Safely handle exercises array
      const exerciseList = Array.isArray(workout.exercises) ? workout.exercises : []
      const exercise = exerciseList.find(ex => 
        ex && ex.name && ex.name.replace(/_/g, ' ') === selectedExercise
      )
      
      if (exercise && Array.isArray(exercise.sets)) {
        const date = workout.date
        const completedSets = exercise.sets.filter(set => set && set.completed).length
        const validWeightSets = exercise.sets.filter(set => set && set.weight && set.completed)
        const validRepSets = exercise.sets.filter(set => set && set.actualReps && set.completed)
        
        const avgWeight = validWeightSets.length > 0 
          ? validWeightSets.reduce((sum, set) => sum + (set.weight || 0), 0) / validWeightSets.length
          : 0
          
        const avgReps = validRepSets.length > 0
          ? validRepSets.reduce((sum, set) => sum + (set.actualReps || 0), 0) / validRepSets.length
          : 0

        acc.push({
          id: date,
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          'Sets': completedSets,
          'Avg Weight': Math.round(avgWeight),
          'Avg Reps': Math.round(avgReps)
        })
      }
      
      return acc
    }, [] as any[])

    return exerciseData.sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime())
  }, [filteredWorkouts, selectedExercise])

  // Muscle Group Progress Chart Data
  const muscleChartData = useMemo(() => {
    const muscleData = filteredWorkouts.reduce((acc, workout) => {
      // Safely handle targetMuscles array
      const muscles = Array.isArray(workout.targetMuscles) ? workout.targetMuscles : []
      muscles.forEach(muscle => {
        if (!acc[muscle]) {
          acc[muscle] = { muscle, workouts: 0, sets: 0 }
        }
        acc[muscle].workouts += 1
        acc[muscle].sets += workout.completedSets || 0
      })
      return acc
    }, {} as Record<string, any>)

    return Object.values(muscleData)
      .sort((a: any, b: any) => b.sets - a.sets)
      .slice(0, 8) // Top 8 muscles
      .map((item: any) => ({
        id: item.muscle,
        muscle: item.muscle.charAt(0).toUpperCase() + item.muscle.slice(1),
        'Workouts': item.workouts,
        'Total Sets': item.sets
      }))
  }, [filteredWorkouts])

  const getCurrentData = () => {
    switch (chartType) {
      case 'workout': return workoutChartData
      case 'exercise': return exerciseChartData
      case 'muscle': return muscleChartData
      default: return []
    }
  }

  const getCurrentKeys = () => {
    switch (chartType) {
      case 'workout': return ['Sets Completed', 'Duration (min)', 'Completion %']
      case 'exercise': return ['Sets', 'Avg Weight', 'Avg Reps']
      case 'muscle': return ['Workouts', 'Total Sets']
      default: return []
    }
  }

  const getIndexBy = () => {
    switch (chartType) {
      case 'muscle': return 'muscle'
      default: return 'date'
    }
  }

  const chartData = getCurrentData()
  const chartKeys = getCurrentKeys()

  if (workoutHistory.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-chart-bar text-gray-400 text-2xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Progress Data</h3>
        <p className="text-gray-600">Complete your first workout to see progress charts here.</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Analytics</h3>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Chart Type Selector */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="workout">Workout Progress</option>
              <option value="exercise">Exercise Progress</option>
              <option value="muscle">Muscle Group Analysis</option>
            </select>
          </div>

          {/* Timeframe Selector */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Exercise Selector (only for exercise chart) */}
          {chartType === 'exercise' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Exercise</label>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select an exercise</option>
                {allExercises.map(exercise => (
                  <option key={exercise} value={exercise}>
                    {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div style={{ height: '400px' }}>
          <ResponsiveBar
            data={chartData}
            keys={chartKeys}
            indexBy={getIndexBy()}
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'category10' }}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
              },
              {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
              }
            ]}
            borderColor={{
              from: 'color',
              modifiers: [
                ['darker', 1.6]
              ]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: chartType === 'muscle' ? -45 : 0,
              legend: chartType === 'muscle' ? 'Muscle Groups' : 'Date',
              legendPosition: 'middle',
              legendOffset: 32
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Value',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: 'color',
              modifiers: [
                ['darker', 1.6]
              ]
            }}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            role="application"
            ariaLabel="Workout progress chart"
            barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in "+e.indexValue}}
            animate={true}
            motionConfig="gentle"
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontSize: 12,
                    fill: '#6B7280'
                  }
                },
                legend: {
                  text: {
                    fontSize: 14,
                    fill: '#374151',
                    fontWeight: 600
                  }
                }
              },
              legends: {
                text: {
                  fontSize: 12,
                  fill: '#6B7280'
                }
              }
            }}
          />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-chart-bar text-gray-300 text-4xl mb-3"></i>
            <p className="text-gray-500">
              {chartType === 'exercise' && !selectedExercise 
                ? 'Select an exercise to view progress'
                : 'No data available for the selected timeframe'
              }
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {filteredWorkouts.length}
            </div>
            <div className="text-sm text-gray-600">Total Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredWorkouts.reduce((sum, w) => sum + w.completedSets, 0)}
            </div>
            <div className="text-sm text-gray-600">Sets Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(filteredWorkouts.reduce((sum, w) => {
                if (w.endTime) {
                  const duration = (new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60)
                  return sum + duration
                }
                return sum
              }, 0))}m
            </div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(() => {
                const totalSets = filteredWorkouts.reduce((sum, w) => sum + w.totalSets, 0)
                const completedSets = filteredWorkouts.reduce((sum, w) => sum + w.completedSets, 0)
                return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
              })()}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressCharts