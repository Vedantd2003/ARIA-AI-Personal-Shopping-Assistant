export interface User {
  id: string
  email: string
  passwordHash: string
  createdAt: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  budgetRange: 'budget' | 'mid' | 'premium' | 'luxury'
  brandBias: string[]
  priorities: string[]
}

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  type: 'text' | 'recommendation' | 'thinking'
  recommendation?: RecommendationData
  timestamp: number
}

export interface RecommendationData {
  primary: Product
  alternatives: AlternativeProduct[]
  summary: string
  hiddenCosts: string[]
  longTermValue: string
}

export interface Product {
  name: string
  price: string
  tagline: string
  pros: string[]
  cons: string[]
  score: number
  whyThis: string
  regretRisk: 'low' | 'medium' | 'high'
  regretReason: string
  imageQuery?: string
}

export interface AlternativeProduct {
  name: string
  price: string
  tagline: string
  pros: string[]
  cons: string[]
  score: number
  whyConsider: string
}

export interface AIResponse {
  type: 'question' | 'recommendation'
  message: string
  progress?: number
  recommendation?: RecommendationData
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: { id: string; email: string }
}

export interface ChatSession {
  messages: ChatMessage[]
  progress: number
  hasRecommendation: boolean
}
