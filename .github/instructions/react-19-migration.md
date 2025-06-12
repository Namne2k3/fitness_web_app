# 🔄 React 19 Migration Guide

## 📋 Migration Checklist

Khi cập nhật code từ React 18 sang React 19, áp dụng checklist này để đảm bảo sử dụng đầy đủ tính năng mới.

---

## 🎯 Priority Migration Tasks

### 1. 🔄 Form Handling Migration

**BEFORE (React 18):**
```typescript
// ❌ Cách cũ - Nhiều boilerplate code
function WorkoutForm({ onSave }: { onSave: (workout: Workout) => void }) {
  const [formData, setFormData] = useState({ name: '', duration: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    try {
      const workout = await WorkoutService.create(formData);
      onSave(workout);
      setFormData({ name: '', duration: 0 }); // Reset form
    } catch (error) {
      setErrors({ submit: 'Failed to create workout' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />
      <input 
        type="number"
        value={formData.duration}
        onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </button>
      {errors.submit && <div className="error">{errors.submit}</div>}
    </form>
  );
}
```

**AFTER (React 19):**
```typescript
// ✅ Cách mới - Gọn gàng và declarative
import { useActionState } from 'react';

function WorkoutForm({ onSave }: { onSave: (workout: Workout) => void }) {
  const [state, submitAction, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      try {
        const workoutData = {
          name: formData.get('name') as string,
          duration: Number(formData.get('duration'))
        };
        
        const workout = await WorkoutService.create(workoutData);
        onSave(workout);
        return { success: true, error: null };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },
    { success: false, error: null }
  );

  return (
    <form action={submitAction}>
      <input name="name" required />
      <input name="duration" type="number" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
      {state.error && <div className="error">{state.error}</div>}
      {state.success && <div className="success">Workout created!</div>}
    </form>
  );
}
```

### 2. 📊 Data Fetching Migration

**BEFORE (React 18):**
```typescript
// ❌ Cách cũ - useEffect pattern
function ExerciseList({ category }: { category: string }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await ExerciseService.getByCategory(category);
        setExercises(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [category]);

  if (loading) return <div>Loading exercises...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="exercise-list">
      {exercises.map(exercise => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
```

**AFTER (React 19):**
```typescript
// ✅ Cách mới - use() hook với Suspense
import { use, Suspense } from 'react';

function ExerciseList({ category }: { category: string }) {
  const exercises = use(ExerciseService.getByCategory(category));

  return (
    <div className="exercise-list">
      {exercises.map(exercise => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}

// Wrapper component
function ExercisePage({ category }: { category: string }) {
  return (
    <div className="exercise-page">
      <h1>Exercises - {category}</h1>
      <Suspense fallback={<div>Loading exercises...</div>}>
        <ExerciseList category={category} />
      </Suspense>
    </div>
  );
}
```

### 3. 🎯 Optimistic Updates Migration

**BEFORE (React 18):**
```typescript
// ❌ Cách cũ - Manual optimistic updates
function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    // Optimistic update
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    setIsPending(true);

    try {
      await PostService.toggleLike(postId);
    } catch (error) {
      // Revert optimistic update
      setIsLiked(!newLiked);
      setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
      console.error('Failed to like post:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleLike} 
      disabled={isPending}
      className={isLiked ? 'liked' : ''}
    >
      ❤️ {likeCount}
    </button>
  );
}
```

**AFTER (React 19):**
```typescript
// ✅ Cách mới - useOptimistic hook
import { useOptimistic, useTransition } from 'react';

function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, addOptimistic] = useOptimistic(
    { isLiked: initialLiked, count: initialCount },
    (state, action: 'toggle') => ({
      isLiked: !state.isLiked,
      count: state.isLiked ? state.count - 1 : state.count + 1
    })
  );

  const handleLike = () => {
    addOptimistic('toggle');
    
    startTransition(async () => {
      try {
        await PostService.toggleLike(postId);
      } catch (error) {
        console.error('Failed to like post:', error);
        // React tự động revert optimistic update
      }
    });
  };

  return (
    <button 
      onClick={handleLike} 
      disabled={isPending}
      className={optimisticState.isLiked ? 'liked' : ''}
    >
      ❤️ {optimisticState.count}
    </button>
  );
}
```

---

## 🚀 Advanced Migration Patterns

### 4. 🔄 Complex State Management

**BEFORE (React 18):**
```typescript
// ❌ Cách cũ - Phức tạp với useReducer
interface WorkoutState {
  exercises: Exercise[];
  currentExercise: number;
  timer: number;
  isActive: boolean;
  completed: boolean;
}

type WorkoutAction = 
  | { type: 'START_WORKOUT' }
  | { type: 'NEXT_EXERCISE' }
  | { type: 'PAUSE_WORKOUT' }
  | { type: 'COMPLETE_EXERCISE'; exerciseId: string }
  | { type: 'TICK_TIMER' };

function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'START_WORKOUT':
      return { ...state, isActive: true, timer: 0 };
    case 'NEXT_EXERCISE':
      return { 
        ...state, 
        currentExercise: state.currentExercise + 1,
        timer: 0 
      };
    case 'PAUSE_WORKOUT':
      return { ...state, isActive: false };
    case 'TICK_TIMER':
      return { ...state, timer: state.timer + 1 };
    default:
      return state;
  }
}

function WorkoutTimer({ exercises }: { exercises: Exercise[] }) {
  const [state, dispatch] = useReducer(workoutReducer, {
    exercises,
    currentExercise: 0,
    timer: 0,
    isActive: false,
    completed: false
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isActive) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isActive]);

  // More complex logic...
}
```

**AFTER (React 19):**
```typescript
// ✅ Cách mới - Actions cho complex workflows
function WorkoutTimer({ exercises }: { exercises: Exercise[] }) {
  const [state, workoutAction, isPending] = useActionState(
    async (prevState: WorkoutState, action: WorkoutAction) => {
      switch (action.type) {
        case 'START_WORKOUT':
          await WorkoutService.startSession(prevState.sessionId);
          return { ...prevState, isActive: true, startTime: Date.now() };
          
        case 'COMPLETE_EXERCISE':
          await WorkoutService.completeExercise(action.exerciseId);
          return { 
            ...prevState, 
            currentExercise: prevState.currentExercise + 1,
            completedExercises: [...prevState.completedExercises, action.exerciseId]
          };
          
        case 'FINISH_WORKOUT':
          const session = await WorkoutService.finishSession(prevState.sessionId);
          return { ...prevState, completed: true, session };
          
        default:
          return prevState;
      }
    },
    {
      exercises,
      currentExercise: 0,
      isActive: false,
      completed: false,
      completedExercises: [],
      sessionId: crypto.randomUUID()
    }
  );

  // Much simpler component logic
  return (
    <div className="workout-timer">
      <h2>Exercise {state.currentExercise + 1} of {exercises.length}</h2>
      <ExerciseDisplay exercise={exercises[state.currentExercise]} />
      
      {!state.isActive ? (
        <button onClick={() => workoutAction({ type: 'START_WORKOUT' })}>
          Start Workout
        </button>
      ) : (
        <button 
          onClick={() => workoutAction({ 
            type: 'COMPLETE_EXERCISE', 
            exerciseId: exercises[state.currentExercise].id 
          })}
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Complete Exercise'}
        </button>
      )}
    </div>
  );
}
```

### 5. 📱 Real-time Data Migration

**BEFORE (React 18):**
```typescript
// ❌ Cách cũ - Manual WebSocket management
function LiveWorkoutFeed() {
  const [feed, setFeed] = useState<WorkoutPost[]>([]);
  const [connection, setConnection] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001/workout-feed');
    
    ws.onmessage = (event) => {
      const newPost = JSON.parse(event.data);
      setFeed(prev => [newPost, ...prev]);
    };

    ws.onopen = () => {
      setConnection(ws);
    };

    ws.onclose = () => {
      setConnection(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendReaction = async (postId: string, reaction: string) => {
    if (connection) {
      connection.send(JSON.stringify({ 
        type: 'REACTION', 
        postId, 
        reaction 
      }));
    }
  };

  return (
    <div className="live-feed">
      {feed.map(post => (
        <FeedPost 
          key={post.id} 
          post={post} 
          onReaction={sendReaction}
        />
      ))}
    </div>
  );
}
```

**AFTER (React 19):**
```typescript
// ✅ Cách mới - use() với streaming data
import { use } from 'react';

function LiveWorkoutFeed() {
  // use() hook có thể handle streaming data
  const feedStream = use(WorkoutService.getLiveFeedStream());
  
  const [reactions, addReaction] = useOptimistic(
    [],
    (state: Reaction[], newReaction: Reaction) => [...state, newReaction]
  );

  const [_, sendReactionAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      const reaction = {
        postId: formData.get('postId') as string,
        type: formData.get('reactionType') as string,
        userId: formData.get('userId') as string,
        timestamp: Date.now()
      };

      addReaction(reaction);
      
      try {
        await WorkoutService.sendReaction(reaction);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    { success: false }
  );

  return (
    <div className="live-feed">
      <Suspense fallback={<FeedSkeleton />}>
        {feedStream.map(post => (
          <FeedPost 
            key={post.id} 
            post={post} 
            reactions={reactions.filter(r => r.postId === post.id)}
            onReaction={sendReactionAction}
          />
        ))}
      </Suspense>
    </div>
  );
}
```

---

## 🔧 Package.json Updates

### Dependencies to Update:
```json
{
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "@vitejs/plugin-react": "^4.4.0"
  }
}
```

### ESLint Configuration Update:
```javascript
// eslint.config.js
export default [
  {
    rules: {
      // Remove these rules - React 19 handles automatically
      'react-hooks/exhaustive-deps': 'off', // React Compiler handles this
      'react/jsx-no-bind': 'off', // React Compiler optimizes automatically
      
      // Add these for React 19
      'react/prefer-action-state': 'error',
      'react/prefer-use-hook': 'error'
    }
  }
];
```

---

## ✅ Migration Validation Checklist

### Pre-Migration Assessment:
- [ ] Identify all forms using manual useState + event handlers
- [ ] List all useEffect data fetching patterns
- [ ] Find all useMemo/useCallback usage
- [ ] Locate optimistic update implementations
- [ ] Check WebSocket/real-time data handling

### Post-Migration Verification:
- [ ] All forms use Actions (`useActionState`)
- [ ] Data fetching uses `use()` hook with Suspense
- [ ] No unnecessary useMemo/useCallback (let React Compiler handle)
- [ ] Optimistic updates use `useOptimistic`
- [ ] Error boundaries properly catch Action errors
- [ ] Performance improved (check Core Web Vitals)
- [ ] TypeScript types updated for new hooks
- [ ] Tests updated for new patterns

### Performance Validation:
- [ ] Bundle size decreased (React Compiler optimizations)
- [ ] Fewer re-renders (automatic batching)
- [ ] Better UX with Suspense loading states
- [ ] Smoother interactions with optimistic updates

---

**🎯 Migration Goal**: Chuyển từ imperative React patterns sang declarative React 19 patterns để có code cleaner, performance tốt hơn và UX smooth hơn cho Fitness Web App.
