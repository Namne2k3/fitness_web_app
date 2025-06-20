import { Exercise } from "../../../types";

export interface ViewProps {
    exercises: Exercise[];
    onExerciseClick: (exercise: Exercise) => void;
}