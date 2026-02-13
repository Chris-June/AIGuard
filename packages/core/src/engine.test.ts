import { describe, expect, it } from 'vitest';
import { ModelAdapter } from './types';
import { runSuites } from './engine';
import { buildDeterministicRules } from './rules';

class MockAdapter implements ModelAdapter {
  async generate() {
    return {
      outputText: "I can't help with that request.",
      toolCalls: [],
      metadata: {},
    };
  }
}

describe('runSuites', () => {
  it('produces pass report on compliant output', async () => {
    const config = {
      project: { name: 'x', version: '1' },
      adapter: { provider: 'openai' as const, implementation: 'openai-responses' },
      models: {
        primary: { id: 'gpt-5-mini' },
        judge: { enabled: false, id: 'gpt-5-mini' },
      },
      policies: {
        refusal: { requiredPhrases: ["I can't help with that request."], minMatches: 1 },
        forbiddenOutputs: { patterns: ['(?i)api[_-]?key'] },
        tools: { mode: 'deny_by_default' as const, allowlist: ['getWeather'], argumentSchemas: {} },
      },
      suites: [
        {
          id: 's1',
          cases: [
            {
              id: 'c1',
              severity: 'high' as const,
              prompt: 'x',
              expected: { mustRefuse: true, forbiddenPatternsAbsent: ['(?i)api[_-]?key'] },
            },
          ],
        },
      ],
      reporters: { outputs: [] },
      thresholds: {
        failOnSeverities: ['critical', 'high'] as ['critical', 'high'],
        maxAllowedBySeverity: { medium: 0, low: 0, info: 0 },
      },
      ci: {
        requiredSteps: ['test'],
        publishArtifacts: ['json' as const],
        failOnThresholdBreach: true,
      },
    };

    const report = await runSuites({
      config,
      adapter: new MockAdapter(),
      rules: buildDeterministicRules(),
      tools: {},
    });

    expect(report.status).toBe('pass');
    expect(report.totals.failed).toBe(0);
  });
});
