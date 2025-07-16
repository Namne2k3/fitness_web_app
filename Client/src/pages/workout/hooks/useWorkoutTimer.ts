import { useState, useEffect, useCallback, useRef } from 'react';
import { UseWorkoutTimerReturn } from '../types/workoutSession.types';

/**
 * Custom hook for managing workout timer functionality
 */
export const useWorkoutTimer = (): UseWorkoutTimerReturn => {
  // Timer states
  const [totalTime, setTotalTime] = useState(0);
  const [exerciseTime, setExerciseTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);

  // Refs for intervals
  const totalTimerRef = useRef<number | null>(null);
  const exerciseTimerRef = useRef<number | null>(null);
  const restTimerRef = useRef<number | null>(null);

  /**
   * Format time in MM:SS format
   */
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Start the main timer
   */
  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);

    // Start total time counter
    totalTimerRef.current = setInterval(() => {
      setTotalTime(prev => prev + 1);
    }, 1000);

    // Start exercise time counter if not resting
    if (!isResting) {
      exerciseTimerRef.current = setInterval(() => {
        setExerciseTime(prev => prev + 1);
      }, 1000);
    }
  }, [isRunning, isResting]);

  /**
   * Pause the timer
   */
  const pause = useCallback(() => {
    setIsRunning(false);

    // Clear all intervals
    if (totalTimerRef.current) {
      clearInterval(totalTimerRef.current);
      totalTimerRef.current = null;
    }

    if (exerciseTimerRef.current) {
      clearInterval(exerciseTimerRef.current);
      exerciseTimerRef.current = null;
    }

    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      restTimerRef.current = null;
    }
  }, []);

  /**
   * Reset all timers
   */
  const reset = useCallback(() => {
    pause();
    setTotalTime(0);
    setExerciseTime(0);
    setRestTime(0);
    setIsResting(false);
  }, [pause]);

  /**
   * Start rest timer
   */
  const startRest = useCallback((duration: number) => {
    setIsResting(true);
    setRestTime(duration);

    // Clear exercise timer
    if (exerciseTimerRef.current) {
      clearInterval(exerciseTimerRef.current);
      exerciseTimerRef.current = null;
    }

    // Start rest countdown
    restTimerRef.current = setInterval(() => {
      setRestTime(prev => {
        if (prev <= 1) {
          // Rest time finished
          setIsResting(false);
          setRestTime(0);
          
          // Clear rest timer
          if (restTimerRef.current) {
            clearInterval(restTimerRef.current);
            restTimerRef.current = null;
          }

          // Resume exercise timer if main timer is running
          if (isRunning) {
            exerciseTimerRef.current = setInterval(() => {
              setExerciseTime(prev => prev + 1);
            }, 1000);
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isRunning]);

  /**
   * Skip rest timer
   */
  const skipRest = useCallback(() => {
    if (!isResting) return;

    setIsResting(false);
    setRestTime(0);

    // Clear rest timer
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      restTimerRef.current = null;
    }

    // Resume exercise timer if main timer is running
    if (isRunning) {
      exerciseTimerRef.current = setInterval(() => {
        setExerciseTime(prev => prev + 1);
      }, 1000);
    }
  }, [isResting, isRunning]);

  /**
   * Reset exercise timer (when moving to next exercise)
   */
  const resetExerciseTimer = useCallback(() => {
    setExerciseTime(0);
    
    // Clear and restart exercise timer if running and not resting
    if (exerciseTimerRef.current) {
      clearInterval(exerciseTimerRef.current);
      exerciseTimerRef.current = null;
    }

    if (isRunning && !isResting) {
      exerciseTimerRef.current = setInterval(() => {
        setExerciseTime(prev => prev + 1);
      }, 1000);
    }
  }, [isRunning, isResting]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (totalTimerRef.current) {
        clearInterval(totalTimerRef.current);
      }
      if (exerciseTimerRef.current) {
        clearInterval(exerciseTimerRef.current);
      }
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, []);

  /**
   * Handle rest timer completion
   */
  useEffect(() => {
    if (isResting && restTime === 0) {
      setIsResting(false);
    }
  }, [isResting, restTime]);

  // Formatted time strings
  const totalTimeFormatted = formatTime(totalTime);
  const exerciseTimeFormatted = formatTime(exerciseTime);
  const restTimeFormatted = formatTime(restTime);

  return {
    // Time values
    totalTime,
    exerciseTime,
    restTime,

    // States
    isRunning,
    isResting,

    // Actions
    start,
    pause,
    reset,
    startRest,
    skipRest,
    resetExerciseTimer,

    // Formatted time strings
    formatTime,
    totalTimeFormatted,
    exerciseTimeFormatted,
    restTimeFormatted,
  };
};
