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
    const isAiModerated = message.aiConfidence !== undefined
    
    return (
      <div className={`${base} border-amber-400 bg-amber-50`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">@{message.author}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{formatTimeAgo(message.createdAt)}</span>
            <Badge className={`border ${isAiModerated ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
              {isAiModerated ? '🤖 AI Flag' : '⚠️ Rule Flag'}
            </Badge>
          </div>
        </div>
        <div className="mt-2">{message.text}</div>
        <div className="mt-2 text-amber-700 font-medium">
          {message.reason ? `Reason: ${message.reason}` : 'Flagged by Moderator Agent'}
        </div>
        
        {/* AI Analysis Details */}
        {isAiModerated && (
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between bg-white/70 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-700 font-medium">AI Confidence:</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${message.aiConfidence && message.aiConfidence > 0.8 ? 'bg-red-500' : message.aiConfidence && message.aiConfidence > 0.6 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <span className="font-mono text-xs">{message.aiConfidence ? (message.aiConfidence * 100).toFixed(1) : '0'}%</span>
                </div>
              </div>
              {message.aiRiskLevel && (
                <div className="flex items-center gap-1">
                  <span className="text-blue-700 font-medium">Risk:</span>
                  <Badge className={`text-xs ${
                    message.aiRiskLevel === 'high' ? 'bg-red-100 text-red-700 border-red-300' :
                    message.aiRiskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                    'bg-blue-100 text-blue-700 border-blue-300'
                  }`}>
                    {message.aiRiskLevel}
                  </Badge>
                </div>
              )}
            </div>
            
            {message.aiAnalysis?.reasoning && (
              <div className="bg-white/50 rounded-lg p-2 border-l-2 border-blue-300">
                <div className="text-blue-700 font-medium text-xs mb-1">AI Analysis:</div>
                <div className="text-slate-700 text-xs leading-relaxed">{message.aiAnalysis.reasoning}</div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (message.status === 'verified_by_verifier') {
    const isAiModerated = message.aiConfidence !== undefined
    
    return (
      <div className={`${base} border-red-500 bg-red-50`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">@{message.author}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{formatTimeAgo(message.createdAt)}</span>
            <Badge className={`border border-red-300 ${isAiModerated ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'}`}>
              {isAiModerated ? '🤖✅ AI Verified' : '✅ Verified'}
            </Badge>
          </div>
        </div>
        <div className="mt-2 line-through decoration-red-400/70">{message.text}</div>
        <div className="mt-2 text-emerald-700 font-semibold">
          {isAiModerated ? 'Content Removed by AI-Enhanced QuackNet Framework' : 'Malicious Link Removed by QuackNet Framework'}
        </div>

        {/* AI Analysis Details for Verified Messages */}
        {isAiModerated && (
          <div className="mt-3 space-y-2 text-sm bg-white/60 rounded-lg p-3 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-purple-700 font-medium">Final AI Confidence:</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${message.aiConfidence && message.aiConfidence > 0.8 ? 'bg-red-500' : message.aiConfidence && message.aiConfidence > 0.6 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <span className="font-mono text-xs">{message.aiConfidence ? (message.aiConfidence * 100).toFixed(1) : '0'}%</span>
                </div>
              </div>
              {message.aiRiskLevel && (
                <Badge className={`text-xs ${
                  message.aiRiskLevel === 'high' ? 'bg-red-100 text-red-700 border-red-300' :
                  message.aiRiskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                  'bg-green-100 text-green-700 border-green-300'
                }`}>
                  {message.aiRiskLevel} risk
                </Badge>
              )}
            </div>
            
            {message.aiAnalysis?.reasoning && (
              <div className="bg-white/50 rounded p-2 border-l-2 border-purple-300">
                <div className="text-purple-700 font-medium text-xs mb-1">AI Verification Details:</div>
                <div className="text-slate-700 text-xs leading-relaxed">{message.aiAnalysis.reasoning}</div>
              </div>
            )}
          </div>
        )}

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
