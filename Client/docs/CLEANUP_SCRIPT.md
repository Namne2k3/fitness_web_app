# 🧹 Cleanup Script for Hybrid Implementation

## Files to Remove After Testing

### Legacy Components
- `src/components/exercise/ExercisePicker.tsx` (replaced by ExercisePickerSimple.tsx)

### Development Files
- `src/pages/workout/create/CreateWorkoutPageRefactored.tsx` (merged into CreateWorkoutPage.tsx)

### Backup Files
- `src/pages/workout/create/CreateWorkoutPage.backup.tsx` (keep for reference, can remove later)

## PowerShell Commands

```powershell
# Remove legacy ExercisePicker
Remove-Item "d:\File\Code\NodeJS Express\MERN APP 2025\Client\src\components\exercise\ExercisePicker.tsx"

# Remove development file
Remove-Item "d:\File\Code\NodeJS Express\MERN APP 2025\Client\src\pages\workout\create\CreateWorkoutPageRefactored.tsx"

# Rename ExercisePickerSimple to ExercisePicker
Move-Item "d:\File\Code\NodeJS Express\MERN APP 2025\Client\src\components\exercise\ExercisePickerSimple.tsx" "d:\File\Code\NodeJS Express\MERN APP 2025\Client\src\components\exercise\ExercisePicker.tsx"
```

## Update Import in CreateWorkoutPage.tsx

Change:
```typescript
import ExercisePicker from '../../../components/exercise/ExercisePickerSimple';
```

To:
```typescript
import ExercisePicker from '../../../components/exercise/ExercisePicker';
```

## Verification Steps

1. ✅ Test workout creation flow
2. ✅ Test exercise addition from ExercisePage
3. ✅ Test ExerciseLibraryModal selection
4. ✅ Test drag & drop reordering
5. ✅ Test form submission
6. ✅ Check for TypeScript errors
7. ✅ Verify responsive design

## Post-Cleanup Validation

Run these commands to ensure everything works:

```bash
# Check for TypeScript errors
npm run type-check

# Run linting
npm run lint

# Start development server
npm run dev
```

---

*Execute cleanup after confirming all functionality works correctly.*
