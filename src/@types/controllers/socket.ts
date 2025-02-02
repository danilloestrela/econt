import { FastifyRequest } from "fastify"
import WebSocketServer from "ws"

export interface SocketConnection {
  connection: WebSocketServer.WebSocket
}

export interface WebSocketConnectionPayload extends SocketConnection {
  payload: any
}

export interface WebsocketConnectionRequest extends SocketConnection {
  request: FastifyRequest
}
