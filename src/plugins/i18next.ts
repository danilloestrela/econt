import fp from "fastify-plugin"
import i18next from "i18next"
import Backend from "i18next-fs-backend"
import fastifyI18next from "fastify-i18next"
import path from "path"

export default fp(async (app) => {
  // Initialize i18next
  i18next.use(Backend).init({
    fallbackLng: "en",
    preload: ["en", "pt-br"],
    ns: ["en", "pt-br"],
    defaultNS: "common",
    backend: {
      loadPath: path.join(__dirname, "/locales/{{lng}}/{{ns}}.json"),
    },
    detection: {
      order: ["header"],
      caches: false,
    },
  })
  // Register fastify-i18next plugin
  await app.register(fastifyI18next, { i18next })
})
