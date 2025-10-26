import React, { createContext, useState, useContext, ReactNode } from "react";

interface WorkoutContextType {
  completedExercises: Set<string>;
  markExerciseAsCompleted: (exerciseId: string) => void;
  resetExercise: (exerciseId: string) => void;
  isExerciseCompleted: (exerciseId: string) => boolean;
  resetAll: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );

  const markExerciseAsCompleted = (exerciseId: string) => {
    setCompletedExercises((prev) => new Set(prev).add(exerciseId));
  };

  const resetExercise = (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      newSet.delete(exerciseId);
      return newSet;
    });
  };

  const isExerciseCompleted = (exerciseId: string) => {
    return completedExercises.has(exerciseId);
  };

  const resetAll = () => {
    setCompletedExercises(new Set());
  };

  return (
    <WorkoutContext.Provider
      value={{
        completedExercises,
        markExerciseAsCompleted,
        resetExercise,
        isExerciseCompleted,
        resetAll,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};
