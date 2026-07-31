export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  requiresAuth?: boolean;
}

export interface TechSpec {
  project_name: string;
  one_liner: string;
  mvp_features: string[];
  database_schema: string;
  api_endpoints: ApiEndpoint[];
  risks_and_edge_cases: string[];
  // Extended UI fields
  tech_stack?: string;
  schema_format?: 'prisma' | 'sql';
  effort_estimate_weeks?: string;
  suggested_integrations?: string[];
  created_at?: string;
}

export interface GeneratorParams {
  prompt: string;
  techStack: string;
  scope: 'MVP' | 'PRODUCTION';
  inclusions: {
    coreFeatures: boolean;
    dbSchema: boolean;
    apiRoutes: boolean;
    edgeCases: boolean;
  };
}

export interface ApiTestResponse {
  status: number;
  time_ms: number;
  headers: Record<string, string>;
  request_payload?: Record<string, any>;
  response_body: Record<string, any>;
}
