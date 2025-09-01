// Simple deterministic rules for the MVP

export function containsMaliciousLink(text: string): boolean {
  if (!text) return false
  const urlRegex = /(https?:\/\/[^\s]+)/i
  const suspiciousTldRegex = /\.(ru|xyz|top|click|zip|mov)(\b|\/)/i
  const keywordRegex = /(airdrop|verify[ -]?wallet|seed phrase|claim)/i
  const hasUrl = urlRegex.test(text)
  const suspicious = suspiciousTldRegex.test(text) || keywordRegex.test(text)
  return hasUrl && suspicious
}

export function containsToxicLanguage(text: string): boolean {
  if (!text) return false
  const toxicWords = ['idiot', 'stupid', 'dumb', 'trash', 'loser']
  const lower = text.toLowerCase()
  return toxicWords.some((w) => lower.includes(w))
}
