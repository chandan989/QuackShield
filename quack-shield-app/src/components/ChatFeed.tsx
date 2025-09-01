import React from 'react'
import type { Message } from '../types/models'
import ChatMessage from './ChatMessage'

interface Props {
  messages: Message[]
  onAppealClick: (id: string) => void
}

const ChatFeed: React.FC<Props> = ({ messages, onAppealClick }) => {
  return (
    <div className="flex flex-col gap-4 p-3 md:p-4">
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} onAppealClick={onAppealClick} />
      ))}
    </div>
  )
}

export default ChatFeed
