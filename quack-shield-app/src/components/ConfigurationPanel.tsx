import React from 'react'
import type { AgentsConfig, RulesConfig } from '../types/models'

interface Props {
  agents: AgentsConfig
  rules: RulesConfig
  onToggleAgent: (key: keyof AgentsConfig) => void
  onToggleRule: (key: keyof RulesConfig) => void
}

const ConfigurationPanel: React.FC<Props> = ({ agents, rules, onToggleAgent, onToggleRule }) => {
  return (
    <aside className="space-y-6 p-4 bg-white/40 backdrop-blur rounded-lg shadow-sm border border-slate-200">
      <section>
        <h2 className="text-lg font-semibold text-slate-800">Active Agents</h2>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              checked={agents.moderatorEnabled}
              onChange={() => onToggleAgent('moderatorEnabled')}
            />
            <span>Moderator Agent</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              checked={agents.verifierEnabled}
              onChange={() => onToggleAgent('verifierEnabled')}
            />
            <span>Verifier Agent</span>
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800">Moderation Rules</h2>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={rules.blockMaliciousLinks}
              onChange={() => onToggleRule('blockMaliciousLinks')}
            />
            <span>Block Malicious Links</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={rules.flagToxicLanguage}
              onChange={() => onToggleRule('flagToxicLanguage')}
            />
            <span>Flag Toxic Language</span>
          </label>
        </div>
      </section>
    </aside>
  )
}

export default ConfigurationPanel
