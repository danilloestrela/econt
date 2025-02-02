import { WebSocketConnectionPayload } from "./socket";

export interface SourceArticlePreviewsPayload extends WebSocketConnectionPayload {
  payload: {
    page: number
    pageSize: number
  }
}
