import { app } from "@/app"
import { env } from "@/env"
import { configurePlugins } from "@/plugins"
import { ZodError } from "zod"

async function startServer() {
  try {
    await configurePlugins(app)
    // Retirando API key por enquanto para testes futuros
    // app.addHook("onRequest", apiKeyAuth)

    app.setErrorHandler((error, _, reply) => {
      if (error instanceof ZodError) {
        return reply
          .status(400)
          .send({ message: "Validation error.", issues: error.format() })
      }

      if (env.NODE_ENV !== "production") {
        console.error(error)
      } else {
        // Log to external tool like DataDog/NewRelic/Sentry
      }

      return reply.status(500).send({ message: "Internal Server Error" })
    })

    const port = env.PORT || 3002
    const host = env.HOST || "0.0.0.0"

    await app.listen({ port, host })
    console.log(`🎉 Server listening on ${env.API_URL}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

startServer()
