import websocket from "@fastify/websocket"
import fp from "fastify-plugin"

export default fp(async (app) => {
  await app.register(websocket)
})
