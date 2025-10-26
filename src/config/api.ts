/**
 * Configuração da API MyGym
 *
 * Ajuste a URL abaixo para apontar para o endpoint correto da API MyGym
 */
export const API_CONFIG = {
  BASE_URL: "https://mygym-web-app.vercel.app/api", // Ajuste conforme necessário
  ENDPOINTS: {
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    ACTIVE_WORKOUT: "/workouts/user",
  },
  TIMEOUT: 30000, // 30 segundos
};
