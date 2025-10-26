import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../config/api";

const API_URL = API_CONFIG.BASE_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  session: {
    access_token: string;
    expires_at: number;
    expires_in: number;
    refresh_token: string;
    token_type: string;
  };
  supabaseUser: {
    email: string;
    id: string;
  };
  user: {
    active: boolean;
    admin: boolean;
    email: string;
    id: string;
    name: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Equipment {
  id: string;
  name: string;
}

export interface WorkoutDetail {
  id: string;
  repetitions: number;
  series: number;
  description: string;
  details: string;
  rest: number;
  workoutSubdivision: number;
  exercise: Exercise;
}

export interface WorkoutUser {
  id: string;
  name: string;
  email: string;
}

interface WorkoutRootObject {
  success: boolean;
  data: ActiveWorkout;
}

export interface ActiveWorkout {
  id: string;
  name: string;
  subdivisions: number;
  created_at: string;
  organizedSubdivisions: OrganizedSubdivision[];
}

interface OrganizedSubdivision {
  subdivision: number;
  muscleGroups: MuscleGroup2[];
}

interface MuscleGroup2 {
  name: string;
  exercises: Exercise2[];
}

interface Exercise2 {
  id: string;
  repetitions: number;
  series: number;
  description: string;
  details: string;
  rest: number;
  exercise: Exercise;
}

interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: MuscleGroup;
}

interface MuscleGroup {
  id: string;
  name: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro de conexão com o servidor");
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.FORGOT_PASSWORD}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erro ao solicitar recuperação de senha"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro de conexão com o servidor");
    }
  }

  async getActiveWorkout(): Promise<ActiveWorkout> {
    try {
      const token = await AsyncStorage.getItem("@auth:token");
      console.log("token", token);

      const user = JSON.parse(
        (await AsyncStorage.getItem("@auth:user")) || "{}"
      );

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.ACTIVE_WORKOUT}/${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = await response.json();
      console.log("data", data);
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar treino ativo");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro de conexão com o servidor");
    }
  }
}

export const apiService = new ApiService();
