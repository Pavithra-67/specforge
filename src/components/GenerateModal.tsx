import React, { useState } from 'react';
import { Sparkles, X, Sliders, Layers, Cpu } from 'lucide-react';
import { GeneratorParams } from '../types';

interface GenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, techStack: string, scope: 'MVP' | 'PRODUCTION') => void;
  isGenerating: boolean;
  initialParams: GeneratorParams;
}

export const GenerateModal: React.FC<GenerateModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  initialParams
}) => {
  const [prompt, setPrompt] = useState('');
  const [techStack, setTechStack] = useState(initialParams.techStack);
  const [scope, setScope] = useState<'MVP' | 'PRODUCTION'>(initialParams.scope);

  if (!isOpen) return null;

  const sampleIdeas = [
    'SaaS Billing & Metered Subscription Engine',
    'AI Image Studio with Gemini Flash & Credit Ledger',
    'Habit Tracker with Daily Streaks & Heatmaps',
    'Real-time Collaborative Markdown Workspace with CRDTs',
    'Developer Telemetry & Time-series Log Ingestion Hub'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim(), techStack, scope);
  };

  return (
    <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-[#131b2e] border border-[#464554] rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent Glow */}
        <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#8083ff]/20 blur-3xl pointer-events-none rounded-full"></div>

        {/* Header */}
        <div class="flex justify-between items-start relative z-10">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-[#8083ff]/20 border border-[#8083ff]/30 flex items-center justify-center">
              <Sparkles class="w-4 h-4 text-[#c0c1ff]" />
            </div>
            <div>
              <h3 class="font-['Geist'] text-lg font-bold text-[#dae2fd]">Generate Technical Specification</h3>
              <p class="text-xs text-[#908fa0]">Powered by Gemini 3.6 Flash AI Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            class="text-[#908fa0] hover:text-[#dae2fd] p-1 rounded-lg hover:bg-[#171f33] transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} class="space-y-4 relative z-10">
          <div>
            <label class="block font-['JetBrains_Mono'] text-[11px] text-[#908fa0] uppercase tracking-wider mb-2">
              Describe your application concept in one sentence
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Build a high-throughput SaaS metered billing platform with Stripe webhook handling..."
              rows={3}
              class="w-full bg-[#171f33] border border-[#464554] rounded-xl p-3 text-sm text-[#dae2fd] placeholder-[#908fa0] focus:border-[#8083ff] focus:outline-none font-['Inter'] transition-colors"
            />
          </div>

          {/* Quick Idea Chips */}
          <div class="space-y-1.5">
            <span class="font-['JetBrains_Mono'] text-[10px] text-[#908fa0] uppercase tracking-wider block">
              Quick Preset Prompts:
            </span>
            <div class="flex flex-wrap gap-1.5">
              {sampleIdeas.map((idea, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  class="bg-[#222a3d] hover:bg-[#2d3449] text-[#c7c4d7] text-[11px] px-2.5 py-1 rounded-full border border-[#464554]/40 transition-colors font-['Inter'] text-left"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Parameters Grid */}
          <div class="grid grid-cols-2 gap-4 pt-2 border-t border-[#464554]/30">
            <div>
              <label class="block font-['JetBrains_Mono'] text-[11px] text-[#908fa0] uppercase tracking-wider mb-1">
                Tech Stack
              </label>
              <select
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                class="w-full bg-[#171f33] border border-[#464554] rounded-lg p-2 text-xs text-[#dae2fd] font-['Inter'] focus:outline-none"
              >
                <option value="Next.js + Supabase">Next.js 14 + Supabase</option>
                <option value="T3 Stack (tRPC, Prisma)">T3 Stack (tRPC, Prisma)</option>
                <option value="FastAPI + PostgreSQL">Python + FastAPI + Postgres</option>
                <option value="Remix + Prisma + Node">Remix + Prisma + Node</option>
              </select>
            </div>

            <div>
              <label class="block font-['JetBrains_Mono'] text-[11px] text-[#908fa0] uppercase tracking-wider mb-1">
                Project Scope
              </label>
              <div class="flex bg-[#171f33] p-1 rounded-lg border border-[#464554]">
                <button
                  type="button"
                  onClick={() => setScope('MVP')}
                  class={`flex-1 py-1 rounded font-['JetBrains_Mono'] text-[11px] font-semibold transition-all ${
                    scope === 'MVP' ? 'bg-[#3e495d] text-[#c0c1ff]' : 'text-[#908fa0]'
                  }`}
                >
                  MVP
                </button>
                <button
                  type="button"
                  onClick={() => setScope('PRODUCTION')}
                  class={`flex-1 py-1 rounded font-['JetBrains_Mono'] text-[11px] font-semibold transition-all ${
                    scope === 'PRODUCTION' ? 'bg-[#3e495d] text-[#c0c1ff]' : 'text-[#908fa0]'
                  }`}
                >
                  PRODUCTION
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div class="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              class="px-4 py-2 rounded-xl bg-[#171f33] text-[#908fa0] font-['JetBrains_Mono'] text-xs hover:text-[#dae2fd] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              class="px-5 py-2 rounded-xl bg-[#8083ff] text-[#0d0096] font-['JetBrains_Mono'] text-xs font-semibold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
            >
              <Sparkles class="w-4 h-4" />
              <span>{isGenerating ? 'Generating Spec...' : 'Generate Spec'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
