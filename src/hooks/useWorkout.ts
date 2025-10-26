import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  markExerciseAsCompleted,
  resetExercise,
  resetAll,
} from "../store/workoutSlice";

export const useWorkout = () => {
  const dispatch = useAppDispatch();
  const { completedExercises } = useAppSelector((state) => state.workout);

  const handleMarkExerciseAsCompleted = (exerciseId: string) => {
    dispatch(markExerciseAsCompleted(exerciseId));
  };

  const handleResetExercise = (exerciseId: string) => {
    dispatch(resetExercise(exerciseId));
  };

  const handleResetAll = () => {
    dispatch(resetAll());
  };

  const isExerciseCompleted = (exerciseId: string) => {
    return completedExercises.includes(exerciseId);
  };

  return {
    completedExercises: new Set(completedExercises),
    markExerciseAsCompleted: handleMarkExerciseAsCompleted,
    resetExercise: handleResetExercise,
    isExerciseCompleted,
    resetAll: handleResetAll,
  };
};
