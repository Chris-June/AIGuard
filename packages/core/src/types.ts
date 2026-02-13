export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface GenerationInput {
  userPrompt: string;
  systemInstructions?: string;
  context?: unknown[];
  toolMetadata?: Array<{
    name: string;
    description?: string;
    inputSchema?: Record<string, unknown>;
  }>;
  model: {
    id: string;
    temperature?: number;
    maxOutputTokens?: number;
  };
}

export interface ToolCallRecord {
  name: string;
  arguments: Record<string, unknown>;
  status: 'attempted' | 'executed' | 'blocked' | 'failed';
  result?: unknown;
  error?: string;
}

export interface GenerationResult {
  outputText: string;
  structuredOutput?: unknown;
  toolCalls: ToolCallRecord[];
  metadata?: Record<string, unknown>;
}

export interface ModelAdapter {
  generate(input: GenerationInput): Promise<GenerationResult>;
}

export interface RuleResult {
  ruleId: string;
  passed: boolean;
  severity: Severity;
  evidence: Record<string, unknown>;
  message: string;
}

export interface Rule {
  evaluate(observation: Observation): RuleResult[];
}

export interface CaseExpected {
  mustRefuse?: boolean;
  forbiddenPatternsAbsent?: string[];
  allowedToolsOnly?: boolean;
  refusalMode?: 'exact_phrase' | 'semantic';
  forbiddenPatternMode?: 'raw_regex' | 'leakage_semantic';
  allowedBenignMentions?: string[];
}

export interface SuiteCase {
  id: string;
  severity: Severity;
  system?: string;
  prompt: string;
  context?: unknown[];
  expected: CaseExpected;
}

export interface Suite {
  id: string;
  description?: string;
  tags?: string[];
  cases: SuiteCase[];
}

export interface GuardforgeConfig {
  project: {
    name: string;
    version: string;
    description?: string;
  };
  adapter: {
    provider: 'openai';
    implementation: string;
    timeoutMs?: number;
    retries?: number;
  };
  models: {
    primary: {
      id: string;
      temperature?: number;
      maxOutputTokens?: number;
    };
    judge: {
      enabled: boolean;
      id: string;
      temperature?: number;
      maxOutputTokens?: number;
    };
  };
  policies: {
    refusal: {
      requiredPhrases: string[];
      minMatches: number;
      semantic: {
        denyPhrases: string[];
        alternativeHelpPhrases: string[];
      };
    };
    forbiddenOutputs: {
      patterns: string[];
      semantic: {
        credentialAssignmentPatterns: string[];
        credentialPrefixPatterns: string[];
        benignContextPatterns: string[];
      };
    };
    tools: {
      mode: 'deny_by_default';
      allowlist: string[];
      argumentSchemas?: Record<string, unknown>;
    };
  };
  suites: Suite[];
  reporters: {
    outputs: Array<{
      format: 'json' | 'junit' | 'html';
      path: string;
      optional?: boolean;
    }>;
  };
  thresholds: {
    failOnSeverities: Severity[];
    maxAllowedBySeverity: Partial<Record<Severity, number>>;
  };
  ci: {
    requiredSteps: string[];
    publishArtifacts: Array<'json' | 'junit' | 'html'>;
    optionalArtifacts?: Array<'json' | 'junit' | 'html'>;
    failOnThresholdBreach: boolean;
  };
}

export interface Observation {
  config: GuardforgeConfig;
  suiteId: string;
  caseDef: SuiteCase;
  generation: GenerationResult;
}

export interface Violation {
  suiteId: string;
  caseId: string;
  ruleId: string;
  severity: Severity;
  message: string;
  evidence: Record<string, unknown>;
}

export interface CaseReport {
  suiteId: string;
  caseId: string;
  severity: Severity;
  passed: boolean;
  ruleResults: RuleResult[];
  toolCalls: ToolCallRecord[];
  outputText: string;
  durationMs: number;
}

export type RunStatus = 'pass' | 'fail';

export interface RunReport {
  project: {
    name: string;
    version: string;
  };
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: RunStatus;
  totals: {
    cases: number;
    passed: number;
    failed: number;
    violationsBySeverity: Record<Severity, number>;
  };
  violations: Violation[];
  cases: CaseReport[];
  metadata: {
    adapter: string;
    model: string;
  };
}

export interface ToolRegistry {
  [name: string]: (args: Record<string, unknown>) => Promise<unknown> | unknown;
}

export interface RunOptions {
  suites?: Suite[];
  rules: Rule[];
  adapter: ModelAdapter;
  config: GuardforgeConfig;
  tools?: ToolRegistry;
}
