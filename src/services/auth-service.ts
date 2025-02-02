import { comparePassword } from "@/utils/passwordUtils"
import { Users } from "@prisma/client"
import { OAuth2Client } from "google-auth-library"
import { UserInvalidCredentialsError } from "./errors/user-errors"
import { makeApiKeyService } from "./factories/make-api-key-service"
import { makeUsersService } from "./factories/make-users-service"

export class AuthService {
  private googleClient: OAuth2Client

  constructor() {
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.API_URL}/auth/google/callback`,
    )
  }

  async login(email: string, password: string): Promise<{ user: Users }> {

    const usersService = makeUsersService()
    const user = await usersService.findByEmail(email)

    if (!user || !user.password) {
      throw new UserInvalidCredentialsError()
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new UserInvalidCredentialsError()
    }

    return { user }
  }

  async register({ name, email, password, role }: Partial<Users>) {
    const usersService = makeUsersService()
    return await usersService.create({ name: name!, email, password: password || undefined, role })
  }

  async isApiKeyValid(apiKey: string) {
    const apiKeyService = makeApiKeyService()
    const isValid = apiKeyService.getApiKey(apiKey)
    return !!isValid
  }
}
