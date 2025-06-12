# 🏋️ Fitness Web App - Coding Standards & Instructions

## 📋 Yêu cầu Chung

### 🔧 Tech Stack
- **Frontend**: React.js + TypeScript
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **File Storage**: Cloudinary
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

---

## 🎯 Code Quality Standards

### 1. 📝 Comments & Documentation
```typescript
/**
 * Tính toán BMI dựa trên chiều cao và cân nặng
 * @param weight - Cân nặng tính bằng kg
 * @param height - Chiều cao tính bằng mét
 * @returns BMI value với 1 chữ số thập phân
 * @throws Error nếu weight hoặc height <= 0
 */
const calculateBMI = (weight: number, height: number): number => {
  if (weight <= 0 || height <= 0) {
    throw new Error('Weight and height must be positive numbers');
  }
  
  return Math.round((weight / (height * height)) * 10) / 10;
};
```

**Yêu cầu:**
- ✅ Mọi function phải có JSDoc comment
- ✅ Giải thích rõ ràng purpose, parameters, return value
- ✅ Ghi chú các edge cases và exceptions
- ✅ Comment inline cho logic phức tạp

### 2. 🧩 Function Decomposition
```typescript
// ❌ BAD - Function quá phức tạp
const processUserWorkout = (userId: string, workoutData: any) => {
  // 50+ lines of mixed logic
};

// ✅ GOOD - Tách thành các functions nhỏ
const validateWorkoutData = (data: WorkoutData): ValidationResult => {
  // Validation logic only
};

const saveWorkoutToDatabase = async (workout: Workout): Promise<Workout> => {
  // Database save logic only
};

const updateUserStats = async (userId: string, workout: Workout): Promise<void> => {
  // Stats update logic only
};

const processUserWorkout = async (userId: string, workoutData: WorkoutData): Promise<Workout> => {
  const validation = validateWorkoutData(workoutData);
  if (!validation.isValid) throw new Error(validation.message);
  
  const workout = await saveWorkoutToDatabase(workoutData);
  await updateUserStats(userId, workout);
  
  return workout;
};
```

**Yêu cầu:**
- ✅ Một function chỉ làm một việc (Single Responsibility)
- ✅ Tối đa 20 lines per function
- ✅ Tách logic validation, business logic, database operations
- ✅ Function name phải rõ ràng, descriptive

### 3. 🏗️ Architecture Best Practices

#### Backend Structure
```
src/
├── controllers/        # Handle HTTP requests
├── services/          # Business logic
├── models/            # Database schemas
├── middleware/        # Express middleware
├── routes/            # API routes
├── utils/             # Helper functions
├── types/             # TypeScript type definitions
├── config/            # Configuration files
└── tests/             # Test files
```

#### Frontend Structure
```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── services/         # API calls
├── store/            # State management (Redux/Zustand)
├── types/            # TypeScript types
├── utils/            # Helper functions
├── styles/           # Global styles
└── __tests__/        # Test files
```

### 4. 📦 TypeScript Standards

#### Interface Definitions
```typescript
// ✅ Proper interface naming và structure
interface User {
  readonly id: string;
  email: string;
  username: string;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  fitnessGoals: FitnessGoal[];
  experienceLevel: ExperienceLevel;
}

// ✅ Enum definitions
enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

// ✅ Generic types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
```

#### Type Guards
```typescript
/**
 * Kiểm tra xem object có phải là User hợp lệ không
 */
const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as User).id === 'string' &&
    typeof (obj as User).email === 'string'
  );
};
```

---

## 🎨 React Component Standards

> **⚡ React 19 Priority**: Luôn ưu tiên sử dụng React 19 features như Actions, use() hook, và useOptimistic. Xem [React 19 Features Guide](./react-19-features.md) để biết chi tiết.

### 1. Component Structure (React 19 Style)
```typescript
import React, { useActionState, use, Suspense } from 'react';
import { WorkoutService } from '../services/WorkoutService';
import { Workout, WorkoutFormData } from '../types/workout';
import './WorkoutForm.css';

interface WorkoutFormProps {
  userId: string;
  onWorkoutSaved: (workout: Workout) => void;
  initialData?: Partial<WorkoutFormData>;
}

/**
 * Form component để tạo và chỉnh sửa workout với React 19 Actions
 * @param userId - ID của user đang tạo workout
 * @param onWorkoutSaved - Callback khi save workout thành công
 * @param initialData - Data ban đầu để edit workout
 */
const WorkoutForm: React.FC<WorkoutFormProps> = ({
  userId,
  onWorkoutSaved,
  initialData
}) => {
  // ✅ React 19: Sử dụng Actions thay vì manual state management
  const [state, submitAction, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      try {
        const workoutData: WorkoutFormData = {
          name: formData.get('name') as string,
          exercises: JSON.parse(formData.get('exercises') as string),
          duration: Number(formData.get('duration')),
          difficulty: formData.get('difficulty') as WorkoutDifficulty,
        };

        const validation = validateWorkoutData(workoutData);
        if (!validation.isValid) {
          return { success: false, errors: validation.errors, workout: null };
        }

        const workout = await WorkoutService.createWorkout(userId, workoutData);
        onWorkoutSaved(workout);
        return { success: true, errors: {}, workout };
      } catch (error) {
        return { 
          success: false, 
          errors: { submit: 'Failed to save workout' },
          workout: null 
        };
      }
    },
    { success: false, errors: {}, workout: null }  );

  // ✅ React 19: Simple render với built-in form handling
  return (
    <form action={submitAction} className="workout-form">
      <div className="form-group">
        <label htmlFor="name">Workout Name</label>
        <input 
          id="name"
          name="name" 
          type="text"
          defaultValue={initialData?.name}
          required
          minLength={3}
          maxLength={100}
        />
        {state.errors.name && (
          <span className="error">{state.errors.name}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="exercises">Exercises (JSON)</label>
        <textarea 
          id="exercises"
          name="exercises"
          defaultValue={JSON.stringify(initialData?.exercises || [])}
          required
        />
        {state.errors.exercises && (
          <span className="error">{state.errors.exercises}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration (minutes)</label>
        <input 
          id="duration"
          name="duration" 
          type="number"
          defaultValue={initialData?.duration}
          min={5}
          max={300}
          required
        />
        {state.errors.duration && (
          <span className="error">{state.errors.duration}</span>
        )}
      </div>

      <button type="submit" disabled={isPending} className="submit-btn">
        {isPending ? 'Saving...' : 'Save Workout'}
      </button>

      {state.errors.submit && (
        <div className="error">{state.errors.submit}</div>
      )}
      {state.success && (
        <div className="success">Workout saved successfully!</div>
      )}
    </form>
  );
};

// ❌ BAD - Cách cũ với manual state management
const OldWorkoutForm: React.FC<WorkoutFormProps> = ({
  userId,
  onWorkoutSaved,
  initialData
}) => {
  const [formData, setFormData] = useState<WorkoutFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateWorkoutForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const workout = await WorkoutService.createWorkout(userId, formData);
      onWorkoutSaved(workout);
    } catch (error) {
      setErrors({ submit: 'Failed to save workout' });
    } finally {
      setIsLoading(false);
    }
  }, [userId, formData, onWorkoutSaved]);
```

### 2. Data Fetching Pattern (React 19 Style)
```typescript
// ✅ GOOD - Sử dụng use() hook với Suspense
function WorkoutList({ userId }: { userId: string }) {
  // React 19: use() hook thay thế useEffect + useState pattern
  const workouts = use(WorkoutService.getUserWorkouts(userId));
  
  return (
    <div className="workout-list">
      {workouts.map(workout => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}

// Wrapper component với Suspense
function WorkoutPage({ userId }: { userId: string }) {
  return (
    <div className="workout-page">
      <h1>My Workouts</h1>
      <Suspense fallback={<WorkoutListSkeleton />}>
        <WorkoutList userId={userId} />
      </Suspense>
    </div>
  );
}

// ❌ BAD - Cách cũ với useEffect
function OldWorkoutList({ userId }: { userId: string }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await WorkoutService.getUserWorkouts(userId);
        setWorkouts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkouts();
  }, [userId]);
  
  if (loading) return <WorkoutListSkeleton />;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="workout-list">
      {workouts.map(workout => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
```

### 3. Optimistic Updates Pattern
```typescript
// ✅ GOOD - useOptimistic cho social features
function WorkoutCard({ workout, currentUserId }: WorkoutCardProps) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    workout.likes,
    (state: WorkoutLike[], newLike: WorkoutLike) => {
      const existingIndex = state.findIndex(like => like.userId === newLike.userId);
      
      if (existingIndex >= 0) {
        return state.map((like, index) => 
          index === existingIndex 
            ? { ...like, isLiked: !like.isLiked }
            : like
        );
      }
      
      return [...state, newLike];
    }
  );

  const [isPending, startTransition] = useTransition();

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
        // React tự động revert optimistic update
      }
    });
  };

  const userLike = optimisticLikes.find(like => like.userId === currentUserId);
  const isLiked = userLike?.isLiked ?? false;
  const likeCount = optimisticLikes.filter(like => like.isLiked).length;

  return (
    <div className="workout-card">
      <h3>{workout.name}</h3>
      <p>{workout.description}</p>
      
      <button 
        onClick={handleLike}
        disabled={isPending}
        className={`like-btn ${isLiked ? 'liked' : ''}`}
      >
        ❤️ {likeCount}
      </button>
    </div>
  );
}

export default WorkoutForm;
```

### 2. Custom Hooks
```typescript
/**
 * Hook để manage workout data và operations
 */
const useWorkouts = (userId: string) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await WorkoutService.getUserWorkouts(userId);
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch workouts');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const addWorkout = useCallback(async (workoutData: WorkoutFormData) => {
    const newWorkout = await WorkoutService.createWorkout(userId, workoutData);
    setWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  }, [userId]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return {
    workouts,
    isLoading,
    error,
    addWorkout,
    refetch: fetchWorkouts
  };
};
```

---

## 🚀 Backend API Standards

### 1. Controller Pattern
```typescript
import { Request, Response, NextFunction } from 'express';
import { WorkoutService } from '../services/WorkoutService';
import { validateWorkoutData } from '../utils/validation';
import { ApiResponse } from '../types/api';

/**
 * Controller để handle workout-related requests
 */
export class WorkoutController {
  /**
   * Tạo workout mới cho user
   */
  static async createWorkout(
    req: Request,
    res: Response<ApiResponse<Workout>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const workoutData = req.body;

      // Validation
      const validation = validateWorkoutData(workoutData);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: validation.message,
          data: null
        });
        return;
      }

      // Business logic
      const workout = await WorkoutService.createWorkout(userId, workoutData);

      res.status(201).json({
        success: true,
        data: workout,
        message: 'Workout created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### 2. Service Layer
```typescript
/**
 * Service để handle workout business logic
 */
export class WorkoutService {
  /**
   * Tạo workout mới và update user stats
   */
  static async createWorkout(userId: string, workoutData: WorkoutFormData): Promise<Workout> {
    // Validate user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Create workout
    const workout = new WorkoutModel({
      ...workoutData,
      userId,
      createdAt: new Date()
    });

    await workout.save();

    // Update user stats asynchronously
    this.updateUserStatsAsync(userId, workout);

    return workout;
  }

  /**
   * Cập nhật user stats sau khi hoàn thành workout
   */
  private static async updateUserStatsAsync(userId: string, workout: Workout): Promise<void> {
    try {
      await UserStatsService.incrementWorkoutCount(userId);
      await UserStatsService.updateCaloriesBurned(userId, workout.caloriesBurned);
    } catch (error) {
      // Log error but don't throw (async operation)
      console.error('Failed to update user stats:', error);
    }
  }
}
```

### 3. MongoDB Models
```typescript
import mongoose, { Schema, Document } from 'mongoose';

/**
 * Workout document interface
 */
export interface IWorkout extends Document {
  _id: string;
  userId: string;
  name: string;
  exercises: Exercise[];
  duration: number; // minutes
  caloriesBurned: number;
  difficulty: DifficultyLevel;
  tags: string[];
  isSponsored: boolean;
  sponsorData?: SponsorData;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Workout schema definition
 */
const WorkoutSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, default: 0 },
    restTime: { type: Number, default: 60 } // seconds
  }],
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  caloriesBurned: {
    type: Number,
    required: true,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  tags: [{ type: String, trim: true }],
  isSponsored: {
    type: Boolean,
    default: false
  },
  sponsorData: {
    company: String,
    campaign: String,
    rate: Number,
    type: { type: String, enum: ['review', 'guide', 'promotion'] }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
WorkoutSchema.index({ userId: 1, createdAt: -1 });
WorkoutSchema.index({ tags: 1 });
WorkoutSchema.index({ difficulty: 1 });

export const WorkoutModel = mongoose.model<IWorkout>('Workout', WorkoutSchema);
```

---

## 🔒 Security & Error Handling

### 1. Input Validation
```typescript
import joi from 'joi';

/**
 * Validation schema cho workout data
 */
const workoutValidationSchema = joi.object({
  name: joi.string().required().max(100).trim(),
  exercises: joi.array().items(
    joi.object({
      name: joi.string().required().max(50),
      sets: joi.number().integer().min(1).max(20).required(),
      reps: joi.number().integer().min(1).max(100).required(),
      weight: joi.number().min(0).max(1000).default(0),
      restTime: joi.number().integer().min(0).max(600).default(60)
    })
  ).min(1).required(),
  duration: joi.number().integer().min(1).max(480).required(),
  difficulty: joi.string().valid('beginner', 'intermediate', 'advanced').required(),
  tags: joi.array().items(joi.string().max(20)).max(10).default([])
});

/**
 * Validate workout input data
 */
export const validateWorkoutData = (data: unknown): ValidationResult => {
  const { error, value } = workoutValidationSchema.validate(data);
  
  if (error) {
    return {
      isValid: false,
      message: error.details[0].message,
      errors: error.details.reduce((acc, detail) => {
        acc[detail.path.join('.')] = detail.message;
        return acc;
      }, {} as Record<string, string>)
    };
  }

  return { isValid: true, data: value };
};
```

### 2. Error Handling
```typescript
/**
 * Custom error classes
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Log error
  console.error('Error:', error);

  res.status(statusCode).json({
    success: false,
    error: message,
    data: null,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
```

---

## 🧪 Testing Standards

### 1. Unit Tests
```typescript
import { calculateBMI } from '../utils/healthCalculations';

describe('calculateBMI', () => {
  it('should calculate BMI correctly for normal values', () => {
    // Arrange
    const weight = 70; // kg
    const height = 1.75; // meters
    const expectedBMI = 22.9;

    // Act
    const result = calculateBMI(weight, height);

    // Assert
    expect(result).toBe(expectedBMI);
  });

  it('should throw error for invalid weight', () => {
    // Arrange & Act & Assert
    expect(() => calculateBMI(-1, 1.75)).toThrow('Weight and height must be positive numbers');
    expect(() => calculateBMI(0, 1.75)).toThrow('Weight and height must be positive numbers');
  });
});
```

### 2. Integration Tests
```typescript
import request from 'supertest';
import { app } from '../app';
import { connectTestDB, clearTestDB } from '../utils/testDb';

describe('POST /api/workouts', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  it('should create workout successfully', async () => {
    // Arrange
    const workoutData = {
      name: 'Morning Workout',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 15 }
      ],
      duration: 30,
      difficulty: 'beginner'
    };

    // Act
    const response = await request(app)
      .post('/api/workouts')
      .send(workoutData)
      .expect(201);

    // Assert
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(workoutData.name);
  });
});
```

---

## 🎯 Performance Guidelines

> **⚡ React 19 Performance**: React 19 Compiler tự động optimize components. Không cần thủ công useMemo/useCallback nữa! Xem [React 19 Features](./react-19-features.md).

### 1. Database Optimization
```typescript
/**
 * Efficient query với pagination và filtering
 */
const getWorkouts = async (filters: WorkoutFilters): Promise<PaginatedResult<Workout>> => {
  const { page = 1, limit = 10, difficulty, tags, userId } = filters;
  
  // Build query
  const query: any = {};
  if (userId) query.userId = userId;
  if (difficulty) query.difficulty = difficulty;
  if (tags?.length) query.tags = { $in: tags };

  // Execute với pagination
  const [workouts, total] = await Promise.all([
    WorkoutModel.find(query)
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(), // Use lean() for read-only operations
    WorkoutModel.countDocuments(query)
  ]);

  return {
    data: workouts,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};
```

### 2. React 19 Performance (Automatic Optimization)
```typescript
// ✅ GOOD - React 19 Compiler tự động optimize
function WorkoutList({ workouts, onWorkoutSelect }: WorkoutListProps) {
  // Không cần useMemo - React Compiler handles this
  const filteredWorkouts = workouts.filter(workout => 
    workout.difficulty === 'beginner'
  );
  
  // Không cần useCallback - React Compiler handles this
  const handleWorkoutClick = (workout: Workout) => {
    onWorkoutSelect(workout);
  };

  return (
    <div className="workout-list">
      {filteredWorkouts.map(workout => (
        <WorkoutCard 
          key={workout.id}
          workout={workout}
          onClick={handleWorkoutClick}
        />
      ))}
    </div>
  );
}

// ❌ BAD - Không cần thiết với React 19
function OldWorkoutList({ workouts, onWorkoutSelect }: WorkoutListProps) {
  // Redundant với React Compiler
  const filteredWorkouts = useMemo(() => 
    workouts.filter(workout => workout.difficulty === 'beginner'),
    [workouts]
  );
  
  // Redundant với React Compiler
  const handleWorkoutClick = useCallback((workout: Workout) => {
    onWorkoutSelect(workout);
  }, [onWorkoutSelect]);

  return (
    <div className="workout-list">
      {filteredWorkouts.map(workout => (
        <WorkoutCard 
          key={workout.id}
          workout={workout}
          onClick={handleWorkoutClick}
        />
      ))}
    </div>
  );
}
```

### 3. Concurrent Rendering với Suspense
```typescript
// ✅ GOOD - Concurrent rendering cho smooth UX
function WorkoutDashboard() {
  return (
    <div className="workout-dashboard">
      <h1>Fitness Dashboard</h1>
      
      {/* Parallel data loading với Suspense */}
      <div className="dashboard-grid">
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
    </div>
  );
}

// Heavy computation component
function ProgressChart() {
  const progressData = use(AnalyticsService.getProgressData());
  
  // React Compiler optimizes này tự động
  const chartData = processChartData(progressData);

  return (
    <div className="progress-chart">
      <h2>Your Progress</h2>
      <ExpensiveChart data={chartData} />
    </div>
  );
}

const WorkoutList: React.FC<WorkoutListProps> = memo(({ workouts, onWorkoutSelect }) => {
  // Memoize expensive calculations
  const sortedWorkouts = useMemo(() => {
    return workouts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [workouts]);

  // Memoize callbacks
  const handleWorkoutClick = useCallback((workout: Workout) => {
    onWorkoutSelect(workout);
  }, [onWorkoutSelect]);

  return (
    <div className="workout-list">
      {sortedWorkouts.map(workout => (
        <WorkoutItem 
          key={workout._id} 
          workout={workout} 
          onClick={handleWorkoutClick}
        />
      ))}
    </div>
  );
});
```

---

## 📋 Code Review Checklist

### ✅ Before Submitting PR:
- [ ] Tất cả functions có JSDoc comments
- [ ] TypeScript types được define đầy đủ
- [ ] Error handling được implement
- [ ] Input validation được thực hiện
- [ ] Tests được viết và pass
- [ ] No console.log statements (dùng proper logging)
- [ ] Performance considerations (pagination, memoization)
- [ ] Security checks (authentication, authorization)
- [ ] Database queries được optimize
- [ ] Code formatting với Prettier
- [ ] ESLint rules được tuân thủ

### 🔍 Review Points:
- [ ] Code readability và maintainability
- [ ] Architecture patterns được follow
- [ ] Single Responsibility Principle
- [ ] DRY (Don't Repeat Yourself)
- [ ] SOLID principles
- [ ] Error boundaries trong React
- [ ] Memory leaks prevention
- [ ] Accessibility standards (a11y)

---

## 🛠️ Development Workflow

### 1. Git Workflow
```bash
# Feature development
git checkout -b feature/sponsored-content-system
git add .
git commit -m "feat: implement sponsored content creation API

- Add SponsoredContent model with validation
- Create CRUD endpoints for sponsored content
- Implement content approval workflow
- Add rate limiting for content creation"

# Code review & merge
git push origin feature/sponsored-content-system
# Create PR, review, merge to main
```

### 2. Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 3. Environment Setup
```typescript
// .env.example
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-app
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 📚 Resources & Tools

### Essential VSCode Extensions:
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (API testing)
- MongoDB for VS Code

### Recommended Libraries:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.3",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "joi": "^17.9.1",
    "cloudinary": "^1.37.3",
    "cors": "^2.8.5",
    "helmet": "^6.1.5",
    "rate-limiter-flexible": "^2.4.1"
  },
  "devDependencies": {
    "@types/node": "^18.15.11",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.1",
    "typescript": "^5.0.4",
    "jest": "^29.5.0",
    "supertest": "^6.3.3",
    "eslint": "^8.39.0",
    "prettier": "^2.8.8"
  }
}
```

---

*🎯 Mục tiêu: Xây dựng codebase chất lượng cao, maintainable và scalable cho Fitness Web App với focus vào Sponsored Content monetization.*
