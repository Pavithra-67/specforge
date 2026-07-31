import React, { useState } from 'react';
import { Database, Copy, Check, Download, Share2, Layers } from 'lucide-react';
import { TechSpec } from '../types';

interface DatabaseSchemaTabProps {
  spec: TechSpec;
}

export const DatabaseSchemaTab: React.FC<DatabaseSchemaTabProps> = ({ spec }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'prisma' | 'sql'>(spec.schema_format || 'prisma');

  const handleCopy = () => {
    navigator.clipboard.writeText(spec.database_schema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = format === 'prisma' ? 'schema.prisma' : 'schema.sql';
    const blob = new Blob([spec.database_schema], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const schemaLines = spec.database_schema.trim().split('\n');

  // Estimate models count
  const modelCount = format === 'prisma'
    ? (spec.database_schema.match(/model\s+\w+/g) || []).length || 3
    : (spec.database_schema.match(/CREATE TABLE/gi) || []).length || 3;

  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      {/* Header controls */}
      <div class="flex justify-between items-center pb-2 border-b border-[#464554]/30">
        <div>
          <h2 class="font-['Geist'] text-2xl font-bold text-[#dae2fd]">Database Architecture</h2>
          <p class="text-xs text-[#908fa0] mt-1 font-['Inter']">
            Target schema definition for {spec.project_name}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex bg-[#171f33] p-0.5 rounded-lg border border-[#464554]">
            <button
              onClick={() => setFormat('prisma')}
              class={`px-3 py-1 font-['JetBrains_Mono'] text-[11px] font-semibold rounded ${
                format === 'prisma' ? 'bg-[#3e495d] text-[#c0c1ff]' : 'text-[#908fa0]'
              }`}
            >
              PRISMA
            </button>
            <button
              onClick={() => setFormat('sql')}
              class={`px-3 py-1 font-['JetBrains_Mono'] text-[11px] font-semibold rounded ${
                format === 'sql' ? 'bg-[#3e495d] text-[#c0c1ff]' : 'text-[#908fa0]'
              }`}
            >
              SQL
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor Container */}
      <div class="rounded-xl overflow-hidden border border-[#464554]/60 bg-[#060e20] shadow-2xl">
        {/* Editor Toolbar */}
        <div class="flex justify-between items-center px-4 py-2 bg-[#2d3449]/30 border-b border-[#464554]/50">
          <div class="flex items-center gap-3">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-[#ffb4ab]/40"></div>
              <div class="w-3 h-3 rounded-full bg-[#7bd0ff]/40"></div>
              <div class="w-3 h-3 rounded-full bg-[#c0c1ff]/40"></div>
            </div>
            <span class="font-['JetBrains_Mono'] text-xs text-[#c7c4d7] ml-2">
              {format === 'prisma' ? 'schema.prisma' : 'schema.sql'}
            </span>
          </div>

          <button
            onClick={handleCopy}
            class="flex items-center gap-1.5 px-3 py-1 bg-[#222a3d] hover:bg-[#2d3449] rounded transition-colors text-[#c7c4d7] hover:text-[#c0c1ff]"
          >
            {copied ? (
              <>
                <Check class="w-3.5 h-3.5 text-emerald-400" />
                <span class="font-['JetBrains_Mono'] text-[11px] text-emerald-400">COPIED!</span>
              </>
            ) : (
              <>
                <Copy class="w-3.5 h-3.5" />
                <span class="font-['JetBrains_Mono'] text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div class="p-6 font-['JetBrains_Mono'] text-xs leading-relaxed overflow-x-auto max-h-[500px]">
          <table class="w-full text-left border-collapse">
            <tbody>
              {schemaLines.map((line, i) => (
                <tr key={i} class="hover:bg-[#8083ff]/5 transition-colors">
                  <td class="w-10 pr-4 text-right text-[#908fa0]/40 select-none border-r border-[#464554]/20">
                    {i + 1}
                  </td>
                  <td class="pl-4 whitespace-pre text-[#dae2fd]">
                    {line}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Entity Analysis */}
        <div class="p-5 bg-[#171f33] rounded-xl border border-[#464554]/40 space-y-3">
          <h4 class="font-['Geist'] text-base font-semibold text-[#c0c1ff] flex items-center gap-2">
            <Database class="w-4 h-4 text-[#8083ff]" /> Entity Analysis
          </h4>
          <div class="space-y-2 text-xs font-['Inter']">
            <div class="flex justify-between py-1 border-b border-[#464554]/20">
              <span class="text-[#908fa0]">Total Models / Tables</span>
              <span class="font-['JetBrains_Mono'] text-[#dae2fd] font-semibold">{modelCount}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-[#464554]/20">
              <span class="text-[#908fa0]">Relationships</span>
              <span class="font-['JetBrains_Mono'] text-[#dae2fd]">One-to-Many ({Math.max(1, modelCount - 1)})</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-[#908fa0]">Est. Storage Size</span>
              <span class="font-['JetBrains_Mono'] text-[#dae2fd]">~150 MB / mo</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div class="p-5 bg-[#171f33] rounded-xl border border-[#464554]/40 space-y-3">
          <h4 class="font-['Geist'] text-base font-semibold text-[#c0c1ff]">Quick Actions</h4>
          <div class="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              class="bg-[#222a3d] border border-[#464554] hover:border-[#8083ff] text-[#dae2fd] rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 transition-all font-['JetBrains_Mono'] text-[11px]"
            >
              <Download class="w-4 h-4 text-[#8083ff]" />
              <span>Export {format.toUpperCase()}</span>
            </button>
            <button
              onClick={handleCopy}
              class="bg-[#222a3d] border border-[#464554] hover:border-[#8083ff] text-[#dae2fd] rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 transition-all font-['JetBrains_Mono'] text-[11px]"
            >
              <Share2 class="w-4 h-4 text-[#7bd0ff]" />
              <span>Copy Schema</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
