# QuackNet Framework — Implementation Plan (Based on plan.md)

Last updated: 2025-09-01 11:15 local

This document translates the high-level sprint outline in plan.md into an actionable implementation plan with architecture, specifications, tasks, acceptance criteria, testing, and risk management to deliver the QuackNet MVP: a multi‑agent framework demo featuring a Moderator Agent and a Verifier Agent working in sequence.

---

## 1) Scope and Objectives

- Build an interactive front-end prototype demonstrating a multi-agent moderation workflow:
  - Moderator Agent flags content according to configurable rules.
  - Verifier Agent validates the flag after a delay and finalizes action.
  - Simulate an on-chain appeal flow post-verification.
- Emphasize framework thinking: agents are modular, rules configurable, and UI reflects agent lifecycles.

Deliverables (MVP):
- A React (Vite + TypeScript) single-page app with TailwindCSS styling
- Components: App, ConfigurationPanel, ChatFeed, ChatMessage, Modal
- Mock data and simulated live chat generator
- Agent orchestration logic (Wizard-of-Oz) with visible state transitions
- Appeal modal and “pending on-chain vote” state
- Minimal docs in README explaining the framework framing

Out of scope (MVP):
- Real blockchain connections and wallets
- Real LLM/ML moderation
- Backend/persistence beyond in-memory state

---

## 2) Tech Stack & Tooling

- Frontend: React 18 + TypeScript via Vite
- Styling: Tailwind CSS + Tailwind Forms
- State: React hooks (useState, useEffect), optional context for app-wide config
- Icons: Heroicons/Emoji
- QA: Vitest + React Testing Library (light coverage)
- Formatting: Prettier; Linting: ESLint (typescript + react hooks)

Rationale: fast iteration for an MVP, strong DX, zero backend to keep scope tight.

---

## 3) Architecture Overview

### 3.1 Component Tree

- App
  - Header: Brand + network badge (DuckChain Testnet simulated)
  - Main (2-column responsive grid)
    - ConfigurationPanel
      - Agent toggles (Moderator, Verifier)
      - Moderation rules checkboxes
    - ChatFeed
      - ChatMessage (repeated)
  - Global Modal (for Appeal)

### 3.2 Data Models (TypeScript)

Message
- id: string
- author: string
- text: string
- createdAt: number
- status: 'normal' | 'flagged_by_moderator' | 'verified_by_verifier'
- reason?: string
- removed?: boolean
- appealStatus?: 'none' | 'pending'

AgentsConfig
- moderatorEnabled: boolean
- verifierEnabled: boolean

RulesConfig
- blockMaliciousLinks: boolean
- flagToxicLanguage: boolean
- blockSpam: boolean (optional extension)

UIState
- isAppealModalOpen: boolean
- selectedMessageId?: string

### 3.3 Agent Orchestration Flow

1) New message arrives (mock feed or user-generated later).
2) If Moderator enabled and rules match -> set status: 'flagged_by_moderator', reason set.
3) After 2–3 seconds, if Verifier enabled -> set status: 'verified_by_verifier', removed = true (simulate action), update UI to show verified box and "Removed" copy.
4) Appeal button available on verified messages => opens modal; confirm triggers appealStatus = 'pending'.

### 3.4 State & Events

- App holds: messages[], agentsConfig, rulesConfig, modal state
- useEffect watches latest message or changes to messages and triggers agent flow
- setInterval in ChatFeed (or App) appends incoming messages
- Event handlers passed down via props (e.g., onAppealClick)

---

## 4) Directory Structure

```
quacknet-app/
  ├─ index.html
  ├─ src/
  │  ├─ main.tsx
  │  ├─ App.tsx
  │  ├─ components/
  │  │  ├─ ConfigurationPanel.tsx
  │  │  ├─ ChatFeed.tsx
  │  │  ├─ ChatMessage.tsx
  │  │  └─ Modal.tsx
  │  ├─ data/
  │  │  └─ mockData.ts
  │  ├─ types/
  │  │  └─ models.ts
  │  ├─ hooks/
  │  │  └─ useLiveFeed.ts (optional)
  │  ├─ styles/
  │  │  └─ index.css (tailwind)
  │  └─ utils/
  │     ├─ rules.ts
  │     └─ agents.ts (moderatorCheck, verifierCheck stubs)
  ├─ tsconfig.json
  ├─ vite.config.ts
  ├─ tailwind.config.js
  ├─ postcss.config.js
  ├─ package.json
  └─ README.md
```

---

## 5) Setup Instructions

- npm create vite@latest quacknet-app -- --template react-ts
- cd quacknet-app
- npm i -D tailwindcss postcss autoprefixer
- npx tailwindcss init -p
- Configure tailwind content in tailwind.config.js to include index.html and src/**/*.{ts,tsx}
- Add Tailwind directives to src/styles/index.css
- Install QA & lint: npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks prettier vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom

---

## 6) Implementation Steps & Acceptance Criteria

### Step A: Project Initialization
Tasks
- Scaffold Vite React-TS project
- Configure Tailwind; basic theme
- Add ESLint/Prettier; basic scripts
Acceptance
- App builds and renders header; Tailwind classes apply

### Step B: Layout & Shell Components
Tasks
- Create two-column responsive layout
- Implement ConfigurationPanel, ChatFeed, ChatMessage placeholders
- Show header "QuackNet Framework" + status badge "Connected to DuckChain Testnet"
Acceptance
- Columns render; components mounted; status badge visible

### Step C: Mock Data & Live Feed Simulation
Tasks
- Create mockData.ts with messages including malicious links and toxic samples
- Implement setInterval to push new messages every 2–5s
Acceptance
- Feed grows over time with varied content

### Step D: Agent Logic (Wizard-of-Oz)
Tasks
- Implement rules.ts with helpers:
  - containsMaliciousLink(text): regex for suspicious domains/URLs
  - containsToxicLanguage(text): simple list-based filter
- Implement agents.ts:
  - moderatorCheck(message, rules)
  - verifierCheck(message)
- useEffect watches for new messages; if moderatorEnabled and rule match -> status flagged; then setTimeout 2–3s -> verifier sets verified + removed
UI
- ChatMessage shows:
  - normal: standard bubble
  - flagged_by_moderator: yellow-bordered box with "⚠️ Flagged by Moderator Agent" and reason
  - verified_by_verifier: red-bordered prominent box with "✅ Verified: Malicious Link Removed by QuackNet Framework"
Acceptance
- Demo a message transitioning from normal -> flagged -> verified with visible UI changes

### Step E: Appeal Simulation
Tasks
- Add Appeal button for verified messages
- Create Modal with confirm/cancel
- On confirm: set appealStatus = 'pending', close modal
UI
- Show "Appeal Pending: Awaiting DAO Vote"
Acceptance
- Modal workflow works; state persists in session

### Step F: Polish & Accessibility
Tasks
- Add hover/focus states; keyboard navigable modal
- Distinguish moderator vs verifier visually and via aria-live announcements
- Small animations for status transitions
Acceptance
- Keyboard can open/close modal; screen readers announce updates

### Step G: Testing & Demo Readiness
Tasks
- Unit tests for rules.ts and agents.ts
- Component tests for ChatMessage rendering by status
- Smoke test that simulates a message lifecycle
- README with feature overview and how to run/demo
Acceptance
- All tests passing; demo steps reproducible

---

## 7) UI/UX Details

- Header: left-aligned title, right-aligned status pill (green dot + "DuckChain Testnet")
- ConfigurationPanel:
  - Section: Active Agents (toggles): Moderator, Verifier
  - Section: Moderation Rules (checkboxes): Block Malicious Links, Flag Toxic Language (and optional Block Spam)
- ChatFeed:
  - Infinite scroll container with newest at bottom; autoscroll on new message unless user scrolled up
- ChatMessage States:
  - Normal: neutral bubble
  - Flagged: yellow border, subtle background, small alert icon, label
  - Verified: red border, stronger background, check icon, "Removed" label, Appeal button
- Modal:
  - Title: Appeal Decision
  - Copy: "Appeal this decision on-chain? This will require a stake of 50 $DUCK."
  - Buttons: Confirm (primary), Cancel (secondary)

Accessibility
- Use semantic roles; ensure color not sole indicator (icons + text)
- Modal traps focus, Esc to close, aria-modal, aria-labelledby
- Live region for message status changes

---

## 8) Rules and Heuristics (MVP)

- Malicious Links: regex detect http(s) URLs, flag known suspicious TLDs (e.g., .ru/.xyz) or keywords (airdrop, claim, verify wallet)
- Toxic Language: array of banned terms for demo
- Spam (optional): repeated messages or excessive emoji/links threshold

These are deterministic and explainable for demo; list-based and simple regexes.

---

## 9) Testing Plan

Unit
- rules.containsMaliciousLink matches suspicious URLs and not benign ones
- rules.containsToxicLanguage flags expected phrases

Component
- ChatMessage renders correct banners for statuses
- ConfigurationPanel toggles update state and disable/enable agent actions

Integration/Smoke
- Simulate arrival of a malicious message -> flagged -> verified -> appeal pending

Non-functional Checks
- Accessibility: modal focus trap, keyboard navigation
- Performance: ensure interval doesn’t leak; clear timers on unmount

---

## 10) Performance, Reliability, Security (MVP)

- Timers: centralize and clean up in useEffect cleanups
- Rendering: memoize ChatMessage where helpful; keys stable by id
- Security: sanitize text content for display, no HTML injection; use rel="noopener noreferrer" for any links (if rendered)
- Rate limiting mock feed to avoid overwhelming UI

---

## 11) Risks & Mitigations

- Timer races and double transitions → Guard by checking current status before mutating
- Over-flagging causing noisy demo → Curate mock data and tune rules
- Accessibility regressions → Add aXe/RTL checks for modal
- Scope creep (wallets, real chain) → Keep simulation only in MVP

---

## 12) Milestones & Timeline (adapted from plan.md)

- Hour 1: Initialize project, Tailwind, basic layout shell
- Hour 2: ConfigurationPanel UI and state wiring
- Hours 3–4: Chat feed, live generator, agent orchestration and UI states
- Hour 5: Appeal modal and state
- Hours 6–7: Polish, accessibility, demo prep and tests
- Hour 8: Record demo, finalize README, submission packaging

---

## 13) Definition of Done (MVP)

- Core flow demonstrable: message appears → moderator flags (yellow) → verifier verifies (red, removed) → appeal pending modal
- Config toggles and rules influence behavior
- Tests pass and instructions to run are clear
- Visual distinction between agent steps is obvious

---

## 14) Commands & Scripts

- Dev: npm run dev
- Build: npm run build
- Test: npm run test
- Lint/Format: npm run lint; npm run format

Add these to package.json scripts accordingly.

---

## 15) Future Enhancements

- Pluggable agent SDK interface with lifecycle hooks and external providers (LLM/ML)
- Real on-chain logging and appeal via wallet integration
- Persistence and moderation dashboards
- Multi-room support and role-based permissions

---

## 16) Mapping Back to plan.md

This plan operationalizes each hour-by-hour item into concrete files, data models, functions, UI states, and acceptance criteria, preserving the two-agent sequence and the on-chain appeal simulation while ensuring testability and demo readiness.
