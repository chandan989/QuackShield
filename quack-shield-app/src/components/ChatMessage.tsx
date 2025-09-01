import React from 'react'
import type { Message } from '../types/models'

interface Props {
  message: Message
  onAppealClick: (id: string) => void
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return `${h}h ago`
}

const Badge: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>{children}</span>
)

const ChatMessage: React.FC<Props> = ({ message, onAppealClick }) => {
  const base = 'p-4 rounded-lg border shadow-sm transition-colors'
  const metaRow = (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-500">@{message.author}</div>
      <div className="text-xs text-slate-400">{formatTimeAgo(message.createdAt)}</div>
    </div>
  )

  if (message.status === 'flagged_by_moderator') {
    return (
      <div className={`${base} border-amber-400 bg-amber-50`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">@{message.author}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{formatTimeAgo(message.createdAt)}</span>
            <Badge className="bg-amber-100 text-amber-800 border border-amber-300">⚠️ Moderator Flag</Badge>
          </div>
        </div>
        <div className="mt-2">{message.text}</div>
        <div className="mt-2 text-amber-700 font-medium">
          {message.reason ? `Reason: ${message.reason}` : 'Flagged by Moderator Agent'}
        </div>
      </div>
    )
  }

  if (message.status === 'verified_by_verifier') {
    return (
      <div className={`${base} border-red-500 bg-red-50`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">@{message.author}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{formatTimeAgo(message.createdAt)}</span>
            <Badge className="bg-red-100 text-red-800 border border-red-300">✅ Verified</Badge>
          </div>
        </div>
        <div className="mt-2 line-through decoration-red-400/70">{message.text}</div>
        <div className="mt-2 text-emerald-700 font-semibold">Malicious Link Removed by QuackNet Framework</div>
        {message.appealStatus === 'pending' ? (
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
            ⏳ Appeal Pending: Awaiting DAO Vote
          </div>
        ) : (
          <div className="mt-3">
            <button
              className="px-3 py-1.5 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 transition-colors"
              onClick={() => onAppealClick(message.id)}
              aria-label="Appeal this moderation decision"
            >
              Appeal Decision
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${base} border-slate-200 bg-white`}>
      {metaRow}
      <div className="mt-2">{message.text}</div>
    </div>
  )
}

export default ChatMessage
