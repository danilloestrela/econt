import { AuthService } from "../auth-service"

export function makeAuthService() {
  const authService = new AuthService()
  return authService
}
