import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService, AuthResponse } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: AuthResponse["user"] | null;
  session: AuthResponse["session"] | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
};

// Async thunk for loading stored user
export const loadStoredUser = createAsyncThunk(
  "auth/loadStoredUser",
  async () => {
    try {
      const userStr = await AsyncStorage.getItem("@auth:user");
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      return null;
    }
  }
);

// Async thunk for signing in
export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await apiService.login({ email, password });
    await AsyncStorage.setItem("@auth:token", response.session.access_token);
    await AsyncStorage.setItem(
      "@auth:session",
      JSON.stringify(response.session)
    );
    await AsyncStorage.setItem("@auth:user", JSON.stringify(response.user));
    return response;
  }
);

// Async thunk for signing out
export const signOut = createAsyncThunk("auth/signOut", async () => {
  await AsyncStorage.removeItem("@auth:token");
  await AsyncStorage.removeItem("@auth:user");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load stored user
      .addCase(loadStoredUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadStoredUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
      })
      .addCase(loadStoredUser.rejected, (state) => {
        state.loading = false;
      })
      // Sign in
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(signIn.rejected, (state) => {
        state.loading = false;
      })
      // Sign out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(signOut.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const authReducer = authSlice.reducer;
