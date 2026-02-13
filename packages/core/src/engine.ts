import Ajv from 'ajv';
import {
  CaseReport,
  GuardforgeConfig,
  RunOptions,
  RunReport,
  RuleResult,
  Severity,
  Suite,
  ToolCallRecord,
} from './types';
import { evaluateRunStatus } from './thresholds';

const severityOrder: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

export async function runSuites(options: RunOptions): Promise<RunReport> {
  const startedAt = new Date();
  const suites = options.suites ?? options.config.suites;
  const caseReports: CaseReport[] = [];
  const violationsBySeverity: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  for (const suite of suites) {
    for (const caseDef of suite.cases) {
      const caseStart = Date.now();
      const generation = await options.adapter.generate({
        userPrompt: caseDef.prompt,
        systemInstructions: caseDef.system,
        context: caseDef.context,
        model: options.config.models.primary,
        toolMetadata: options.config.policies.tools.allowlist.map((toolName) => ({
          name: toolName,
          inputSchema: options.config.policies.tools.argumentSchemas?.[toolName] as
            | Record<string, unknown>
            | undefined,
        })),
      });

      const toolCalls = await handleToolCalls(generation.toolCalls, options.config, options.tools);
      generation.toolCalls = toolCalls;

      const ruleResults: RuleResult[] = [];
      for (const rule of options.rules) {
        ruleResults.push(...rule.evaluate({ config: options.config, suiteId: suite.id, caseDef, generation }));
      }

      for (const result of ruleResults) {
        if (!result.passed) {
          violationsBySeverity[result.severity] += 1;
        }
      }

      caseReports.push({
        suiteId: suite.id,
        caseId: caseDef.id,
        severity: caseDef.severity,
        passed: ruleResults.every((r) => r.passed),
        ruleResults,
        toolCalls,
        outputText: generation.outputText,
        durationMs: Date.now() - caseStart,
      });
    }
  }

  const completedAt = new Date();
  const baseReport = {
    project: {
      name: options.config.project.name,
      version: options.config.project.version,
    },
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    durationMs: completedAt.getTime() - startedAt.getTime(),
    totals: {
      cases: caseReports.length,
      passed: caseReports.filter((c) => c.passed).length,
      failed: caseReports.filter((c) => !c.passed).length,
      violationsBySeverity,
    },
    violations: flattenViolations(caseReports),
    cases: caseReports,
    metadata: {
      adapter: options.config.adapter.implementation,
      model: options.config.models.primary.id,
    }
  };

  const status = evaluateRunStatus(
    violationsBySeverity,
    options.config.thresholds.maxAllowedBySeverity,
    options.config.ci.failOnThresholdBreach,
  );
  return {
    ...baseReport,
    status,
  };
}

function flattenViolations(caseReports: CaseReport[]) {
  return caseReports.flatMap((caseReport) =>
    caseReport.ruleResults
      .filter((r) => !r.passed)
      .map((r) => ({
        suiteId: caseReport.suiteId,
        caseId: caseReport.caseId,
        ruleId: r.ruleId,
        severity: r.severity,
        message: r.message,
        evidence: r.evidence,
      })),
  );
}

async function handleToolCalls(
  calls: ToolCallRecord[],
  config: GuardforgeConfig,
  tools: RunOptions['tools'],
): Promise<ToolCallRecord[]> {
  const ajv = new Ajv({ strict: false });
  const result: ToolCallRecord[] = [];

  for (const call of calls) {
    if (!config.policies.tools.allowlist.includes(call.name)) {
      result.push({ ...call, status: 'blocked', error: 'Tool is not allowlisted' });
      continue;
    }

    const schema = config.policies.tools.argumentSchemas?.[call.name] as
      | Record<string, unknown>
      | undefined;
    if (schema) {
      const validate = ajv.compile(schema);
      const valid = validate(call.arguments);
      if (!valid) {
        result.push({
          ...call,
          status: 'blocked',
          error: `Invalid tool arguments: ${(validate.errors ?? [])
            .map((e) => `${e.instancePath || '/'} ${e.message ?? 'invalid'}`)
            .join(', ')}`,
        });
        continue;
      }
    }

    if (!tools?.[call.name]) {
      result.push({ ...call, status: 'failed', error: 'Tool implementation not registered' });
      continue;
    }

    try {
      const toolResult = await tools[call.name](call.arguments);
      result.push({ ...call, status: 'executed', result: toolResult });
    } catch (error) {
      result.push({
        ...call,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return result;
}

export function filterSuitesByTag(suites: Suite[], tag?: string): Suite[] {
  if (!tag) {
    return suites;
  }
  return suites.filter((suite) => suite.tags?.includes(tag));
}

export function countSeverityViolations(caseReports: CaseReport[]): Record<Severity, number> {
  const counts: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  for (const severity of severityOrder) {
    counts[severity] = caseReports
      .flatMap((r) => r.ruleResults)
      .filter((r) => !r.passed && r.severity === severity).length;
  }

  return counts;
}
