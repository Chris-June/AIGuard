import path from 'node:path';
import {
  filterSuitesByTag,
  GuardforgeConfig,
  loadConfig,
  runSuites,
  RunReport,
  ToolRegistry,
} from '@guardforge/core';
import { OpenAIResponsesAdapter } from '@guardforge/adapters-openai';
import { buildDeterministicRules } from '@guardforge/rules';
import { writeReports } from '@guardforge/reporter';

export interface CommandOptions {
  config?: string;
  schema?: string;
  reportInput?: string;
  tag?: string;
}

export async function runInit(): Promise<void> {
  const source = path.resolve('guardforge.yml');
  const fs = await import('node:fs');
  if (!fs.existsSync(source)) {
    throw new Error('guardforge.yml not found in repository root to scaffold from');
  }

  const target = path.resolve('guardforge.generated.yml');
  fs.copyFileSync(source, target);
  console.log(`Created starter config at ${target}`);
}

export async function runTest(options: CommandOptions = {}): Promise<RunReport> {
  const schemaPath = options.schema ?? path.resolve('guardforge.schema.json');
  const config = loadConfig(schemaPath, options.config);

  ensureOpenAIMode(config);

  const adapter = new OpenAIResponsesAdapter({
    timeoutMs: config.adapter.timeoutMs,
    retries: config.adapter.retries,
  });

  const report = await runSuites({
    config,
    adapter,
    rules: buildDeterministicRules(),
    tools: getBuiltinTools(),
  });

  writeReports(report, config);
  printSummary(report);
  return report;
}

export async function runAttackRun(options: CommandOptions = {}): Promise<RunReport> {
  const schemaPath = options.schema ?? path.resolve('guardforge.schema.json');
  const config = loadConfig(schemaPath, options.config);
  ensureOpenAIMode(config);

  const attackTag = options.tag ?? 'security';
  const suites = filterSuitesByTag(config.suites, attackTag);

  const adapter = new OpenAIResponsesAdapter({
    timeoutMs: config.adapter.timeoutMs,
    retries: config.adapter.retries,
  });

  const report = await runSuites({
    config,
    suites,
    adapter,
    rules: buildDeterministicRules(),
    tools: getBuiltinTools(),
  });

  writeReports(report, config);
  printSummary(report);
  return report;
}

export async function runReportGenerate(options: CommandOptions = {}): Promise<void> {
  const fs = await import('node:fs');
  const schemaPath = options.schema ?? path.resolve('guardforge.schema.json');
  const config = loadConfig(schemaPath, options.config);

  const inputPath = options.reportInput ?? './artifacts/report.json';
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Run artifact not found: ${inputPath}`);
  }

  const report = JSON.parse(fs.readFileSync(inputPath, 'utf8')) as RunReport;
  writeReports(report, config);
  console.log('Reports generated from existing run artifact');
}

export async function runCiCheck(options: CommandOptions = {}): Promise<void> {
  const report = await runTest(options);
  if (report.status === 'fail') {
    process.exitCode = 1;
  }
}

function getBuiltinTools(): ToolRegistry {
  return {
    getWeather: ({ city }) => ({ city, weather: 'sunny', source: 'fixture' }),
    lookupDocs: ({ query }) => ({ query, results: ['docs-result-1'] }),
  };
}

function ensureOpenAIMode(config: GuardforgeConfig): void {
  if (config.adapter.provider !== 'openai') {
    throw new Error(`Unsupported adapter provider for MVP: ${config.adapter.provider}`);
  }
  if (!config.models.primary.id) {
    throw new Error('models.primary.id is required');
  }
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required');
  }
}

function printSummary(report: RunReport): void {
  console.log(
    `GuardForge ${report.status.toUpperCase()} | cases=${report.totals.cases} passed=${report.totals.passed} failed=${report.totals.failed}`,
  );
}
