# 🚀 React 19 Features - Coding Instructions

## 📋 Tổng quan React 19

Khi phát triển ứng dụng Fitness Web App, **luôn ưu tiên sử dụng các tính năng mới của React 19** để tối ưu performance và developer experience.

---

## 🎯 React 19 Core Features

### 1. 🔄 Actions & useActionState

**Sử dụng Actions thay vì thủ công setState cho async operations:**

```typescript
import { useActionState } from 'react';

// ✅ GOOD - Sử dụng Actions cho form submission
function WorkoutForm() {
  const [state, submitAction, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      try {
        const workout = await WorkoutService.createWorkout({
          name: formData.get('name') as string,
          exercises: JSON.parse(formData.get('exercises') as string),
          duration: Number(formData.get('duration')),
        });
        
        return { success: true, workout, error: null };
      } catch (error) {
        return { 
          success: false, 
          workout: null, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },
    { success: false, workout: null, error: null }
  );

  return (
    <form action={submitAction}>
      <input name="name" placeholder="Workout name" required />
      <textarea name="exercises" placeholder="Exercises JSON" required />
      <input name="duration" type="number" placeholder="Duration (mins)" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Workout'}
      </button>
      {state.error && <div className="error">{state.error}</div>}
      {state.success && <div className="success">Workout created!</div>}
    </form>
  );
}

// ❌ BAD - Cách cũ với useState và manual error handling
function OldWorkoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // manual async logic...
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // More boilerplate code...
}
```

### 2. 🔌 use() Hook cho Data Fetching

**Sử dụng use() hook thay vì useEffect cho data fetching:**

```typescript
import { use, Suspense } from 'react';

// ✅ GOOD - Sử dụng use() hook
function WorkoutList({ userId }: { userId: string }) {
  const workouts = use(WorkoutService.getUserWorkouts(userId));
  
  return (
    <div className="workout-list">
      {workouts.map(workout => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}

// Wrap với Suspense
function WorkoutPage() {
  return (
    <Suspense fallback={<WorkoutListSkeleton />}>
      <WorkoutList userId="123" />
    </Suspense>
  );
}

// ✅ GOOD - Service method return Promise
class WorkoutService {
  static async getUserWorkouts(userId: string): Promise<Workout[]> {
    const response = await api.get(`/users/${userId}/workouts`);
    return response.data;
  }
}

// ❌ BAD - Cách cũ với useEffect
function OldWorkoutList({ userId }: { userId: string }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const data = await WorkoutService.getUserWorkouts(userId);
        setWorkouts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkouts();
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  // More boilerplate...
}
```

### 3. 📊 useOptimistic cho Optimistic Updates

**Sử dụng useOptimistic cho better UX trong social features:**

```typescript
import { useOptimistic, useTransition } from 'react';

interface WorkoutLike {
  id: string;
  workoutId: string;
  userId: string;
  isLiked: boolean;
}

function WorkoutCard({ workout, currentUserId }: WorkoutCardProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    workout.likes,
    (state: WorkoutLike[], newLike: WorkoutLike) => {
      const existingIndex = state.findIndex(like => like.userId === newLike.userId);
      
      if (existingIndex >= 0) {
        // Toggle existing like
        return state.map((like, index) => 
          index === existingIndex 
            ? { ...like, isLiked: !like.isLiked }
            : like
        );
      }
      
      // Add new like
      return [...state, newLike];
    }
  );

  const handleLike = () => {
    const optimisticLike: WorkoutLike = {
      id: `temp-${Date.now()}`,
      workoutId: workout.id,
      userId: currentUserId,
      isLiked: true
    };

    addOptimisticLike(optimisticLike);

    startTransition(async () => {
      try {
        await WorkoutService.toggleLike(workout.id, currentUserId);
      } catch (error) {
        console.error('Failed to like workout:', error);
        // React tự động revert optimistic update khi có error
      }
    });
  };

  const userLike = optimisticLikes.find(like => like.userId === currentUserId);
  const isLiked = userLike?.isLiked ?? false;

  return (
    <div className="workout-card">
      <h3>{workout.name}</h3>
      <p>{workout.description}</p>
      
      <button 
        onClick={handleLike}
        disabled={isPending}
        className={`like-btn ${isLiked ? 'liked' : ''}`}
      >
        ❤️ {optimisticLikes.filter(like => like.isLiked).length}
      </button>
    </div>
  );
}
```

### 4. 🎨 React Compiler Optimizations

**Viết code theo cách tối ưu cho React Compiler:**

```typescript
// ✅ GOOD - React Compiler có thể optimize tự động
function ExerciseList({ exercises, onExerciseSelect }: ExerciseListProps) {
  // Không cần useMemo, useCallback thủ công nữa
  const filteredExercises = exercises.filter(exercise => 
    exercise.difficulty === 'beginner'
  );
  
  const handleExerciseClick = (exercise: Exercise) => {
    onExerciseSelect(exercise);
  };

  return (
    <div className="exercise-list">
      {filteredExercises.map(exercise => (
        <ExerciseCard 
          key={exercise.id}
          exercise={exercise}
          onClick={handleExerciseClick}
        />
      ))}
    </div>
  );
}

// ❌ BAD - Không cần thiết với React Compiler
function OldExerciseList({ exercises, onExerciseSelect }: ExerciseListProps) {
  const filteredExercises = useMemo(() => 
    exercises.filter(exercise => exercise.difficulty === 'beginner'),
    [exercises]
  );
  
  const handleExerciseClick = useCallback((exercise: Exercise) => {
    onExerciseSelect(exercise);
  }, [onExerciseSelect]);

  // Redundant optimizations...
}
```

### 5. 🔄 Server Components Integration

**Sử dụng Server Components cho static content:**

```typescript
// ✅ GOOD - Server Component cho static content
// app/exercises/page.tsx (Next.js App Router)
async function ExercisesPage() {
  // Chạy trên server, không bundle vào client
  const exercises = await ExerciseService.getPublicExercises();
  
  return (
    <div className="exercises-page">
      <h1>Exercise Library</h1>
      <div className="exercise-grid">
        {exercises.map(exercise => (
          <ServerExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}

// Client Component cho interactive features
'use client';
function InteractiveExerciseCard({ exercise }: { exercise: Exercise }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    await ExerciseService.toggleBookmark(exercise.id);
  };

  return (
    <div className="exercise-card">
      <h3>{exercise.name}</h3>
      <p>{exercise.description}</p>
      <button onClick={handleBookmark}>
        {isBookmarked ? '🔖' : '📑'} Bookmark
      </button>
    </div>
  );
}
```

---

## 🎯 Form Handling Best Practices

### 1. 📝 Form Actions với Built-in Validation

```typescript
// ✅ GOOD - Sử dụng native form validation với Actions
function UserProfileForm({ user }: { user: User }) {
  const [state, submitAction] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      // Server-side validation
      const validationResult = validateUserProfile({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        age: Number(formData.get('age')),
        weight: Number(formData.get('weight')),
        height: Number(formData.get('height')),
      });

      if (!validationResult.isValid) {
        return {
          success: false,
          errors: validationResult.errors,
          data: null
        };
      }

      try {
        const updatedUser = await UserService.updateProfile(user.id, validationResult.data);
        return {
          success: true,
          errors: {},
          data: updatedUser
        };
      } catch (error) {
        return {
          success: false,
          errors: { submit: 'Failed to update profile' },
          data: null
        };
      }
    },
    { success: false, errors: {}, data: null }
  );

  return (
    <form action={submitAction} className="profile-form">
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input 
          id="name"
          name="name" 
          type="text"
          defaultValue={user.name}
          required
          minLength={2}
          maxLength={50}
        />
        {state.errors.name && (
          <span className="error">{state.errors.name}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input 
          id="email"
          name="email" 
          type="email"
          defaultValue={user.email}
          required
        />
        {state.errors.email && (
          <span className="error">{state.errors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input 
          id="age"
          name="age" 
          type="number"
          defaultValue={user.age}
          min={13}
          max={120}
          required
        />
        {state.errors.age && (
          <span className="error">{state.errors.age}</span>
        )}
      </div>

      <button type="submit" className="submit-btn">
        Update Profile
      </button>

      {state.errors.submit && (
        <div className="error">{state.errors.submit}</div>
      )}
      {state.success && (
        <div className="success">Profile updated successfully!</div>
      )}
    </form>
  );
}
```

### 2. 🔄 Real-time Form Validation

```typescript
// ✅ GOOD - Real-time validation với Actions
function WorkoutCreationForm() {
  const [validationState, validateAction] = useActionState(
    async (prevState: ValidationState, formData: FormData) => {
      const workoutData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        exercises: JSON.parse(formData.get('exercises') as string || '[]'),
        duration: Number(formData.get('duration')),
        difficulty: formData.get('difficulty') as WorkoutDifficulty,
      };

      return validateWorkoutData(workoutData);
    },
    { isValid: true, errors: {} }
  );

  return (
    <form 
      action={validateAction}
      onChange={(e) => {
        // Trigger validation on change
        const form = e.currentTarget;
        const formData = new FormData(form);
        validateAction(formData);
      }}
    >
      <div className="form-group">
        <label htmlFor="name">Workout Name</label>
        <input 
          id="name"
          name="name" 
          type="text"
          required
          minLength={3}
          maxLength={100}
          className={validationState.errors.name ? 'error' : ''}
        />
        {validationState.errors.name && (
          <span className="error-text">{validationState.errors.name}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration (minutes)</label>
        <input 
          id="duration"
          name="duration" 
          type="number"
          min={5}
          max={300}
          required
          className={validationState.errors.duration ? 'error' : ''}
        />
        {validationState.errors.duration && (
          <span className="error-text">{validationState.errors.duration}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="difficulty">Difficulty Level</label>
        <select 
          id="difficulty"
          name="difficulty" 
          required
          className={validationState.errors.difficulty ? 'error' : ''}
        >
          <option value="">Select difficulty</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {validationState.errors.difficulty && (
          <span className="error-text">{validationState.errors.difficulty}</span>
        )}
      </div>

      <button 
        type="submit" 
        disabled={!validationState.isValid}
        className="submit-btn"
      >
        Create Workout
      </button>
    </form>
  );
}
```

---

## 🚀 Performance Optimizations

### 1. ⚡ Automatic Batching

```typescript
// ✅ GOOD - React 19 tự động batch tất cả updates
function ExerciseTimer({ exercise }: { exercise: Exercise }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedReps, setCompletedReps] = useState(0);

  const startTimer = () => {
    // Tất cả updates được batch tự động
    setIsRunning(true);
    setCurrentTime(0);
    setCompletedReps(0);
  };

  const stopTimer = () => {
    // Tất cả updates được batch tự động
    setIsRunning(false);
    setCurrentTime(0);
  };

  // Không cần startTransition cho simple updates
  const incrementRep = () => {
    setCompletedReps(prev => prev + 1);
    
    if (completedReps + 1 >= exercise.targetReps) {
      setIsRunning(false);
    }
  };

  return (
    <div className="exercise-timer">
      <h3>{exercise.name}</h3>
      <div className="timer-display">
        {currentTime}s
      </div>
      <div className="reps-counter">
        {completedReps} / {exercise.targetReps} reps
      </div>
      <button onClick={startTimer} disabled={isRunning}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={incrementRep} disabled={!isRunning}>
        +1 Rep
      </button>
    </div>
  );
}
```

### 2. 🔄 Concurrent Rendering

```typescript
// ✅ GOOD - Sử dụng Suspense cho smooth UX
function WorkoutDashboard() {
  return (
    <div className="workout-dashboard">
      <h1>My Workout Dashboard</h1>
      
      <Suspense fallback={<StatsCardSkeleton />}>
        <WorkoutStats />
      </Suspense>
      
      <Suspense fallback={<RecentWorkoutsSkeleton />}>
        <RecentWorkouts />
      </Suspense>
      
      <Suspense fallback={<ProgressChartSkeleton />}>
        <ProgressChart />
      </Suspense>
    </div>
  );
}

// Heavy computation component
function ProgressChart() {
  const progressData = use(AnalyticsService.getProgressData());
  
  // Heavy chart rendering
  const chartData = useMemo(() => {
    return processChartData(progressData);
  }, [progressData]);

  return (
    <div className="progress-chart">
      <h2>Your Progress</h2>
      <ExpensiveChart data={chartData} />
    </div>
  );
}
```

---

## 🔧 TypeScript Integration

### 1. 📝 Strong Typing cho Actions

```typescript
// ✅ GOOD - Type-safe Actions
interface WorkoutFormState {
  success: boolean;
  workout: Workout | null;
  errors: Record<string, string>;
}

type WorkoutAction = (
  prevState: WorkoutFormState,
  formData: FormData
) => Promise<WorkoutFormState>;

const createWorkoutAction: WorkoutAction = async (prevState, formData) => {
  try {
    const workoutData: CreateWorkoutRequest = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      exercises: JSON.parse(formData.get('exercises') as string),
      duration: Number(formData.get('duration')),
      difficulty: formData.get('difficulty') as WorkoutDifficulty,
      isPublic: formData.get('isPublic') === 'on',
    };

    const validation = validateWorkoutData(workoutData);
    if (!validation.isValid) {
      return {
        success: false,
        workout: null,
        errors: validation.errors,
      };
    }

    const workout = await WorkoutService.createWorkout(workoutData);
    return {
      success: true,
      workout,
      errors: {},
    };
  } catch (error) {
    return {
      success: false,
      workout: null,
      errors: { 
        submit: error instanceof Error ? error.message : 'Unknown error' 
      },
    };
  }
};

// Usage với proper typing
function WorkoutCreationForm() {
  const [state, submitAction, isPending] = useActionState(
    createWorkoutAction,
    { success: false, workout: null, errors: {} }
  );

  // TypeScript hiểu đầy đủ shape của state
  return (
    <form action={submitAction}>
      {/* Form fields */}
      {state.errors.name && <span>{state.errors.name}</span>}
      {state.success && <div>Workout created: {state.workout?.name}</div>}
    </form>
  );
}
```

### 2. 🎯 Generic use() Hook

```typescript
// ✅ GOOD - Generic Promise handling
function DataComponent<T>({ 
  dataPromise, 
  renderData 
}: {
  dataPromise: Promise<T>;
  renderData: (data: T) => React.ReactNode;
}) {
  const data = use(dataPromise);
  
  return (
    <div className="data-component">
      {renderData(data)}
    </div>
  );
}

// Usage
function WorkoutListPage() {
  const workoutsPromise = WorkoutService.getWorkouts();
  
  return (
    <Suspense fallback={<Loading />}>
      <DataComponent 
        dataPromise={workoutsPromise}
        renderData={(workouts: Workout[]) => (
          <div className="workout-list">
            {workouts.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      />
    </Suspense>
  );
}
```

---

## 📱 Mobile Optimization

### 1. 📲 Touch-friendly Actions

```typescript
// ✅ GOOD - Touch-optimized interactions
function TouchWorkoutCard({ workout }: { workout: Workout }) {
  const [gesture, setGesture] = useState<'none' | 'swipe-left' | 'swipe-right'>('none');
  
  const [likeState, likeAction] = useActionState(
    async (prevState: boolean, _: FormData) => {
      try {
        await WorkoutService.toggleLike(workout.id);
        return !prevState;
      } catch (error) {
        return prevState; // Revert on error
      }
    },
    workout.isLiked
  );

  const [bookmarkState, bookmarkAction] = useActionState(
    async (prevState: boolean, _: FormData) => {
      try {
        await WorkoutService.toggleBookmark(workout.id);
        return !prevState;
      } catch (error) {
        return prevState;
      }
    },
    workout.isBookmarked
  );

  return (
    <div 
      className={`workout-card touch-card ${gesture}`}
      onTouchStart={(e) => {
        // Handle touch gestures
      }}
      onTouchEnd={(e) => {
        if (gesture === 'swipe-left') {
          likeAction(new FormData());
        } else if (gesture === 'swipe-right') {
          bookmarkAction(new FormData());
        }
        setGesture('none');
      }}
    >
      <h3>{workout.name}</h3>
      <p>{workout.description}</p>
      
      <div className="card-actions">
        <form action={likeAction} className="inline-form">
          <button 
            type="submit" 
            className={`action-btn like ${likeState ? 'active' : ''}`}
          >
            ❤️ {workout.likes}
          </button>
        </form>
        
        <form action={bookmarkAction} className="inline-form">
          <button 
            type="submit" 
            className={`action-btn bookmark ${bookmarkState ? 'active' : ''}`}
          >
            🔖
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## 🛠️ Development Guidelines

### 1. ⚡ Development Mode Features

```typescript
// ✅ GOOD - Development helpers với React 19
if (process.env.NODE_ENV === 'development') {
  // React 19 có built-in DevTools improvements
  
  // Custom hook for debugging
  function useDevTools<T>(value: T, name: string): T {
    useEffect(() => {
      console.log(`[DevTools] ${name}:`, value);
    }, [value, name]);
    
    return value;
  }
  
  // Workout debugging
  function WorkoutForm() {
    const [state, submitAction] = useActionState(createWorkoutAction, initialState);
    
    // Debug state changes
    const debugState = useDevTools(state, 'WorkoutFormState');
    
    return (
      <form action={submitAction}>
        {/* Form content */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-panel">
            <pre>{JSON.stringify(debugState, null, 2)}</pre>
          </div>
        )}
      </form>
    );
  }
}
```

### 2. 🔍 Error Boundaries với React 19

```typescript
// ✅ GOOD - Modern Error Boundary
class WorkoutErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ComponentType<ErrorInfo> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Workout Error:', error, errorInfo);
    
    // Report to analytics
    AnalyticsService.reportError({
      error: error.message,
      component: 'WorkoutErrorBoundary',
      stack: error.stack,
      ...errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Usage
function WorkoutApp() {
  return (
    <WorkoutErrorBoundary fallback={WorkoutErrorFallback}>
      <Suspense fallback={<WorkoutSkeleton />}>
        <WorkoutDashboard />
      </Suspense>
    </WorkoutErrorBoundary>
  );
}
```

---

## ✅ Checklist cho React 19 Migration

### 🔄 Code Updates
- [ ] Replace `useState` + `useEffect` với `use()` hook cho data fetching
- [ ] Convert form handlers sang Actions với `useActionState`
- [ ] Implement optimistic updates với `useOptimistic`
- [ ] Remove unnecessary `useMemo`/`useCallback` (React Compiler handles this)
- [ ] Add Suspense boundaries cho better loading states
- [ ] Update TypeScript types cho Actions

### 📦 Dependencies
- [ ] Update React và React DOM lên version 19
- [ ] Update TypeScript lên latest version
- [ ] Update @types/react và @types/react-dom
- [ ] Check compatibility của third-party libraries

### 🧪 Testing
- [ ] Update test utilities cho Actions
- [ ] Test Suspense boundaries
- [ ] Test optimistic updates
- [ ] Verify performance improvements

### 📱 User Experience
- [ ] Implement progressive enhancement
- [ ] Add proper loading states
- [ ] Handle offline scenarios
- [ ] Test touch interactions on mobile

---

## 🎯 Performance Targets

### 📊 Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### ⚡ React 19 Specific Metrics
- **Action Response Time**: < 200ms for optimistic updates
- **Suspense Loading**: < 500ms for critical content
- **Form Validation**: Real-time (< 50ms debounce)

### 🚀 Bundle Size Targets
- **Main Bundle**: < 200KB gzipped
- **Component Chunks**: < 50KB gzipped each
- **Critical CSS**: < 20KB inline

---

**🎯 Summary**: Luôn ưu tiên React 19 features để tạo ra ứng dụng fitness hiện đại, performant và user-friendly. Focus vào Actions, use() hook, và optimistic updates để tạo trải nghiệm tốt nhất cho users.
