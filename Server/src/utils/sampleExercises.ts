/**
 * 💪 Sample Exercise Data
 * Comprehensive sample exercises theo DATABASE_SCHEMA_COMPLETE.md
 */

import { Exercise } from '../types';

export const sampleExercises: Exercise[] = [
    // ================================
    // 💪 Strength Training Exercises
    // ================================
    {
        name: "Bench Press",
        description: "A fundamental compound exercise that primarily targets the chest, shoulders, and triceps. Performed lying on a bench while pressing a barbell or dumbbells.",
        instructions: [
            "Lie flat on the bench with your feet firmly planted on the ground",
            "Grip the barbell with hands slightly wider than shoulder-width apart",
            "Unrack the bar and position it over your chest with arms extended",
            "Lower the bar slowly to your chest, maintaining control",
            "Press the bar back to the starting position by extending your arms",
            "Keep your core engaged and maintain proper form throughout"
        ],
        category: "strength",
        primaryMuscleGroups: ["chest", "shoulders", "triceps"],
        secondaryMuscleGroups: ["core", "back"],
        equipment: ["barbell", "machine"],
        difficulty: "intermediate",

        // Media
        images: [
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/bench-press-start.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/bench-press-bottom.jpg"
        ],
        videoUrl: "https://res.cloudinary.com/trackme-fitness/video/upload/v1234567890/exercises/bench-press-demo.mp4",
        gifUrl: "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/bench-press-animation.gif",

        // Metrics
        caloriesPerMinute: 8.5,
        averageIntensity: 7,

        // Variations
        variations: [
            {
                name: "Incline Bench Press",
                description: "Performed on an inclined bench to target upper chest",
                difficultyModifier: "variation",
                instructions: [
                    "Set bench to 30-45 degree incline",
                    "Follow same movement pattern as flat bench press",
                    "Focus on upper chest engagement"
                ]
            },
            {
                name: "Dumbbell Bench Press",
                description: "Using dumbbells instead of barbell for greater range of motion",
                difficultyModifier: "variation",
                instructions: [
                    "Hold a dumbbell in each hand",
                    "Lower dumbbells to chest level",
                    "Press dumbbells up and slightly inward"
                ]
            },
            {
                name: "Close-Grip Bench Press",
                description: "Narrow grip variation targeting triceps more",
                difficultyModifier: "harder",
                instructions: [
                    "Grip barbell with hands shoulder-width apart",
                    "Keep elbows closer to body",
                    "Focus on tricep engagement"
                ]
            }
        ],

        // Safety
        precautions: [
            "Always use a spotter when lifting heavy weights",
            "Warm up thoroughly before attempting heavy sets",
            "Don't bounce the bar off your chest",
            "Keep your feet on the ground throughout the movement"
        ],
        contraindications: [
            "Recent shoulder surgery or injury",
            "Severe wrist problems",
            "Chest muscle tears or strains"
        ],

        // Admin
        isApproved: true,
        createdBy: "64a1b2c3d4e5f6789012340a"
    },

    {
        name: "Deadlift",
        description: "The king of all exercises. A compound movement that works the entire posterior chain including hamstrings, glutes, erector spinae, and traps.",
        instructions: [
            "Stand with feet hip-width apart, barbell over mid-foot",
            "Bend down and grip the bar with hands just outside your legs",
            "Keep your chest up, back straight, and core engaged",
            "Drive through your heels to lift the bar off the ground",
            "Keep the bar close to your body as you stand up straight",
            "Lower the bar back to the ground with control, reversing the movement"
        ],
        category: "strength",
        primaryMuscleGroups: ["hamstrings", "glutes", "back"],
        secondaryMuscleGroups: ["core", "forearms"],
        equipment: ["barbell"],
        difficulty: "advanced",

        // Media
        images: [
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/deadlift-setup.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/deadlift-top.jpg"
        ],
        videoUrl: "https://res.cloudinary.com/trackme-fitness/video/upload/v1234567890/exercises/deadlift-form.mp4",
        gifUrl: "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/deadlift-animation.gif",

        // Metrics
        caloriesPerMinute: 12.0,
        averageIntensity: 9,

        // Variations
        variations: [
            {
                name: "Sumo Deadlift",
                description: "Wide stance variation that emphasizes glutes and inner thighs",
                difficultyModifier: "variation",
                instructions: [
                    "Take a wide stance with toes pointed out",
                    "Grip the bar with hands inside your legs",
                    "Keep torso more upright than conventional deadlift"
                ]
            },
            {
                name: "Romanian Deadlift",
                description: "Hip-hinge focused variation targeting hamstrings",
                difficultyModifier: "easier",
                instructions: [
                    "Start standing with bar at hip level",
                    "Hinge at hips, pushing them back",
                    "Lower bar to mid-shin level, keeping legs relatively straight"
                ]
            }
        ],

        // Safety
        precautions: [
            "Master proper form before adding weight",
            "Keep the bar close to your body throughout the movement",
            "Don't round your back - maintain neutral spine",
            "Use proper breathing technique (brace core)"
        ],
        contraindications: [
            "Lower back injuries or herniated discs",
            "Recent spine surgery",
            "Severe hip mobility issues"
        ],

        // Admin
        isApproved: true,
        createdBy: "64a1b2c3d4e5f6789012340a"
    },

    {
        name: "Back Squat",
        description: "A fundamental lower body exercise that targets the quadriceps, glutes, and hamstrings while building overall lower body strength and stability.",
        instructions: [
            "Set up the barbell on your upper back, resting on your trapezius muscles",
            "Step back from the rack and position feet shoulder-width apart",
            "Keep your chest up and core engaged throughout the movement",
            "Initiate the movement by pushing your hips back and bending your knees",
            "Lower until your thighs are parallel to the ground or as deep as mobility allows",
            "Drive through your heels to return to the starting position"
        ],
        category: "strength",
        primaryMuscleGroups: ["quadriceps", "glutes", "hamstrings"],
        secondaryMuscleGroups: ["calves", "core"],
        equipment: ["barbell"],
        difficulty: "intermediate",

        // Media
        images: [
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/squat-top.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/squat-bottom.jpg"
        ],
        videoUrl: "https://res.cloudinary.com/trackme-fitness/video/upload/v1234567890/exercises/squat-technique.mp4",
        gifUrl: "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/squat-animation.gif",

        // Metrics
        caloriesPerMinute: 10.0,
        averageIntensity: 8,

        // Variations
        variations: [
            {
                name: "Front Squat",
                description: "Barbell held in front rack position, emphasizes quads and core",
                difficultyModifier: "harder",
                instructions: [
                    "Hold barbell in front rack position across shoulders",
                    "Keep elbows high and torso upright",
                    "Squat down maintaining upright torso"
                ]
            },
            {
                name: "Goblet Squat",
                description: "Beginner-friendly variation using dumbbell or kettlebell",
                difficultyModifier: "easier",
                instructions: [
                    "Hold dumbbell or kettlebell at chest level",
                    "Squat down keeping weight close to body",
                    "Great for learning proper squat mechanics"
                ]
            }
        ],

        // Safety
        precautions: [
            "Always squat in a rack with safety bars set at appropriate height",
            "Maintain proper knee tracking - don't let knees cave inward",
            "Don't squat deeper than your mobility allows",
            "Keep your heels on the ground throughout the movement"
        ],
        contraindications: [
            "Knee injuries or recent knee surgery",
            "Hip impingement or severe hip mobility issues",
            "Lower back problems that prevent proper positioning"
        ],

        // Admin
        isApproved: true,
        createdBy: "64a1b2c3d4e5f6789012340a"
    },

    // ================================
    // 🏃 Cardio Exercises
    // ================================
    {
        name: "Burpees",
        description: "A full-body explosive exercise that combines a squat, plank, push-up, and jump. Excellent for cardiovascular conditioning and total body strength.",
        instructions: [
            "Start standing with feet shoulder-width apart",
            "Drop into a squat position and place hands on the ground",
            "Jump your feet back into a plank position",
            "Perform a push-up (optional for beginners)",
            "Jump your feet back to squat position",
            "Explosively jump up with arms reaching overhead"
        ],
        category: "cardio",
        primaryMuscleGroups: ["full_body", "cardio"],
        secondaryMuscleGroups: ["core", "shoulders"],
        equipment: ["bodyweight"],
        difficulty: "intermediate",

        // Media
        images: [
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/burpee-start.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/burpee-plank.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/burpee-jump.jpg"
        ],
        videoUrl: "https://res.cloudinary.com/trackme-fitness/video/upload/v1234567890/exercises/burpee-technique.mp4",
        gifUrl: "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/burpee-animation.gif",

        // Metrics
        caloriesPerMinute: 15.0,
        averageIntensity: 9,

        // Variations
        variations: [
            {
                name: "Half Burpee",
                description: "Beginner version without push-up and jump",
                difficultyModifier: "easier",
                instructions: [
                    "Perform squat to plank movement",
                    "Skip the push-up",
                    "Step back to squat instead of jumping",
                    "Stand up instead of jumping"
                ]
            },
            {
                name: "Burpee Box Jump",
                description: "Advanced version with box jump at the end",
                difficultyModifier: "harder",
                instructions: [
                    "Complete standard burpee",
                    "Instead of vertical jump, jump onto a box",
                    "Step down carefully and repeat"
                ]
            }
        ],

        // Safety
        precautions: [
            "Land softly when jumping to protect joints",
            "Maintain proper plank position to protect lower back",
            "Start slowly and build up intensity gradually",
            "Stop if you feel dizzy or overly fatigued"
        ],
        contraindications: [
            "Recent wrist or shoulder injuries",
            "High blood pressure (consult doctor first)",
            "Pregnancy (especially second and third trimester)",
            "Recent back surgery"
        ],

        // Admin
        isApproved: true,
        createdBy: "64a1b2c3d4e5f6789012340a"
    },

    {
        name: "Mountain Climbers",
        description: "A dynamic cardio exercise that targets the core while providing cardiovascular benefits. Mimics the motion of climbing a mountain.",
        instructions: [
            "Start in a high plank position with hands directly under shoulders",
            "Keep your body in a straight line from head to heels",
            "Bring your right knee toward your chest",
            "Quickly switch legs, bringing left knee to chest while extending right leg back",
            "Continue alternating legs at a rapid pace",
            "Maintain plank position throughout the movement"
        ],
        category: "cardio",
        primaryMuscleGroups: ["core", "cardio"],
        secondaryMuscleGroups: ["shoulders"],
        equipment: ["bodyweight"],
        difficulty: "beginner",

        // Media
        images: [
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/mountain-climber-start.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/mountain-climber-knee-up.jpg"
        ],
        videoUrl: "https://res.cloudinary.com/trackme-fitness/video/upload/v1234567890/exercises/mountain-climbers.mp4",
        gifUrl: "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/mountain-climbers-animation.gif",

        // Metrics
        caloriesPerMinute: 12.0,
        averageIntensity: 7,

        // Variations
        variations: [
            {
                name: "Slow Mountain Climbers",
                description: "Controlled pace focusing on form and core engagement",
                difficultyModifier: "easier",
                instructions: [
                    "Perform same movement at slower pace",
                    "Hold each knee-to-chest position for 1-2 seconds",
                    "Focus on maintaining perfect plank form"
                ]
            },
            {
                name: "Cross-Body Mountain Climbers",
                description: "Bring knee toward opposite elbow for oblique engagement",
                difficultyModifier: "variation",
                instructions: [
                    "Start in plank position",
                    "Bring right knee toward left elbow",
                    "Alternate bringing left knee toward right elbow"
                ]
            }
        ],

        // Safety
        precautions: [
            "Keep hips level - don't pike up or sag down",
            "Land lightly on balls of feet",
            "Keep shoulders directly over wrists",
            "Start at a manageable pace and gradually increase speed"
        ],
        contraindications: [
            "Wrist injuries or carpal tunnel syndrome",
            "Recent shoulder surgery",
            "Lower back problems",
            "Pregnancy (after first trimester, modify to incline position)"
        ],

        // Admin
        isApproved: true,
        createdBy: "64a1b2c3d4e5f6789012340a"
    },

    // ================================
    // 🧘 Flexibility/Yoga Exercises
    // ================================
    {
        name: "Downward Facing Dog",
        description: "A foundational yoga pose that stretches the entire back body while building strength in the arms and shoulders. Excellent for improving flexibility and posture.",
        instructions: [
            "Start on hands and knees in tabletop position",
            "Tuck your toes under and lift your hips up and back",
            "Straighten your legs as much as possible",
            "Press your hands firmly into the ground",
            "Create an inverted V-shape with your body",
            "Hold the position while breathing deeply"
        ],
        category: "flexibility",
        primaryMuscleGroups: ["hamstrings", "calves", "shoulders"],
        secondaryMuscleGroups: ["back", "core"],
        equipment: ["bodyweight"],
        difficulty: "beginner",

        // Media
        images: [
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/downward-dog-side.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/downward-dog-alignment.jpg"
        ],
        videoUrl: "https://res.cloudinary.com/trackme-fitness/video/upload/v1234567890/exercises/downward-dog-flow.mp4",
        gifUrl: "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/downward-dog-animation.gif",

        // Metrics
        caloriesPerMinute: 3.0,
        averageIntensity: 4,

        // Variations
        variations: [
            {
                name: "Puppy Pose",
                description: "Gentler variation with forearms on ground",
                difficultyModifier: "easier",
                instructions: [
                    "Start in tabletop position",
                    "Lower forearms to ground",
                    "Push hips back toward heels",
                    "Keep chest low and arms extended"
                ]
            },
            {
                name: "Three-Legged Dog",
                description: "Single leg variation for hip opening",
                difficultyModifier: "variation",
                instructions: [
                    "Start in downward dog",
                    "Lift right leg up and back",
                    "Keep hips square to the ground",
                    "Hold then switch legs"
                ]
            }
        ],

        // Safety
        precautions: [
            "Don't force straight legs if hamstrings are tight",
            "Keep micro-bend in knees if needed",
            "Distribute weight evenly between hands",
            "Come out of pose if you feel dizzy"
        ],
        contraindications: [
            "Carpal tunnel syndrome or wrist injuries",
            "High blood pressure or headaches",
            "Late-stage pregnancy",
            "Recent shoulder surgery"
        ],

        // Admin
        isApproved: true,
        createdBy: "64a1b2c3d4e5f6789012340a"
    },

    // ================================
    // 💪 Core-Specific Exercises
    // ================================
    {
        name: "Plank",
        description: "A fundamental isometric core exercise that builds stability and strength throughout the entire core while engaging the shoulders and legs.",
        instructions: [
            "Start in a push-up position with hands directly under shoulders",
            "Keep your body in a straight line from head to heels",
            "Engage your core by pulling your belly button toward your spine",
            "Keep your glutes tight and avoid sagging hips",
            "Breathe normally while holding the position",
            "Maintain neutral head position, looking down at the ground"
        ],
        category: "strength",
        primaryMuscleGroups: ["core", "abs"],
        secondaryMuscleGroups: ["shoulders", "glutes", "back"],
        equipment: ["bodyweight"],
        difficulty: "beginner",

        // Media
        images: [
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/plank-side-view.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/plank-form-check.jpg"
        ],
        videoUrl: "https://res.cloudinary.com/trackme-fitness/video/upload/v1234567890/exercises/perfect-plank-form.mp4",
        gifUrl: "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/plank-hold-animation.gif",

        // Metrics
        caloriesPerMinute: 5.0,
        averageIntensity: 6,

        // Variations
        variations: [
            {
                name: "Knee Plank",
                description: "Modified version on knees for beginners",
                difficultyModifier: "easier",
                instructions: [
                    "Start in push-up position but lower knees to ground",
                    "Keep straight line from head to knees",
                    "Maintain same core engagement"
                ]
            },
            {
                name: "Single-Arm Plank",
                description: "Advanced variation with one arm extended",
                difficultyModifier: "harder",
                instructions: [
                    "Start in regular plank",
                    "Extend one arm forward",
                    "Hold for time then switch arms"
                ]
            }
        ],

        // Safety
        precautions: [
            "Don't let hips sag or pike up",
            "Keep shoulders directly over wrists",
            "Stop if lower back begins to hurt",
            "Build up hold time gradually"
        ],
        contraindications: [
            "Recent abdominal surgery",
            "Severe lower back problems",
            "Wrist injuries (use forearm variation)",
            "Pregnancy (modify to incline plank)"
        ],

        // Admin
        isApproved: true,
        createdBy: "64a1b2c3d4e5f6789012340a"
    },

    {
        name: "Russian Twists",
        description: "A rotational core exercise that specifically targets the obliques while building rotational strength and stability.",
        instructions: [
            "Sit on the ground with knees bent and feet flat on floor",
            "Lean back slightly to create a V-shape with your torso and thighs",
            "Lift your feet off the ground (optional for advanced)",
            "Clasp your hands together in front of your chest",
            "Rotate your torso to the right, touching your hands to the ground",
            "Rotate to the left side, continuing the twisting motion"
        ],
        category: "strength",
        primaryMuscleGroups: ["obliques", "core"],
        secondaryMuscleGroups: ["shoulders"],
        equipment: ["bodyweight"],
        difficulty: "intermediate",

        // Media
        images: [
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/russian-twist-center.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/russian-twist-side.jpg"
        ],
        videoUrl: "https://res.cloudinary.com/trackme-fitness/video/upload/v1234567890/exercises/russian-twists-demo.mp4",
        gifUrl: "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/russian-twists-animation.gif",

        // Metrics
        caloriesPerMinute: 6.0,
        averageIntensity: 6,

        // Variations
        variations: [
            {
                name: "Feet on Ground Russian Twists",
                description: "Easier version with feet planted on ground",
                difficultyModifier: "easier",
                instructions: [
                    "Keep feet flat on ground throughout",
                    "Focus on controlled rotation",
                    "Reduce range of motion if needed"
                ]
            },
            {
                name: "Weighted Russian Twists",
                description: "Add dumbbell or medicine ball for increased resistance",
                difficultyModifier: "harder",
                instructions: [
                    "Hold weight with both hands",
                    "Maintain same twisting motion",
                    "Control the weight throughout the movement"
                ]
            }
        ],

        // Safety
        precautions: [
            "Keep movement controlled - don't use momentum",
            "Maintain neutral spine throughout the movement",
            "Don't round your back excessively",
            "Keep chest open and shoulders back"
        ],
        contraindications: [
            "Lower back injuries or disc problems",
            "Recent abdominal surgery",
            "Hip flexor injuries",
            "Severe osteoporosis"
        ],

        // Admin
        isApproved: true,
        createdBy: "64a1b2c3d4e5f6789012340a"
    },

    // ================================
    // 🏋️ Functional Movement Exercises
    // ================================
    {
        name: "Turkish Get-Up",
        description: "A complex, full-body functional movement that combines strength, mobility, and stability. Excellent for building total-body coordination and strength.",
        instructions: [
            "Start lying on your back holding a kettlebell in your right hand, arm extended",
            "Bend your right knee and place foot flat on ground",
            "Roll onto your left elbow, then push up to left hand",
            "Lift your hips and sweep your left leg under your body",
            "Come to a kneeling position, then stand up",
            "Reverse the movement to return to starting position"
        ],
        category: "strength",
        primaryMuscleGroups: ["full_body", "shoulders", "core"],
        secondaryMuscleGroups: ["back"],
        equipment: ["kettlebell"],
        difficulty: "advanced",

        // Media
        images: [
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/turkish-getup-start.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/turkish-getup-mid.jpg",
            "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/turkish-getup-stand.jpg"
        ],
        videoUrl: "https://res.cloudinary.com/trackme-fitness/video/upload/v1234567890/exercises/turkish-getup-breakdown.mp4",
        gifUrl: "https://res.cloudinary.com/trackme-fitness/image/upload/v1234567890/exercises/turkish-getup-animation.gif",

        // Metrics
        caloriesPerMinute: 8.0,
        averageIntensity: 8,

        // Variations
        variations: [
            {
                name: "Bodyweight Get-Up",
                description: "Learn the movement pattern without weight",
                difficultyModifier: "easier",
                instructions: [
                    "Perform same movement pattern",
                    "Keep hand pointing up toward ceiling",
                    "Focus on smooth transitions"
                ]
            },
            {
                name: "Half Get-Up",
                description: "Stop at seated position to practice first half",
                difficultyModifier: "easier",
                instructions: [
                    "Complete movement up to seated position",
                    "Hold briefly then return to lying position",
                    "Master this before progressing to full movement"
                ]
            }
        ],

        // Safety
        precautions: [
            "Master the movement pattern without weight first",
            "Keep your eyes on the kettlebell throughout",
            "Move slowly and deliberately - never rush",
            "Use a light weight until technique is perfect"
        ],
        contraindications: [
            "Shoulder impingement or rotator cuff injuries",
            "Wrist injuries",
            "Balance or vestibular disorders",
            "Recent hip or knee surgery"
        ],

        // Admin
        isApproved: true,
        createdBy: "64a1b2c3d4e5f6789012340a"
    }
];

/**
 * 🔧 Utility functions for sample exercises
 */

/**
 * Get exercises by category
 */
export const getExercisesByCategory = (category: 'strength' | 'cardio' | 'flexibility'): Exercise[] => {
    return sampleExercises.filter(exercise => exercise.category === category);
};

/**
 * Get exercises by difficulty
 */
export const getExercisesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Exercise[] => {
    return sampleExercises.filter(exercise => exercise.difficulty === difficulty);
};

/**
 * Get exercises by muscle group
 */
export const getExercisesByMuscleGroup = (muscleGroup: string): Exercise[] => {
    return sampleExercises.filter(exercise =>
        exercise.primaryMuscleGroups.includes(muscleGroup) ||
        exercise.secondaryMuscleGroups?.includes(muscleGroup)
    );
};

/**
 * Get exercises by equipment
 */
export const getExercisesByEquipment = (equipment: string): Exercise[] => {
    return sampleExercises.filter(exercise =>
        exercise.equipment.includes(equipment)
    );
};

/**
 * Get beginner-friendly exercises (no contraindications)
 */
export const getBeginnerSafeExercises = (): Exercise[] => {
    return sampleExercises.filter(exercise =>
        exercise.difficulty === 'beginner' &&
        (!exercise.contraindications || exercise.contraindications.length === 0)
    );
};

/**
 * Search exercises by name or description
 */
export const searchExercises = (query: string): Exercise[] => {
    const searchTerm = query.toLowerCase();
    return sampleExercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm) ||
        exercise.description?.toLowerCase().includes(searchTerm) ||
        exercise.instructions.some(instruction =>
            instruction.toLowerCase().includes(searchTerm)
        )
    );
};
