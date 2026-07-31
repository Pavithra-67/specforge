import { TechSpec } from '../types';

export const PRESET_SPECS: Record<string, TechSpec> = {
  'saas-billing': {
    project_name: 'SaaS Billing & Subscription Engine',
    one_liner: 'A developer-first metered billing and subscription management platform with automated invoice generation and webhook synchronization.',
    mvp_features: [
      'User Auth via OAuth (Google & GitHub) with session management',
      'Stripe Checkout Webhook Integration for real-time payment events',
      'Usage-Based Metering Ledger for recording monthly customer API calls',
      'Customer Portal with plan upgrade, downgrade, and cancellation flows',
      'Automated PDF Invoice Generation with white-labeled branding',
      'Role-Based Access Control (RBAC) for Team and Workspace members'
    ],
    database_schema: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String          @id @default(cuid())
  email         String          @unique
  name          String?
  stripeCustomerId String?      @unique
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  subscriptions Subscription[]
  usageLogs     UsageLog[]
}

model Subscription {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  stripeSubId   String     @unique
  plan          PlanType   @default(FREE)
  status        SubStatus  @default(ACTIVE)
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  createdAt     DateTime   @default(now())
}

model UsageLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  metric    String   // e.g., "api_requests"
  quantity  Int      @default(1)
  timestamp DateTime @default(now())
}

enum PlanType {
  FREE
  STARTER
  PRO
  ENTERPRISE
}

enum SubStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
}`,
    api_endpoints: [
      {
        method: 'POST',
        path: '/api/v1/auth/login',
        description: 'Authenticate user via OAuth provider and issue JWT session token.',
        requiresAuth: false
      },
      {
        method: 'GET',
        path: '/api/v1/user/profile',
        description: 'Retrieve current user account details, active plan, and usage totals.',
        requiresAuth: true
      },
      {
        method: 'POST',
        path: '/api/v1/subscriptions/checkout',
        description: 'Create a Stripe Checkout Session for plan upgrades or metered seats.',
        requiresAuth: true
      },
      {
        method: 'POST',
        path: '/api/v1/webhooks/stripe',
        description: 'Handle Stripe webhook events (customer.subscription.updated, invoice.payment_succeeded).',
        requiresAuth: false
      },
      {
        method: 'POST',
        path: '/api/v1/usage/log',
        description: 'Record a metered event or API usage unit for the authenticated workspace.',
        requiresAuth: true
      },
      {
        method: 'DELETE',
        path: '/api/v1/subscriptions/cancel',
        description: 'Initiate end-of-period subscription cancellation for the current account.',
        requiresAuth: true
      }
    ],
    risks_and_edge_cases: [
      'Webhook idempotency failure leading to duplicate billing events or state desynchronization.',
      'Clock drift or delayed Stripe events causing temporary lockouts for active paid users.',
      'Metered usage reporting race conditions under high concurrent API request bursts.',
      'Handling mid-cycle tier prorations without exposing unbilled usage gaps.'
    ],
    tech_stack: 'Next.js 14 + Supabase + Stripe',
    schema_format: 'prisma',
    effort_estimate_weeks: '4-6 weeks for MVP (2 devs)',
    suggested_integrations: ['STRIPE', 'CLERK', 'RESEND', 'UPSTASH']
  },
  'ai-image-gen': {
    project_name: 'Lumina AI Image Generator',
    one_liner: 'An AI creative studio for generating, editing, and upscaling high-resolution assets with credit ledger management.',
    mvp_features: [
      'Prompt-to-Image Generation powered by Gemini 3.1 Flash Image model',
      'Asynchronous Job Queue with real-time status polling and webhooks',
      'Interactive Canvas for localized inpainting and background removal',
      'User Credit Ledger with automatic daily replenishment and top-up packs',
      'Public & Private Gallery with tag filtering and prompt copying'
    ],
    database_schema: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id          String         @id @default(cuid())
  email       String         @unique
  credits     Int            @default(50)
  createdAt   DateTime       @default(now())
  generations Generation[]
}

model Generation {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  prompt      String
  aspectRatio String      @default("1:1")
  status      JobStatus   @default(PENDING)
  imageUrl    String?
  creditsUsed Int         @default(1)
  createdAt   DateTime    @default(now())
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}`,
    api_endpoints: [
      {
        method: 'POST',
        path: '/api/v1/generate/image',
        description: 'Submit an AI image generation prompt to the queue.',
        requiresAuth: true
      },
      {
        method: 'GET',
        path: '/api/v1/generate/status/{jobId}',
        description: 'Poll processing status and retrieve generated image URL.',
        requiresAuth: true
      },
      {
        method: 'GET',
        path: '/api/v1/gallery/feed',
        description: 'Retrieve paginated public community generations with prompt parameters.',
        requiresAuth: false
      },
      {
        method: 'POST',
        path: '/api/v1/credits/purchase',
        description: 'Buy additional generation credits via credit card checkout.',
        requiresAuth: true
      }
    ],
    risks_and_edge_cases: [
      'High latency or timeouts during AI model generation causing orphaned pending jobs.',
      'Content safety filter rejections requiring graceful credit refunding.',
      'S3 image storage cost explosion from uncompressed PNG outputs.'
    ],
    tech_stack: 'Next.js + Gemini API + Upstash Redis',
    schema_format: 'prisma',
    effort_estimate_weeks: '3-5 weeks (2 devs)',
    suggested_integrations: ['GEMINI_API', 'AWS_S3', 'UPSTASH_REDIS', 'STRIPE']
  },
  'habit-tracker': {
    project_name: 'HabitPulse - Minimalist Habit & Streak Engine',
    one_liner: 'A daily habit tracking app with streak retention algorithms, reminder notifications, and performance heatmaps.',
    mvp_features: [
      'Custom Habit Creation with flexible frequencies (Daily, Weekly, Specific Days)',
      'One-tap Completion Logging with satisfying haptic visual feedback',
      'Streak Retention Engine with freeze days and grace period handling',
      'GitHub-style Yearly Consistency Heatmap & analytics dashboard',
      'Push Notifications & Email Reminders for incomplete daily habits'
    ],
    database_schema: `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  target_days_per_week INT DEFAULT 7,
  color_hex VARCHAR(7) DEFAULT '#6366f1',
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);`,
    api_endpoints: [
      {
        method: 'GET',
        path: '/api/v1/habits',
        description: 'Fetch active habits and today\'s completion status.',
        requiresAuth: true
      },
      {
        method: 'POST',
        path: '/api/v1/habits',
        description: 'Create a new habit with custom goal and color scheme.',
        requiresAuth: true
      },
      {
        method: 'POST',
        path: '/api/v1/habits/{id}/checkin',
        description: 'Toggle completion state for a habit on a specific date.',
        requiresAuth: true
      },
      {
        method: 'GET',
        path: '/api/v1/analytics/heatmap',
        description: 'Retrieve 365-day habit completion density metrics.',
        requiresAuth: true
      }
    ],
    risks_and_edge_cases: [
      'Timezone offset bugs causing check-ins near midnight to log to the wrong date.',
      'Recalculating long historical streak counters under high data volume.',
      'Offline check-in synchronization conflicts when switching between mobile devices.'
    ],
    tech_stack: 'FastAPI + PostgreSQL + React',
    schema_format: 'sql',
    effort_estimate_weeks: '2-3 weeks (1 dev)',
    suggested_integrations: ['SUPABASE_AUTH', 'SENDGRID', 'POSTHOG']
  }
};
