import React, { useState, useEffect } from 'react';
import { TopNavBar } from './components/TopNavBar';
import { Sidebar } from './components/Sidebar';
import { CoreFeaturesTab } from './components/CoreFeaturesTab';
import { DatabaseSchemaTab } from './components/DatabaseSchemaTab';
import { ApiEndpointsTab } from './components/ApiEndpointsTab';
import { SecurityRisksTab } from './components/SecurityRisksTab';
import { JsonPayloadTab } from './components/JsonPayloadTab';
import { GenerateModal } from './components/GenerateModal';
import { ApiTestModal } from './components/ApiTestModal';
import { PRESET_SPECS } from './data/presets';
import { ApiEndpoint, GeneratorParams, TechSpec } from './types';
import { Layers, Database, Terminal, ShieldAlert, FileJson, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';

export default function App() {
  const [currentSpec, setCurrentSpec] = useState<TechSpec>(PRESET_SPECS['saas-billing']);
  const [currentTab, setCurrentTab] = useState<'features' | 'schema' | 'api' | 'security' | 'json'>('features');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [activeTestEndpoint, setActiveTestEndpoint] = useState<ApiEndpoint | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  const [params, setParams] = useState<GeneratorParams>({
    prompt: 'SaaS Billing & Subscription Engine',
    techStack: 'Next.js + Supabase',
    scope: 'MVP',
    inclusions: {
      coreFeatures: true,
      dbSchema: true,
      apiRoutes: true,
      edgeCases: true
    }
  });

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHasApiKey(data.hasGeminiKey || false);
      })
      .catch(() => setHasApiKey(false));
  }, []);

  const handleSelectPreset = (key: string) => {
    if (PRESET_SPECS[key]) {
      setCurrentSpec(PRESET_SPECS[key]);
      setParams(prev => ({
        ...prev,
        prompt: PRESET_SPECS[key].project_name,
        techStack: PRESET_SPECS[key].tech_stack || prev.techStack
      }));
    }
  };

  const handleGenerateSpec = async (promptText: string, stackText: string, scopeText: 'MVP' | 'PRODUCTION') => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/spec/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          techStack: stackText,
          scope: scopeText
        })
      });

      const data = await res.json();
      if (data.spec) {
        setCurrentSpec(data.spec);
        setIsGenerateModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to generate spec:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateFeatures = (updatedFeatures: string[]) => {
    setCurrentSpec(prev => ({ ...prev, mvp_features: updatedFeatures }));
  };

  const handleAddEndpoint = (newEndpoint: ApiEndpoint) => {
    setCurrentSpec(prev => ({
      ...prev,
      api_endpoints: [...prev.api_endpoints, newEndpoint]
    }));
  };

  const handleReSync = () => {
    handleGenerateSpec(params.prompt || currentSpec.project_name, params.techStack, params.scope);
  };

  return (
    <div class="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter'] selection:bg-[#8083ff]/30 selection:text-[#c0c1ff] overflow-x-hidden">
      {/* Top Header */}
      <TopNavBar
        onOpenGenerate={() => setIsGenerateModalOpen(true)}
        onSelectPreset={handleSelectPreset}
        currentTab={currentTab}
        setCurrentTab={(tab) => setCurrentTab(tab as any)}
        hasApiKey={hasApiKey}
      />

      {/* Main Layout Shell */}
      <div class="pt-16 flex min-h-screen">
        {/* Left Sidebar Configurator */}
        <Sidebar
          params={params}
          setParams={setParams}
          onReSync={handleReSync}
          isGenerating={isGenerating}
        />

        {/* Main Content Workspace Canvas */}
        <main class="ml-[260px] flex-1 flex flex-col min-h-[calc(100vh-64px)] bg-[#0b1326]">
          {/* Subheader / Project Banner */}
          <div class="bg-[#171f33]/60 border-b border-[#464554]/40 px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div class="flex items-center gap-2 text-xs text-[#908fa0] font-['JetBrains_Mono'] mb-1">
                <span>SPEC ARCHITECT</span>
                <ChevronRight class="w-3.5 h-3.5" />
                <span class="text-[#c0c1ff]">{currentSpec.project_name}</span>
              </div>
              <h1 class="font-['Geist'] text-xl font-bold text-[#dae2fd]">
                {currentSpec.project_name}
              </h1>
              <p class="text-xs text-[#908fa0] mt-0.5 max-w-3xl font-['Inter']">
                {currentSpec.one_liner}
              </p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsGenerateModalOpen(true)}
                class="bg-[#8083ff]/10 hover:bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/30 px-3.5 py-1.5 rounded-full font-['JetBrains_Mono'] text-xs transition-all flex items-center gap-1.5"
              >
                <Sparkles class="w-3.5 h-3.5" />
                <span>Customize Spec Prompt</span>
              </button>
            </div>
          </div>

          {/* Interactive Workspace Navigation Tabs */}
          <div class="bg-[#171f33] border-b border-[#464554]/40 px-8 flex items-center justify-between">
            <div class="flex items-center space-x-1">
              <button
                onClick={() => setCurrentTab('features')}
                class={`px-5 py-3 font-['Inter'] text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  currentTab === 'features'
                    ? 'border-[#8083ff] text-[#c0c1ff] bg-[#222a3d]/40'
                    : 'border-transparent text-[#908fa0] hover:text-[#dae2fd]'
                }`}
              >
                <Layers class="w-4 h-4" />
                <span>1. Core Features</span>
              </button>

              <button
                onClick={() => setCurrentTab('schema')}
                class={`px-5 py-3 font-['Inter'] text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  currentTab === 'schema'
                    ? 'border-[#8083ff] text-[#c0c1ff] bg-[#222a3d]/40'
                    : 'border-transparent text-[#908fa0] hover:text-[#dae2fd]'
                }`}
              >
                <Database class="w-4 h-4" />
                <span>2. Database Schema</span>
              </button>

              <button
                onClick={() => setCurrentTab('api')}
                class={`px-5 py-3 font-['Inter'] text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  currentTab === 'api'
                    ? 'border-[#8083ff] text-[#c0c1ff] bg-[#222a3d]/40'
                    : 'border-transparent text-[#908fa0] hover:text-[#dae2fd]'
                }`}
              >
                <Terminal class="w-4 h-4" />
                <span>3. API Endpoints</span>
              </button>

              <button
                onClick={() => setCurrentTab('security')}
                class={`px-5 py-3 font-['Inter'] text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  currentTab === 'security'
                    ? 'border-[#8083ff] text-[#c0c1ff] bg-[#222a3d]/40'
                    : 'border-transparent text-[#908fa0] hover:text-[#dae2fd]'
                }`}
              >
                <ShieldAlert class="w-4 h-4" />
                <span>4. Security & Risks</span>
              </button>

              <button
                onClick={() => setCurrentTab('json')}
                class={`px-5 py-3 font-['Inter'] text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  currentTab === 'json'
                    ? 'border-[#8083ff] text-[#c0c1ff] bg-[#222a3d]/40'
                    : 'border-transparent text-[#908fa0] hover:text-[#dae2fd]'
                }`}
              >
                <FileJson class="w-4 h-4" />
                <span>5. JSON Studio</span>
              </button>
            </div>

            <div class="hidden lg:flex items-center gap-3 font-['JetBrains_Mono'] text-[11px] text-[#908fa0]">
              <span>FORMAT: {currentSpec.schema_format ? currentSpec.schema_format.toUpperCase() : 'PRISMA'}</span>
            </div>
          </div>

          {/* Active Tab View Rendering */}
          <div class="flex-1 p-8 overflow-y-auto">
            {currentTab === 'features' && (
              <CoreFeaturesTab
                spec={currentSpec}
                onUpdateFeatures={handleUpdateFeatures}
              />
            )}

            {currentTab === 'schema' && (
              <DatabaseSchemaTab spec={currentSpec} />
            )}

            {currentTab === 'api' && (
              <ApiEndpointsTab
                spec={currentSpec}
                onTestEndpoint={(ep) => setActiveTestEndpoint(ep)}
                onAddEndpoint={handleAddEndpoint}
              />
            )}

            {currentTab === 'security' && (
              <SecurityRisksTab spec={currentSpec} />
            )}

            {currentTab === 'json' && (
              <JsonPayloadTab spec={currentSpec} />
            )}
          </div>

          {/* Footer */}
          <footer class="bg-[#060e20] border-t border-[#464554]/40 px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-[#908fa0] gap-4 font-['JetBrains_Mono']">
            <span>© 2026 SpecForge AI Workspace. Gemini 3.6 Flash Active.</span>
            <div class="flex gap-6">
              <button onClick={() => setCurrentTab('json')} class="hover:text-[#c0c1ff] transition-colors">Documentation</button>
              <button onClick={() => setCurrentTab('json')} class="hover:text-[#c0c1ff] transition-colors">Privacy Policy</button>
              <button onClick={() => setIsGenerateModalOpen(true)} class="hover:text-[#c0c1ff] transition-colors">New Tech Spec</button>
            </div>
          </footer>
        </main>
      </div>

      {/* Interactive Modals */}
      <GenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleGenerateSpec}
        isGenerating={isGenerating}
        initialParams={params}
      />

      <ApiTestModal
        endpoint={activeTestEndpoint}
        onClose={() => setActiveTestEndpoint(null)}
      />
    </div>
  );
}
