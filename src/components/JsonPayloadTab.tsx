import React, { useState } from 'react';
import { FileJson, Copy, Check, Download, FileText, Code2 } from 'lucide-react';
import { TechSpec } from '../types';

interface JsonPayloadTabProps {
  spec: TechSpec;
}

export const JsonPayloadTab: React.FC<JsonPayloadTabProps> = ({ spec }) => {
  const [copied, setCopied] = useState(false);
  const [onlyValidJsonMode, setOnlyValidJsonMode] = useState(false);

  // Filter down to the strict required schema object
  const strictJsonPayload = {
    project_name: spec.project_name,
    one_liner: spec.one_liner,
    mvp_features: spec.mvp_features,
    database_schema: spec.database_schema,
    api_endpoints: spec.api_endpoints.map(ep => ({
      method: ep.method,
      path: ep.path,
      description: ep.description
    })),
    risks_and_edge_cases: spec.risks_and_edge_cases
  };

  const jsonString = JSON.stringify(strictJsonPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.project_name.toLowerCase().replace(/\s+/g, '_')}_spec.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const markdown = `# ${spec.project_name} - Technical Specification

> ${spec.one_liner}

## MVP Features
${spec.mvp_features.map(f => `- [ ] ${f}`).join('\n')}

## Database Schema
\`\`\`${spec.schema_format || 'prisma'}
${spec.database_schema}
\`\`\`

## API Endpoints
${spec.api_endpoints.map(ep => `### \`${ep.method} ${ep.path}\`
${ep.description}
`).join('\n')}

## Risks & Edge Cases
${spec.risks_and_edge_cases.map(r => `- ${r}`).join('\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.project_name.toLowerCase().replace(/\s+/g, '_')}_prd.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[#464554]/30">
        <div>
          <h2 class="font-['Geist'] text-2xl font-bold text-[#dae2fd]">Structured JSON Payload Studio</h2>
          <p class="text-xs text-[#908fa0] mt-1 font-['Inter']">
            Strict schema output payload ready to power PRD integrations or LLM prompts
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            onClick={() => setOnlyValidJsonMode(!onlyValidJsonMode)}
            class={`px-3 py-1.5 rounded-full font-['JetBrains_Mono'] text-xs font-semibold border transition-all ${
              onlyValidJsonMode
                ? 'bg-[#8083ff] text-[#0d0096] border-[#8083ff]'
                : 'bg-[#171f33] text-[#c0c1ff] border-[#464554] hover:bg-[#222a3d]'
            }`}
          >
            {onlyValidJsonMode ? '✓ ONLY VALID JSON MODE' : 'STRICT SCHEMA VIEW'}
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div class="rounded-xl overflow-hidden border border-[#464554]/60 bg-[#060e20] shadow-2xl">
        {/* Editor Toolbar */}
        <div class="flex justify-between items-center px-4 py-2 bg-[#2d3449]/30 border-b border-[#464554]/50">
          <div class="flex items-center gap-3">
            <FileJson class="w-4 h-4 text-[#8083ff]" />
            <span class="font-['JetBrains_Mono'] text-xs text-[#dae2fd] font-semibold">
              payload.json
            </span>
          </div>

          <div class="flex items-center gap-2">
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
                  <span class="font-['JetBrains_Mono'] text-[11px]">Copy JSON</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadJson}
              class="flex items-center gap-1.5 px-3 py-1 bg-[#222a3d] hover:bg-[#2d3449] rounded transition-colors text-[#c7c4d7] hover:text-[#c0c1ff]"
            >
              <Download class="w-3.5 h-3.5" />
              <span class="font-['JetBrains_Mono'] text-[11px]">Download JSON</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              class="flex items-center gap-1.5 px-3 py-1 bg-[#8083ff]/20 border border-[#8083ff]/40 hover:bg-[#8083ff]/30 rounded transition-colors text-[#c0c1ff]"
            >
              <FileText class="w-3.5 h-3.5 text-[#8083ff]" />
              <span class="font-['JetBrains_Mono'] text-[11px]">Export PRD .md</span>
            </button>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div class="p-6 font-['JetBrains_Mono'] text-xs leading-relaxed overflow-x-auto max-h-[600px] text-[#dae2fd]">
          {onlyValidJsonMode ? (
            <pre class="whitespace-pre text-emerald-300 bg-[#060e20] p-4 rounded-lg selection:bg-[#8083ff] selection:text-black">
              {jsonString}
            </pre>
          ) : (
            <pre class="whitespace-pre text-[#c7c4d7]">
              {jsonString}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
