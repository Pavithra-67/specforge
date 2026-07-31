import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Lock, Activity } from 'lucide-react';
import { TechSpec } from '../types';

interface SecurityRisksTabProps {
  spec: TechSpec;
}

export const SecurityRisksTab: React.FC<SecurityRisksTabProps> = ({ spec }) => {
  const severityBadge = (idx: number) => {
    if (idx === 0) return { label: 'CRITICAL', bg: 'bg-red-500/10 text-red-400 border-red-500/30' };
    if (idx === 1) return { label: 'HIGH', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    return { label: 'MEDIUM', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' };
  };

  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div class="flex justify-between items-center pb-2 border-b border-[#464554]/30">
        <div>
          <h2 class="font-['Geist'] text-2xl font-bold text-[#dae2fd]">Risks & Edge Cases Matrix</h2>
          <p class="text-xs text-[#908fa0] mt-1 font-['Inter']">
            Security considerations and failure mode mitigations for {spec.project_name}
          </p>
        </div>
        <span class="font-['JetBrains_Mono'] text-[11px] text-[#ffb4ab] bg-[#ffb4ab]/10 px-3 py-1 rounded-full border border-[#ffb4ab]/20 flex items-center gap-1.5">
          <ShieldAlert class="w-3.5 h-3.5" />
          <span>{spec.risks_and_edge_cases.length} RISKS IDENTIFIED</span>
        </span>
      </div>

      {/* Risk Items Cards */}
      <div class="space-y-3">
        {spec.risks_and_edge_cases.map((risk, idx) => {
          const badge = severityBadge(idx);
          return (
            <div
              key={idx}
              class="p-4 bg-[#171f33] rounded-xl border border-[#464554]/40 hover:border-[#ffb4ab]/40 transition-all flex items-start gap-4"
            >
              <div class="pt-0.5">
                <AlertTriangle class="w-5 h-5 text-[#ffb4ab]" />
              </div>

              <div class="flex-1 space-y-1">
                <div class="flex justify-between items-center">
                  <h4 class="font-['Inter'] font-semibold text-sm text-[#dae2fd]">
                    Risk #{idx + 1}: {risk.split(' ').slice(0, 5).join(' ')}...
                  </h4>
                  <span class={`font-['JetBrains_Mono'] text-[10px] px-2.5 py-0.5 rounded font-bold border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>
                <p class="text-xs text-[#908fa0] font-['Inter'] leading-relaxed">
                  {risk}
                </p>
                <div class="pt-2 text-[11px] font-['JetBrains_Mono'] text-[#7bd0ff] flex items-center gap-1">
                  <ShieldCheck class="w-3.5 h-3.5" />
                  <span>Mitigation Strategy: Implement automated idempotency keys, exponential backoff retries, & circuit breakers.</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Architecture Cards */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div class="p-5 bg-[#131b2e] rounded-2xl border border-[#464554]/50 space-y-3">
          <div class="flex items-center gap-2 text-[#8083ff]">
            <Lock class="w-5 h-5" />
            <h4 class="font-['Geist'] text-base font-semibold text-[#dae2fd]">Data Protection & Privacy</h4>
          </div>
          <ul class="space-y-2 text-xs text-[#908fa0] font-['Inter']">
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-[#8083ff]"></span>
              <span>All user credentials and sensitive secrets encrypted at rest via AES-256</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-[#8083ff]"></span>
              <span>TLS 1.3 enforced for all internal microservice and client communication</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-[#8083ff]"></span>
              <span>Automated GDPR/CCPA data scrubbing for soft-deleted user accounts</span>
            </li>
          </ul>
        </div>

        <div class="p-5 bg-[#131b2e] rounded-2xl border border-[#464554]/50 space-y-3">
          <div class="flex items-center gap-2 text-[#7bd0ff]">
            <Activity class="w-5 h-5" />
            <h4 class="font-['Geist'] text-base font-semibold text-[#dae2fd]">Observability & Auditing</h4>
          </div>
          <ul class="space-y-2 text-xs text-[#908fa0] font-['Inter']">
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-[#7bd0ff]"></span>
              <span>Immutable audit logs tracking privilege escalation and admin mutations</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-[#7bd0ff]"></span>
              <span>Automated rate limiting alerts triggered when endpoints cross error thresholds</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-[#7bd0ff]"></span>
              <span>Real-time anomaly detection for unexpected geographic request surges</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
