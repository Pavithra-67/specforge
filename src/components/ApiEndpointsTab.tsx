import React, { useState } from 'react';
import { ApiEndpoint, TechSpec } from '../types';
import { Terminal, Lock, LockOpen, Play, Download, Plus, Shield, Gauge, History } from 'lucide-react';

interface ApiEndpointsTabProps {
  spec: TechSpec;
  onTestEndpoint: (endpoint: ApiEndpoint) => void;
  onAddEndpoint: (endpoint: ApiEndpoint) => void;
}

export const ApiEndpointsTab: React.FC<ApiEndpointsTabProps> = ({
  spec,
  onTestEndpoint,
  onAddEndpoint
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethod, setNewMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [newPath, setNewPath] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = () => {
    if (!newPath.trim() || !newDesc.trim()) return;
    onAddEndpoint({
      method: newMethod,
      path: newPath.trim().startsWith('/') ? newPath.trim() : `/${newPath.trim()}`,
      description: newDesc.trim(),
      requiresAuth: true
    });
    setNewPath('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const methodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case 'POST':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'GET':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div class="flex justify-between items-center pb-2 border-b border-[#464554]/30">
        <div>
          <h2 class="font-['Geist'] text-2xl font-bold text-[#dae2fd]">API Architecture Surface</h2>
          <p class="text-xs text-[#908fa0] mt-1 font-['Inter']">
            RESTful endpoints & payload contracts for {spec.project_name}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            class="flex items-center gap-1.5 bg-[#8083ff] text-[#0d0096] px-3.5 py-1.5 rounded-full font-['JetBrains_Mono'] text-xs font-semibold hover:brightness-110 transition-all"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>New Endpoint</span>
          </button>
        </div>
      </div>

      {/* Endpoint Table Panel */}
      <div class="bg-[#171f33]/80 rounded-xl border border-[#464554]/50 overflow-hidden shadow-2xl backdrop-blur-md">
        <div class="p-4 border-b border-[#464554]/40 flex justify-between items-center bg-[#2d3449]/30">
          <div class="flex items-center gap-2">
            <Terminal class="w-4 h-4 text-[#8083ff]" />
            <span class="font-['JetBrains_Mono'] text-xs tracking-wider text-[#dae2fd] uppercase font-semibold">
              ENDPOINT REGISTRY ({spec.api_endpoints.length})
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#131b2e]/60 text-[#908fa0] border-b border-[#464554]/40 font-['JetBrains_Mono'] text-[11px] uppercase">
                <th class="px-5 py-3 font-semibold">Method</th>
                <th class="px-5 py-3 font-semibold">Endpoint Path</th>
                <th class="px-5 py-3 font-semibold">Description</th>
                <th class="px-5 py-3 font-semibold">Auth</th>
                <th class="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#464554]/30 font-['Inter'] text-xs">
              {spec.api_endpoints.map((ep, idx) => (
                <tr key={idx} class="hover:bg-[#2d3449]/20 transition-colors group">
                  <td class="px-5 py-3.5">
                    <span class={`px-2.5 py-1 rounded-full font-['JetBrains_Mono'] text-[11px] font-bold border ${methodBadge(ep.method)}`}>
                      {ep.method}
                    </span>
                  </td>
                  <td class="px-5 py-3.5 font-['JetBrains_Mono'] text-[#c0c1ff] font-medium">
                    {ep.path}
                  </td>
                  <td class="px-5 py-3.5 text-[#908fa0]">
                    {ep.description}
                  </td>
                  <td class="px-5 py-3.5">
                    {ep.requiresAuth !== false ? (
                      <Lock class="w-4 h-4 text-[#7bd0ff]" title="Requires JWT Auth" />
                    ) : (
                      <LockOpen class="w-4 h-4 text-[#908fa0]" title="Public Endpoint" />
                    )}
                  </td>
                  <td class="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onTestEndpoint(ep)}
                      class="bg-[#222a3d] border border-[#464554] hover:border-[#8083ff] text-[#dae2fd] px-3 py-1.5 rounded-full font-['JetBrains_Mono'] text-[11px] hover:text-[#c0c1ff] transition-all flex items-center gap-1.5 ml-auto"
                    >
                      <Play class="w-3 h-3 text-[#8083ff] fill-[#8083ff]" />
                      <span>Test Payload</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auxiliary Security & Rate Limit Info Cards */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div class="p-5 bg-[#171f33] rounded-xl border border-[#464554]/40 space-y-2">
          <div class="flex items-center gap-2 text-[#8083ff]">
            <Lock class="w-4 h-4" />
            <h4 class="font-['Geist'] text-sm font-semibold text-[#dae2fd]">Authentication</h4>
          </div>
          <p class="text-xs text-[#908fa0] leading-relaxed">
            OAuth2 + PKCE bearer token session validation for private endpoints.
          </p>
          <div class="p-2 bg-[#060e20] rounded border border-[#464554]/40 font-['JetBrains_Mono'] text-[11px] text-[#c0c1ff]">
            Authorization: Bearer &lt;jwt_token&gt;
          </div>
        </div>

        <div class="p-5 bg-[#171f33] rounded-xl border border-[#464554]/40 space-y-2">
          <div class="flex items-center gap-2 text-[#7bd0ff]">
            <Terminal class="w-4 h-4" />
            <h4 class="font-['Geist'] text-sm font-semibold text-[#dae2fd]">Rate Limiting</h4>
          </div>
          <div class="space-y-1.5 font-['JetBrains_Mono'] text-[11px]">
            <div class="flex justify-between text-[#908fa0]">
              <span>Standard Tier</span>
              <span class="text-[#c0c1ff]">100 req/min</span>
            </div>
            <div class="w-full bg-[#222a3d] h-1.5 rounded-full overflow-hidden">
              <div class="bg-[#8083ff] h-full w-2/3 rounded-full"></div>
            </div>
            <div class="flex justify-between text-[#908fa0]">
              <span>Enterprise Tier</span>
              <span class="text-[#7bd0ff]">Unlimited</span>
            </div>
          </div>
        </div>

        <div class="p-5 bg-[#171f33] rounded-xl border border-[#464554]/40 space-y-2">
          <div class="flex items-center gap-2 text-[#c0c1ff]">
            <History class="w-4 h-4" />
            <h4 class="font-['Geist'] text-sm font-semibold text-[#dae2fd]">Versioning</h4>
          </div>
          <p class="text-xs text-[#908fa0] leading-relaxed">
            Strict Semantic Versioning pathing for generated REST resources.
          </p>
          <div class="flex gap-2">
            <span class="bg-[#222a3d] px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] text-[#c0c1ff]">v1.0 (Active)</span>
            <span class="bg-[#222a3d]/40 px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] text-[#908fa0]">v0.9 (Deprec)</span>
          </div>
        </div>
      </div>

      {/* Add New Endpoint Modal */}
      {showAddModal && (
        <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-[#131b2e] border border-[#464554] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 class="font-['Geist'] text-lg font-bold text-[#dae2fd]">Add New Endpoint</h3>
            <div class="space-y-3 font-['Inter'] text-xs">
              <div>
                <label class="block text-[#908fa0] font-['JetBrains_Mono'] text-[11px] mb-1">METHOD</label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value as any)}
                  class="w-full bg-[#171f33] border border-[#464554] rounded-lg p-2 text-[#dae2fd] font-['JetBrains_Mono']"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div>
                <label class="block text-[#908fa0] font-['JetBrains_Mono'] text-[11px] mb-1">PATH</label>
                <input
                  type="text"
                  placeholder="/api/v1/resource"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  class="w-full bg-[#171f33] border border-[#464554] rounded-lg p-2 text-[#dae2fd] font-['JetBrains_Mono'] focus:outline-none focus:border-[#8083ff]"
                />
              </div>

              <div>
                <label class="block text-[#908fa0] font-['JetBrains_Mono'] text-[11px] mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  placeholder="Short explanation of operation"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  class="w-full bg-[#171f33] border border-[#464554] rounded-lg p-2 text-[#dae2fd] focus:outline-none focus:border-[#8083ff]"
                />
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                class="px-4 py-2 rounded-lg bg-[#171f33] text-[#908fa0] font-['JetBrains_Mono'] text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                class="px-4 py-2 rounded-lg bg-[#8083ff] text-[#0d0096] font-['JetBrains_Mono'] text-xs font-semibold"
              >
                Add Endpoint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
