import React from 'react';
import { Sliders, Cpu, Target, Layers, CheckSquare, ShieldCheck, Database, Code, Shield } from 'lucide-react';
import { GeneratorParams } from '../types';

interface SidebarProps {
  params: GeneratorParams;
  setParams: React.Dispatch<React.SetStateAction<GeneratorParams>>;
  onReSync: () => void;
  isGenerating: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  params,
  setParams,
  onReSync,
  isGenerating
}) => {
  const handleScopeChange = (scope: 'MVP' | 'PRODUCTION') => {
    setParams(prev => ({ ...prev, scope }));
  };

  const handleInclusionToggle = (key: keyof GeneratorParams['inclusions']) => {
    setParams(prev => ({
      ...prev,
      inclusions: {
        ...prev.inclusions,
        [key]: !prev.inclusions[key]
      }
    }));
  };

  return (
    <aside class="fixed left-0 top-16 h-[calc(100vh-64px)] w-[260px] bg-[#131b2e] border-r border-[#464554]/40 flex flex-col p-4 z-40 overflow-y-auto">
      {/* Header */}
      <div class="mb-6 px-1">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-7 h-7 bg-[#8083ff]/20 rounded-lg flex items-center justify-center border border-[#8083ff]/30">
            <Sliders class="w-4 h-4 text-[#c0c1ff]" />
          </div>
          <div>
            <h3 class="font-['JetBrains_Mono'] text-xs font-semibold text-[#c0c1ff] tracking-wide uppercase">
              Spec Customization
            </h3>
            <p class="text-[10px] text-[#908fa0]">Configure Parameters</p>
          </div>
        </div>
      </div>

      {/* Tech Stack Selector */}
      <div class="space-y-4 mb-6">
        <div class="space-y-1.5">
          <label class="font-['JetBrains_Mono'] text-[11px] text-[#908fa0] uppercase tracking-wider block px-1">
            Tech Stack
          </label>
          <div class="relative">
            <select
              value={params.techStack}
              onChange={(e) => setParams(prev => ({ ...prev, techStack: e.target.value }))}
              class="w-full bg-[#171f33] border border-[#464554] rounded-lg px-3 py-2 text-xs text-[#dae2fd] appearance-none focus:border-[#c0c1ff] focus:outline-none cursor-pointer font-['Inter']"
            >
              <option value="Next.js + Supabase">Next.js 14 + Supabase</option>
              <option value="T3 Stack (tRPC, Prisma)">T3 Stack (tRPC, Prisma)</option>
              <option value="FastAPI + PostgreSQL">Python + FastAPI + PostgreSQL</option>
              <option value="Remix + Prisma + Node">Remix + Prisma + PostgreSQL</option>
              <option value="Express + Node + Mongo">Express + Node + MongoDB</option>
            </select>
          </div>
        </div>

        {/* Project Scope Toggle */}
        <div class="space-y-1.5">
          <label class="font-['JetBrains_Mono'] text-[11px] text-[#908fa0] uppercase tracking-wider block px-1">
            Project Scope
          </label>
          <div class="flex bg-[#171f33] p-1 rounded-lg border border-[#464554]">
            <button
              onClick={() => handleScopeChange('MVP')}
              class={`flex-1 py-1.5 rounded font-['JetBrains_Mono'] text-[11px] font-semibold transition-all ${
                params.scope === 'MVP'
                  ? 'bg-[#3e495d] text-[#aeb9d0] shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dae2fd]'
              }`}
            >
              MVP
            </button>
            <button
              onClick={() => handleScopeChange('PRODUCTION')}
              class={`flex-1 py-1.5 rounded font-['JetBrains_Mono'] text-[11px] font-semibold transition-all ${
                params.scope === 'PRODUCTION'
                  ? 'bg-[#3e495d] text-[#aeb9d0] shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dae2fd]'
              }`}
            >
              PRODUCTION
            </button>
          </div>
        </div>

        {/* Inclusions */}
        <div class="space-y-2 border-t border-[#464554]/30 pt-4">
          <label class="font-['JetBrains_Mono'] text-[11px] text-[#908fa0] uppercase tracking-wider block px-1 mb-2">
            Inclusions
          </label>

          <label class="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#171f33] cursor-pointer group transition-colors">
            <span class="text-xs text-[#c7c4d7] group-hover:text-[#dae2fd] flex items-center gap-2">
              <Layers class="w-3.5 h-3.5 text-[#8083ff]" /> Core Features
            </span>
            <input
              type="checkbox"
              checked={params.inclusions.coreFeatures}
              onChange={() => handleInclusionToggle('coreFeatures')}
              class="w-4 h-4 rounded border-[#464554] bg-[#171f33] text-[#8083ff] focus:ring-[#8083ff]"
            />
          </label>

          <label class="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#171f33] cursor-pointer group transition-colors">
            <span class="text-xs text-[#c7c4d7] group-hover:text-[#dae2fd] flex items-center gap-2">
              <Database class="w-3.5 h-3.5 text-[#7bd0ff]" /> DB Schema
            </span>
            <input
              type="checkbox"
              checked={params.inclusions.dbSchema}
              onChange={() => handleInclusionToggle('dbSchema')}
              class="w-4 h-4 rounded border-[#464554] bg-[#171f33] text-[#8083ff] focus:ring-[#8083ff]"
            />
          </label>

          <label class="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#171f33] cursor-pointer group transition-colors">
            <span class="text-xs text-[#c7c4d7] group-hover:text-[#dae2fd] flex items-center gap-2">
              <Code class="w-3.5 h-3.5 text-[#c0c1ff]" /> API Routes
            </span>
            <input
              type="checkbox"
              checked={params.inclusions.apiRoutes}
              onChange={() => handleInclusionToggle('apiRoutes')}
              class="w-4 h-4 rounded border-[#464554] bg-[#171f33] text-[#8083ff] focus:ring-[#8083ff]"
            />
          </label>

          <label class="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#171f33] cursor-pointer group transition-colors">
            <span class="text-xs text-[#c7c4d7] group-hover:text-[#dae2fd] flex items-center gap-2">
              <Shield class="w-3.5 h-3.5 text-[#ffb4ab]" /> Edge Cases
            </span>
            <input
              type="checkbox"
              checked={params.inclusions.edgeCases}
              onChange={() => handleInclusionToggle('edgeCases')}
              class="w-4 h-4 rounded border-[#464554] bg-[#171f33] text-[#8083ff] focus:ring-[#8083ff]"
            />
          </label>
        </div>
      </div>

      {/* Apply / Re-Sync Button */}
      <button
        onClick={onReSync}
        disabled={isGenerating}
        class="w-full bg-[#171f33] hover:bg-[#222a3d] border border-[#464554] text-[#c0c1ff] font-['JetBrains_Mono'] text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-2 mb-4"
      >
        <Cpu class="w-3.5 h-3.5" />
        <span>{isGenerating ? 'Generating...' : 'Re-Sync Spec'}</span>
      </button>

      {/* Verification Badge Footer */}
      <div class="mt-auto pt-4 border-t border-[#464554]/30">
        <div class="bg-[#171f33] p-3 rounded-xl border border-[#8083ff]/20">
          <div class="flex items-center gap-1.5 mb-1">
            <ShieldCheck class="w-4 h-4 text-[#8083ff]" />
            <span class="font-['JetBrains_Mono'] text-[10px] text-[#c0c1ff] uppercase">Verified Output</span>
          </div>
          <p class="text-[11px] text-[#908fa0] leading-snug">
            Generated specs strictly output valid JSON schemas compliant with modern TypeScript & Next.js conventions.
          </p>
        </div>
      </div>
    </aside>
  );
};
