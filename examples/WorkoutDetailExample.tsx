import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Bookmark, Share2, Eye, Clock, Dumbbell, ArrowLeft, Play, Target, Zap, Users } from "lucide-react"

// Mock workout detail data
const mockWorkout = {
    _id: "1",
    name: "Full Body HIIT Blast",
    description:
        "High-intensity interval training targeting all major muscle groups for maximum calorie burn. This workout combines strength and cardio movements to give you the most effective workout in minimal time.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    category: "hiit",
    difficulty: "intermediate",
    estimatedDuration: 30,
    tags: ["hiit", "full-body", "cardio", "fat-burn"],
    isPublic: true,
    likeCount: 245,
    saveCount: 89,
    views: 1250,
    shares: 34,
    averageRating: 4.8,
    totalRatings: 156,
    muscleGroups: ["full_body", "core", "cardio"],
    equipment: ["bodyweight", "dumbbells"],
    caloriesBurned: 350,
    exerciseCount: 8,
    totalEstimatedTime: 35,
    userId: {
        username: "fitnessguru",
        profile: { firstName: "Sarah", lastName: "Johnson" },
        avatar: "/placeholder.svg?height=40&width=40",
    },
    exercises: [
        {
            exerciseId: "ex1",
            order: 1,
            sets: 3,
            reps: 15,
            restTime: 45,
            notes: "Focus on form over speed",
            exercise: {
                name: "Burpees",
                description: "Full body explosive movement",
                primaryMuscleGroups: ["full_body", "cardio"],
            },
        },
        {
            exerciseId: "ex2",
            order: 2,
            sets: 3,
            reps: 12,
            weight: 15,
            restTime: 60,
            exercise: {
                name: "Dumbbell Thrusters",
                description: "Squat to overhead press combination",
                primaryMuscleGroups: ["shoulders", "quadriceps", "core"],
            },
        },
        {
            exerciseId: "ex3",
            order: 3,
            sets: 4,
            duration: 30,
            restTime: 30,
            exercise: {
                name: "Mountain Climbers",
                description: "High-intensity core and cardio exercise",
                primaryMuscleGroups: ["core", "cardio"],
            },
        },
        {
            exerciseId: "ex4",
            order: 4,
            sets: 3,
            reps: 10,
            restTime: 45,
            exercise: {
                name: "Jump Squats",
                description: "Explosive lower body movement",
                primaryMuscleGroups: ["quadriceps", "glutes"],
            },
        },
    ],
}

export default function WorkoutDetailPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 py-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/workouts">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Workouts
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Image */}
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            <img
                                src={mockWorkout.thumbnail || "/placeholder.svg"}
                                alt={mockWorkout.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Workout Info */}
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockWorkout.name}</h1>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge
                                            variant={
                                                mockWorkout.difficulty === "beginner"
                                                    ? "secondary"
                                                    : mockWorkout.difficulty === "intermediate"
                                                        ? "default"
                                                        : "destructive"
                                            }
                                        >
                                            {mockWorkout.difficulty}
                                        </Badge>
                                        <Badge variant="outline">{mockWorkout.category}</Badge>
                                        {mockWorkout.tags.slice(0, 2).map((tag) => (
                                            <Badge key={tag} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        <Heart className="h-4 w-4 mr-1" />
                                        {mockWorkout.likeCount}
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Bookmark className="h-4 w-4 mr-1" />
                                        {mockWorkout.saveCount}
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Share2 className="h-4 w-4 mr-1" />
                                        Share
                                    </Button>
                                </div>
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed mb-6">{mockWorkout.description}</p>

                            {/* Creator Info */}
                            <div className="flex items-center gap-3 mb-6">
                                <Avatar>
                                    <AvatarImage src={mockWorkout.userId.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>
                                        {mockWorkout.userId.profile.firstName[0]}
                                        {mockWorkout.userId.profile.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">
                                        {mockWorkout.userId.profile.firstName} {mockWorkout.userId.profile.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">@{mockWorkout.userId.username}</p>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Exercise List */}
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Exercises ({mockWorkout.exerciseCount})</h2>
                                <div className="space-y-4">
                                    {mockWorkout.exercises.map((exercise, index) => (
                                        <Card key={exercise.exerciseId}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                                {exercise.order}
                                                            </div>
                                                            <h3 className="text-lg font-semibold">{exercise.exercise.name}</h3>
                                                        </div>
                                                        <p className="text-gray-600 mb-3">{exercise.exercise.description}</p>

                                                        <div className="flex flex-wrap gap-4 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <Target className="h-4 w-4 text-indigo-600" />
                                                                <span>{exercise.sets} sets</span>
                                                            </div>
                                                            {exercise.reps && (
                                                                <div className="flex items-center gap-1">
                                                                    <Zap className="h-4 w-4 text-green-600" />
                                                                    <span>{exercise.reps} reps</span>
                                                                </div>
                                                            )}
                                                            {exercise.duration && (
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-4 w-4 text-blue-600" />
                                                                    <span>{exercise.duration}s</span>
                                                                </div>
                                                            )}
                                                            {exercise.weight && (
                                                                <div className="flex items-center gap-1">
                                                                    <Dumbbell className="h-4 w-4 text-purple-600" />
                                                                    <span>{exercise.weight}kg</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4 text-orange-600" />
                                                                <span>{exercise.restTime}s rest</span>
                                                            </div>
                                                        </div>

                                                        {exercise.notes && (
                                                            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                                                <strong>Note:</strong> {exercise.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/exercises/${exercise.exerciseId}`}>View Details</Link>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Start Workout */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ready to Start?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full mb-4" size="lg">
                                    <Play className="h-5 w-5 mr-2" />
                                    Start Workout
                                </Button>
                                <div className="text-sm text-gray-600 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Duration:</span>
                                        <span className="font-medium">{mockWorkout.estimatedDuration} min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Calories:</span>
                                        <span className="font-medium">{mockWorkout.caloriesBurned} kcal</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Exercises:</span>
                                        <span className="font-medium">{mockWorkout.exerciseCount}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Workout Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">Views</span>
                                    </div>
                                    <span className="font-medium">{mockWorkout.views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-red-500" />
                                        <span className="text-sm">Likes</span>
                                    </div>
                                    <span className="font-medium">{mockWorkout.likeCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bookmark className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">Saves</span>
                                    </div>
                                    <span className="font-medium">{mockWorkout.saveCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Rating</span>
                                    </div>
                                    <span className="font-medium">
                                        ★ {mockWorkout.averageRating} ({mockWorkout.totalRatings})
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Equipment Needed */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Equipment Needed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {mockWorkout.equipment.map((item) => (
                                        <Badge key={item} variant="outline">
                                            {item.replace("_", " ")}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Muscle Groups */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Muscle Groups</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {mockWorkout.muscleGroups.map((muscle) => (
                                        <Badge key={muscle} variant="secondary">
                                            {muscle.replace("_", " ")}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
