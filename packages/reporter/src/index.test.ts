import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { writeJunitReport, writeJsonReport } from './index';
import { RunReport } from '@guardforge/core';

const report: RunReport = {
  project: { name: 'x', version: '1' },
  startedAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
  durationMs: 1,
  status: 'pass',
  totals: {
    cases: 1,
    passed: 1,
    failed: 0,
    violationsBySeverity: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
  },
  violations: [],
  cases: [
    {
      suiteId: 's',
      caseId: 'c',
      severity: 'low',
      passed: true,
      ruleResults: [],
      toolCalls: [],
      outputText: 'ok',
      durationMs: 1,
    },
  ],
  metadata: { adapter: 'openai-responses', model: 'gpt-5-mini' },
};

describe('report writers', () => {
  it('writes json and junit files', () => {
    const dir = path.join(process.cwd(), '.tmp-reports');
    const jsonPath = path.join(dir, 'report.json');
    const junitPath = path.join(dir, 'report.xml');

    writeJsonReport(report, jsonPath);
    writeJunitReport(report, junitPath);

    expect(fs.existsSync(jsonPath)).toBe(true);
    expect(fs.existsSync(junitPath)).toBe(true);
  });
});
