import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WorkoutState {
  completedExercises: string[];
}

const initialState: WorkoutState = {
  completedExercises: [],
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    markExerciseAsCompleted: (state, action: PayloadAction<string>) => {
      if (!state.completedExercises.includes(action.payload)) {
        state.completedExercises.push(action.payload);
      }
    },
    resetExercise: (state, action: PayloadAction<string>) => {
      state.completedExercises = state.completedExercises.filter(
        (id) => id !== action.payload
      );
    },
    resetAll: (state) => {
      state.completedExercises = [];
    },
  },
});

export const { markExerciseAsCompleted, resetExercise, resetAll } =
  workoutSlice.actions;

export const workoutReducer = workoutSlice.reducer;
