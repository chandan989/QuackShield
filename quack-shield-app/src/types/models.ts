// Shared TypeScript models for QuackNet MVP

import type { AppealStatus } from './blockchain'

export type MessageStatus = 'normal' | 'flagged_by_moderator' | 'verified_by_verifier'

export interface Message {
  id: string
  author: string
  text: string
  createdAt: number
  status: MessageStatus
  reason?: string
  removed?: boolean
  appealStatus?: AppealStatus
}

export interface AgentsConfig {
  moderatorEnabled: boolean
  verifierEnabled: boolean
}

export interface RulesConfig {
  blockMaliciousLinks: boolean
  flagToxicLanguage: boolean
}

export interface UIState {
  isAppealModalOpen: boolean
  selectedMessageId?: string
}
