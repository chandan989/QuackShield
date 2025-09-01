import type { Message, RulesConfig } from '../types/models'
import { containsMaliciousLink, containsToxicLanguage } from './rules'

export function moderatorCheck(message: Message, rules: RulesConfig): {
  shouldFlag: boolean
  reason?: string
} {
  let reason: string | undefined
  let shouldFlag = false

  if (rules.blockMaliciousLinks && containsMaliciousLink(message.text)) {
    shouldFlag = true
    reason = 'Suspicious link detected'
  }
  if (!shouldFlag && rules.flagToxicLanguage && containsToxicLanguage(message.text)) {
    shouldFlag = true
    reason = 'Toxic language detected'
  }

  return { shouldFlag, reason }
}

export function verifierCheck(message: Message): {
  verified: boolean
  action?: 'remove' | 'none'
} {
  // For MVP, mirror moderator flag: if flagged for link/toxicity, we verify
  if (message.status === 'flagged_by_moderator') {
    return { verified: true, action: 'remove' }
  }
  return { verified: false, action: 'none' }
}
