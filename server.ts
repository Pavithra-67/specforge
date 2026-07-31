import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Helper: Dynamic fallback generator when offline or no API key
function generateFallbackSpec(prompt: string, techStack: string = 'Next.js + Supabase', scope: string = 'MVP') {
  const cleanPrompt = prompt.trim();
  const titleWords = cleanPrompt.split(' ').slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const projectName = titleWords.length > 0 ? `${titleWords} Engine` : 'Custom Technical Platform';

  const isPrisma = !techStack.toLowerCase().includes('fastapi') && !techStack.toLowerCase().includes('sql');

  return {
    project_name: projectName,
    one_liner: `A high-performance ${scope.toLowerCase()} architecture for "${cleanPrompt}", optimized for scalability and clean developer experience.`,
    mvp_features: [
      `User Authentication & Session Management with ${techStack}`,
      `Core Business Logic Engine for handling "${cleanPrompt}" workflows`,
      'Role-Based Access Control (RBAC) with Admin, Editor, and Viewer permissions',
      'Real-time Notifications & Activity Event Streaming',
      'Export & Reporting Engine with CSV/PDF data download capabilities',
      'Integrated Webhook Receiver for third-party automated triggers'
    ],
    database_schema: isPrisma ? `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  records       Record[]
}

model Record {
  id          String      @id @default(cuid())
  title       String
  payload     Json?
  status      Status      @default(ACTIVE)
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime    @default(now())
}

enum UserRole {
  ADMIN
  USER
}

enum Status {
  ACTIVE
  ARCHIVED
}` : `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  metadata JSONB,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    api_endpoints: [
      {
        method: 'POST',
        path: '/api/v1/auth/session',
        description: 'Authenticate user credentials and issue encrypted session cookies.'
      },
      {
        method: 'GET',
        path: '/api/v1/records',
        description: 'Fetch paginated list of records filtered by user role and query parameters.'
      },
      {
        method: 'POST',
        path: '/api/v1/records',
        description: `Create a new record in the system for "${cleanPrompt}".`
      },
      {
        method: 'PUT',
        path: '/api/v1/records/{id}',
        description: 'Update existing record configuration and trigger background sync.'
      },
      {
        method: 'DELETE',
        path: '/api/v1/records/{id}',
        description: 'Soft-delete or archive record by ID.'
      }
    ],
    risks_and_edge_cases: [
      'Concurrent mutation conflicts during multi-user collaborative state edits.',
      'Database connection pool exhaustion under sudden peak traffic spikes.',
      'Unchecked user payload input leading to JSON serialization edge cases.',
      'Third-party service outage causing webhook retry backoff queue buildup.'
    ],
    tech_stack: techStack,
    schema_format: isPrisma ? 'prisma' : 'sql',
    effort_estimate_weeks: '3-5 weeks for MVP (2 devs)',
    suggested_integrations: ['SUPABASE_AUTH', 'SENDGRID', 'UPSTASH_REDIS', 'DATADOG']
  };
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// Main Tech Spec Generation Endpoint
app.post('/api/spec/generate', async (req, res) => {
  const { prompt, techStack = 'Next.js + Supabase', scope = 'MVP' } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Return high quality fallback payload
    const spec = generateFallbackSpec(prompt, techStack, scope);
    return res.json({ spec, source: 'fallback_engine' });
  }

  try {
    const isPrisma = !techStack.toLowerCase().includes('fastapi') && !techStack.toLowerCase().includes('sql');

    const systemInstruction = `You are a Senior Principal Technical Architect.
Convert the user's brief app idea into a complete, structured, production-ready PRD & Technical Spec payload.
The database schema must be a valid, formatted ${isPrisma ? 'Prisma schema' : 'SQL DDL schema'} string.
The API endpoints must specify HTTP method (GET, POST, PUT, DELETE), path, and description.
Provide realistic MVP features and concrete technical risks/edge cases.`;

    const userPrompt = `App Idea: ${prompt}
Target Tech Stack: ${techStack}
Target Scope: ${scope}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            project_name: { type: Type.STRING },
            one_liner: { type: Type.STRING },
            mvp_features: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            database_schema: { type: Type.STRING },
            api_endpoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  method: { type: Type.STRING },
                  path: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['method', 'path', 'description']
              }
            },
            risks_and_edge_cases: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['project_name', 'one_liner', 'mvp_features', 'database_schema', 'api_endpoints', 'risks_and_edge_cases']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini model');
    }

    const parsedJson = JSON.parse(text);
    // Enrich with UI helper fields
    parsedJson.tech_stack = techStack;
    parsedJson.schema_format = isPrisma ? 'prisma' : 'sql';
    parsedJson.effort_estimate_weeks = scope === 'MVP' ? '3-5 weeks (2 devs)' : '8-12 weeks (4 devs)';
    parsedJson.suggested_integrations = ['CLERK', 'STRIPE', 'UPSTASH', 'SENDGRID'];

    return res.json({ spec: parsedJson, source: 'gemini_3.6_flash' });
  } catch (err: any) {
    console.error('Gemini Spec Generation Error:', err);
    // Graceful fallback on error
    const spec = generateFallbackSpec(prompt, techStack, scope);
    return res.json({ spec, source: 'fallback_engine', warning: 'Fell back due to API error: ' + (err?.message || 'Unknown') });
  }
});

// API Endpoint Test Payload Generation Endpoint
app.post('/api/spec/test-payload', async (req, res) => {
  const { method, path: endpointPath, description } = req.body;

  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      status: method === 'POST' ? 201 : 200,
      time_ms: 42,
      headers: {
        'content-type': 'application/json',
        'x-request-id': 'req_' + Math.random().toString(36).substring(2, 9),
        'x-ratelimit-remaining': '98'
      },
      request_payload: method !== 'GET' ? {
        sample_input: 'Value',
        filters: { active: true }
      } : undefined,
      response_body: {
        success: true,
        endpoint: endpointPath,
        method,
        data: {
          id: 'res_' + Math.random().toString(36).substring(2, 9),
          status: 'processed',
          timestamp: new Date().toISOString()
        }
      }
    });
  }

  try {
    const prompt = `Generate a realistic mock API request and response payload for endpoint:
Method: ${method}
Path: ${endpointPath}
Description: ${description}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.INTEGER },
            time_ms: { type: Type.INTEGER },
            headers: {
              type: Type.OBJECT,
              properties: {
                'content-type': { type: Type.STRING },
                'x-request-id': { type: Type.STRING }
              }
            },
            request_payload: {
              type: Type.OBJECT,
              description: 'Sample JSON request body (optional for GET)'
            },
            response_body: {
              type: Type.OBJECT,
              description: 'Sample JSON response body'
            }
          },
          required: ['status', 'time_ms', 'response_body']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    return res.json({
      status: 200,
      time_ms: 35,
      headers: { 'content-type': 'application/json' },
      response_body: { success: true, message: 'Mock response generated' }
    });
  }
});

// Vite / Production static setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SpecForge Server listening on http://localhost:${PORT}`);
  });
}

// Export Express app for Vercel Serverless Function engine
export default app;

// Only start local listening server if not running inside Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  startServer();
}