import React, { useState } from 'react';
import { Bolt, Sparkles, Search, User, FileText, LayoutGrid, Terminal } from 'lucide-react';

interface TopNavBarProps {
  onOpenGenerate: () => void;
  onSelectPreset: (presetKey: string) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  hasApiKey: boolean;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  onOpenGenerate,
  onSelectPreset,
  currentTab,
  setCurrentTab,
  hasApiKey
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#0b1326]/90 backdrop-blur-md border-b border-[#464554]/40 h-16">
      <div class="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between gap-6">
        {/* Brand & Main Nav */}
        <div class="flex items-center gap-6 shrink-0">
          <div class="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('features')}>
            <div class="bg-[#8083ff]/20 p-1.5 rounded-lg border border-[#8083ff]/40 flex items-center justify-center">
              <Bolt class="w-5 h-5 text-[#c0c1ff]" />
            </div>
            <span class="font-['Geist'] text-xl font-bold tracking-tight text-[#c0c1ff]">SpecForge</span>
          </div>

          <nav class="hidden md:flex items-center gap-1 ml-4 h-full">
            <button
              onClick={() => setCurrentTab('features')}
              class={`px-3 py-1.5 rounded-md font-['Inter'] text-sm transition-all ${
                currentTab === 'features' || currentTab === 'schema' || currentTab === 'api' || currentTab === 'security'
                  ? 'text-[#c0c1ff] font-semibold bg-[#171f33]'
                  : 'text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#171f33]/50'
              }`}
            >
              Blueprint
            </button>
            <button
              onClick={() => setCurrentTab('json')}
              class={`px-3 py-1.5 rounded-md font-['Inter'] text-sm transition-all ${
                currentTab === 'json'
                  ? 'text-[#c0c1ff] font-semibold bg-[#171f33]'
                  : 'text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#171f33]/50'
              }`}
            >
              JSON Studio
            </button>
          </nav>
        </div>

        {/* Quick Idea Generator Prompt Bar */}
        <div class="flex-1 max-w-xl hidden lg:flex flex-col gap-1">
          <div class="relative flex items-center w-full">
            <Search class="absolute left-3.5 w-4 h-4 text-[#908fa0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  onOpenGenerate();
                }
              }}
              placeholder="Describe app idea (e.g. SaaS billing, AI image gen)..."
              class="w-full bg-[#131b2e] border border-[#464554]/50 rounded-full pl-10 pr-36 py-1.5 font-['Inter'] text-xs text-[#dae2fd] placeholder-[#908fa0] focus:border-[#c0c1ff] focus:outline-none transition-all"
            />
            <button
              onClick={onOpenGenerate}
              class="absolute right-1 top-1/2 -translate-y-1/2 bg-[#8083ff] text-[#0d0096] px-3 py-1 rounded-full font-['JetBrains_Mono'] text-[11px] font-semibold hover:bg-white transition-colors flex items-center gap-1"
            >
              <Sparkles class="w-3 h-3" />
              Generate
            </button>
          </div>
          <div class="flex items-center gap-1.5 ml-3">
            <span class="text-[#908fa0] font-['JetBrains_Mono'] text-[10px] uppercase">TRY:</span>
            <button
              onClick={() => onSelectPreset('saas-billing')}
              class="bg-[#2d3449]/50 hover:bg-[#2d3449] text-[#c7c4d7] px-2 py-0.5 rounded-full text-[10px] transition-colors border border-[#464554]/30"
            >
              SaaS Billing
            </button>
            <button
              onClick={() => onSelectPreset('ai-image-gen')}
              class="bg-[#2d3449]/50 hover:bg-[#2d3449] text-[#c7c4d7] px-2 py-0.5 rounded-full text-[10px] transition-colors border border-[#464554]/30"
            >
              AI Image Studio
            </button>
            <button
              onClick={() => onSelectPreset('habit-tracker')}
              class="bg-[#2d3449]/50 hover:bg-[#2d3449] text-[#c7c4d7] px-2 py-0.5 rounded-full text-[10px] transition-colors border border-[#464554]/30"
            >
              Habit Tracker
            </button>
          </div>
        </div>

        {/* Engine Status & CTA */}
        <div class="flex items-center gap-4 shrink-0">
          <div class="hidden sm:flex items-center gap-2 bg-[#222a3d] px-3 py-1 rounded-full border border-[#464554]/50">
            <span class="w-2 h-2 rounded-full bg-[#7bd0ff] animate-pulse"></span>
            <span class="font-['JetBrains_Mono'] text-[11px] text-[#c7c4d7]">
              {hasApiKey ? 'Gemini 3.6 Flash Active' : 'Offline Engine Mode'}
            </span>
          </div>

          <button
            onClick={onOpenGenerate}
            class="bg-[#8083ff] text-[#0d0096] px-4 py-2 rounded-full font-['JetBrains_Mono'] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
          >
            <Sparkles class="w-3.5 h-3.5" />
            <span>Generate Tech Spec</span>
          </button>

          <div class="w-8 h-8 rounded-full bg-[#3e495d] flex items-center justify-center border border-[#464554] text-[#dae2fd]">
            <User class="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
