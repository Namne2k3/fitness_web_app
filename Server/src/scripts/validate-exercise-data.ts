/**
 * Test script to validate that exercise data (including gifUrl) is properly populated
 */

import { WorkoutService } from '../services/WorkoutService';
import { WorkoutRepository } from '../repositories/WorkoutRepository';

export async function validateExerciseDataPopulation() {
    try {
        console.log('🧪 Testing exercise data population...');

        // Test 1: Get workouts with pagination
        console.log('\n📄 Test 1: getWorkouts with pagination');
        const workouts = await WorkoutService.getWorkouts({
            page: 1,
            limit: 5,
            options: { includeExerciseData: true }
        });

        if (workouts.data.length > 0) {
            const firstWorkout = workouts.data[0];
            console.log(`✅ Found ${workouts.data.length} workouts`);
            console.log(`📝 First workout: ${firstWorkout.name}`);
            console.log(`🏋️ Exercises count: ${firstWorkout.exercises.length}`);

            if (firstWorkout.exercises.length > 0) {
                const firstExercise = firstWorkout.exercises[0];
                console.log(`🎯 First exercise ID: ${firstExercise.exerciseId}`);
                console.log(`📊 Has exerciseInfo: ${!!firstExercise.exerciseInfo}`);

                if (firstExercise.exerciseInfo) {
                    console.log(`📛 Exercise name: ${firstExercise.exerciseInfo.name}`);
                    console.log(`🎬 Has gifUrl: ${!!firstExercise.exerciseInfo.gifUrl}`);
                    console.log(`🎬 gifUrl value: ${firstExercise.exerciseInfo.gifUrl || 'NOT SET'}`);
                    console.log(`🖼️ Has images: ${!!firstExercise.exerciseInfo.images}`);
                    console.log(`📹 Has videoUrl: ${!!firstExercise.exerciseInfo.videoUrl}`);
                    console.log(`📝 Description: ${firstExercise.exerciseInfo.description ? 'YES' : 'NO'}`);
                    console.log(`💪 Primary muscles: ${firstExercise.exerciseInfo.primaryMuscleGroups?.join(', ') || 'NONE'}`);
                }
            }
        }

        // Test 2: Get workout by ID
        console.log('\n📖 Test 2: getWorkoutById');
        if (workouts.data.length > 0) {
            const workoutId = workouts.data[0]._id;
            const detailWorkout = await WorkoutService.getWorkoutById(workoutId, {
                includeExerciseData: true,
                includeUserData: true
            });

            if (detailWorkout) {
                console.log(`✅ Retrieved workout: ${detailWorkout.name}`);
                console.log(`🏋️ Exercises count: ${detailWorkout.exercises.length}`);

                if (detailWorkout.exercises.length > 0) {
                    const firstExercise = detailWorkout.exercises[0];
                    console.log(`📊 Has exerciseInfo: ${!!firstExercise.exerciseInfo}`);

                    if (firstExercise.exerciseInfo) {
                        console.log(`🎬 gifUrl: ${firstExercise.exerciseInfo.gifUrl || 'NOT SET'}`);
                    }
                }
            }
        }

        // Test 3: Direct repository test
        console.log('\n🔧 Test 3: Direct repository test');
        const repoWorkouts = await WorkoutRepository.findWorkouts({
            page: 1,
            limit: 2,
            options: { includeExerciseData: true }
        });

        if (repoWorkouts.data.length > 0) {
            const firstWorkout = repoWorkouts.data[0];
            console.log(`✅ Repository found workout: ${firstWorkout.name}`);
            console.log(`🏋️ Has exerciseDetails: ${!!firstWorkout.exerciseDetails}`);

            if (firstWorkout.exerciseDetails && firstWorkout.exerciseDetails.length > 0) {
                const firstDetail = firstWorkout.exerciseDetails[0];
                console.log(`📊 Exercise detail name: ${firstDetail.name}`);
                console.log(`🎬 Exercise detail gifUrl: ${firstDetail.gifUrl || 'NOT SET'}`);
            }
        }

        console.log('\n✅ Exercise data validation completed!');

    } catch (error) {
        console.error('❌ Exercise data validation failed:', error);
        throw error;
    }
}

// Export for use in other files
export default validateExerciseDataPopulation;
