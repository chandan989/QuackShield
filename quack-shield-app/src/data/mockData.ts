import type { Message } from '../types/models'

export const initialMessages: Message[] = [
  {
    id: 'm1',
    author: 'alice',
    text: 'Hi everyone! Welcome to QuackNet 🦆',
    createdAt: Date.now() - 1000 * 60 * 5,
    status: 'normal',
  },
  {
    id: 'm2',
    author: 'spamduck',
    text: 'Claim your free airdrop now: http://claim-airdrop.xyz/login',
    createdAt: Date.now() - 1000 * 60 * 4,
    status: 'flagged_by_moderator',
    reason: 'Suspicious link detected',
  },
  {
    id: 'm3',
    author: 'troll',
    text: "You're all getting scammed, lol. Check http://verify-wallet.ru/",
    createdAt: Date.now() - 1000 * 60 * 2,
    status: 'verified_by_verifier',
    reason: 'Malicious link confirmed',
    removed: true,
  },
]

export const liveTexts: string[] = [
  'Anyone going to the launch party tonight?',
  'This is awesome! 🚀',
  'Claim your instant airdrop at https://claim-bonus.xyz — limited time!',
  'Check this cool doc: https://vitejs.dev/guide/ 😄',
  'Verify wallet here to continue: http://verify-wallet.ru',
  'I think this idea is brilliant!'
]
