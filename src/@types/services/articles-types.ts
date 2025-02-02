import {
  previewSelectors,
  postArticleSelectors,
} from "@/constants/services/articles-constants"

export type PreviewSelectors = typeof previewSelectors
export type PostArticleSelectors = typeof postArticleSelectors

export type ScrapArticlePreviewParams = {
  titleSelector: string
  descriptionSelector: string
  dateSelector: string
  articleScrapQuantity: number
  previewKey: string
}

export interface ScrapArticlePreview {
  title: string
  url: string
  description: string
  publicationDate: string
  name: string
}

export type ScrapSourcePostArticleParams = {
  titleSelector: string
  contentSelector: string
}

export interface ScrapSourcePostArticle {
  title: string
  text: string
  source_name: string
  source_url: string
}


