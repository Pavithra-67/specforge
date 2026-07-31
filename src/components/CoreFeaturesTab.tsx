import React, { useState } from 'react';
import { Layers, Plus, Check, BarChart3, Cpu, Zap } from 'lucide-react';
import { TechSpec } from '../types';

interface CoreFeaturesTabProps {
  spec: TechSpec;
  onUpdateFeatures: (features: string[]) => void;
}

export const CoreFeaturesTab: React.FC<CoreFeaturesTabProps> = ({ spec, onUpdateFeatures }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [newFeatureText, setNewFeatureText] = useState('');

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    const updated = [...spec.mvp_features, newFeatureText.trim()];
    onUpdateFeatures(updated);
    setNewFeatureText('');
  };

  const tagColors = [
    { label: 'HIGH PRIO', bg: 'bg-[#2d3449]', text: 'text-[#c0c1ff]' },
    { label: 'COMMERCE', bg: 'bg-[#2d3449]', text: 'text-[#7bd0ff]' },
    { label: 'SECURITY', bg: 'bg-[#2d3449]', text: 'text-[#ffb4ab]' },
    { label: 'UX', bg: 'bg-[#2d3449]', text: 'text-[#aeb9d0]' },
  ];

  return (
    <div class="space-y-8 max-w-4xl mx-auto">
      {/* Title & Count */}
      <div class="flex justify-between items-center pb-2 border-b border-[#464554]/30">
        <div>
          <h2 class="font-['Geist'] text-2xl font-bold text-[#dae2fd]">Feature Specification</h2>
          <p class="text-xs text-[#908fa0] mt-1 font-['Inter']">
            Core requirements and functional checklist for {spec.project_name}
          </p>
        </div>
        <span class="font-['JetBrains_Mono'] text-[11px] text-[#8083ff] bg-[#8083ff]/10 px-3 py-1 rounded-full border border-[#8083ff]/20">
          {spec.mvp_features.length} REQUIREMENTS IDENTIFIED
        </span>
      </div>

      {/* Feature List Cards */}
      <div class="space-y-3">
        {spec.mvp_features.map((feature, idx) => {
          const isChecked = Boolean(checkedItems[idx]);
          const tag = tagColors[idx % tagColors.length];

          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              class={`group flex items-start gap-4 bg-[#222a3d]/40 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isChecked
                  ? 'border-[#8083ff]/50 bg-[#171f33]/60'
                  : 'border-[#464554]/40 hover:border-[#8083ff]/30'
              }`}
            >
              <div class="pt-0.5">
                <div
                  class={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-[#8083ff] border-[#8083ff] text-[#0d0096]'
                      : 'border-[#464554] bg-[#171f33]'
                  }`}
                >
                  {isChecked && <Check class="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <div class="flex-1">
                <h4 class={`font-semibold text-sm transition-colors font-['Inter'] ${
                  isChecked ? 'text-[#dae2fd]' : 'text-[#c7c4d7]'
                }`}>
                  {feature}
                </h4>
              </div>

              <span class={`font-['JetBrains_Mono'] text-[10px] px-2.5 py-1 rounded ${tag.bg} ${tag.text}`}>
                {tag.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Add Custom Feature Row */}
      <div class="pt-2 border-t border-[#464554]/30">
        <div class="flex items-center gap-3">
          <input
            type="text"
            value={newFeatureText}
            onChange={(e) => setNewFeatureText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
            placeholder="Add custom feature requirement..."
            class="flex-1 bg-transparent border-b border-[#464554] focus:border-[#8083ff] text-sm text-[#dae2fd] placeholder-[#908fa0] py-2 px-1 focus:outline-none font-['Inter'] transition-colors"
          />
          <button
            onClick={handleAddFeature}
            class="flex items-center gap-1.5 bg-[#222a3d] hover:bg-[#2d3449] px-4 py-2 rounded-lg border border-[#464554] text-[#c0c1ff] font-['JetBrains_Mono'] text-[11px] font-semibold transition-colors"
          >
            <Plus class="w-4 h-4" />
            <span>ADD TO SPEC</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Analytics */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {/* Effort Estimation Card */}
        <div class="bg-[#131b2e] p-6 rounded-2xl border border-[#464554]/50 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center gap-2 text-[#8083ff] mb-2">
              <BarChart3 class="w-5 h-5" />
              <h5 class="font-['Geist'] text-lg font-semibold text-[#dae2fd]">Effort Estimation</h5>
            </div>
            <p class="text-xs text-[#908fa0] leading-relaxed font-['Inter']">
              Based on the core features, estimated development time is{' '}
              <strong class="text-[#c0c1ff]">{spec.effort_estimate_weeks || '3-5 weeks for MVP'}</strong>.
            </p>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center text-xs font-['JetBrains_Mono']">
              <span class="text-[#908fa0]">MVP Completeness</span>
              <span class="text-[#8083ff] font-bold">65% Readiness</span>
            </div>
            <div class="h-3 w-full bg-[#222a3d] rounded-full overflow-hidden p-0.5 border border-[#464554]/40">
              <div class="h-full bg-gradient-to-r from-[#8083ff] to-[#7bd0ff] rounded-full w-[65%]"></div>
            </div>
          </div>
        </div>

        {/* Suggested Integrations Card */}
        <div class="bg-[#131b2e] p-6 rounded-2xl border border-[#464554]/50 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center gap-2 text-[#7bd0ff] mb-2">
              <Zap class="w-5 h-5" />
              <h5 class="font-['Geist'] text-lg font-semibold text-[#dae2fd]">Recommended Stack</h5>
            </div>
            <div class="flex flex-wrap gap-2 my-3">
              {(spec.suggested_integrations || ['CLERK', 'STRIPE', 'UPSTASH', 'SENDGRID', 'VULTR']).map((item, idx) => (
                <span
                  key={idx}
                  class="bg-[#2d3449] text-[#dae2fd] px-2.5 py-1 rounded font-['JetBrains_Mono'] text-[10px] font-semibold tracking-wide border border-[#464554]/50"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <p class="text-[12px] text-[#908fa0] leading-relaxed font-['Inter']">
            Recommended third-party SDKs for high-throughput database synchronization and identity management.
          </p>
        </div>
      </div>
    </div>
  );
};
