import * as usersErrors from "@/services/errors/user-errors"
import { makeAuthService } from "@/services/factories/make-auth-service"
import { Roles } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.nativeEnum(Roles).optional(),
  })

  const { name, email, password, role } = registerBodySchema.parse(request.body)

  try {
    const authService = makeAuthService()
    const result = await authService.register({ name, email, password, role: role || Roles.user })
    reply.send(result)
  } catch (error) {
    if (error instanceof usersErrors.UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    return error
  }
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { email, password } = registerBodySchema.parse(request.body)

  try {
    const authService = makeAuthService()
    const result = await authService.login(email, password)

    const token = await reply.jwtSign({}, {
      sign: {
        sub: result.user.id,
      },
    })

    const refreshToken = await reply.jwtSign({}, {
      sign: {
        sub: result.user.id,
        expiresIn: '7d',
      },
    })

    reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (error) {
    if (error instanceof usersErrors.UserInvalidCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }
    return error
  }
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign({}, {
    sign: {
      sub: request.user.sub,
    },
  })

  const refreshToken = await reply.jwtSign({}, {
    sign: {
      sub: request.user.sub,
      expiresIn: '7d',
    },
  })

  reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}

// export async function googleLogin(
//   request: FastifyRequest,
//   reply: FastifyReply,
// ) {
//   try {
//     const authService = makeAuthService()
//     const authorizationUrl = await authService.getGoogleAuthUrl()
//     reply.redirect(authorizationUrl)
//   } catch (error) {
//     return error
//   }
// }

// export async function googleCallback(
//   request: FastifyRequest,
//   reply: FastifyReply,
// ) {
//   try {
//     const authService = makeAuthService()
//     const result = await authService.handleGoogleCallback(request)
//     reply.send(result)
//   } catch (error) {
//     return error
//   }
// }
