#!/usr/bin/env node
import { Command } from 'commander';
import { runAttackRun, runCiCheck, runInit, runReportGenerate, runTest } from './runtime';

const program = new Command();
program.name('guardforge').description('GuardForge CLI');

program.command('init').action(async () => {
  await runInit();
});

program
  .command('test')
  .option('-c, --config <path>', 'Path to guardforge config')
  .option('-s, --schema <path>', 'Path to guardforge schema')
  .action(async (opts) => {
    await runTest(opts);
  });

program
  .command('attack')
  .description('Run attack-focused suites')
  .command('run')
  .option('-c, --config <path>', 'Path to guardforge config')
  .option('-s, --schema <path>', 'Path to guardforge schema')
  .option('-t, --tag <tag>', 'Suite tag to filter', 'security')
  .action(async (opts) => {
    await runAttackRun(opts);
  });

program
  .command('report')
  .description('Generate reports from an existing run artifact')
  .command('generate')
  .option('-c, --config <path>', 'Path to guardforge config')
  .option('-s, --schema <path>', 'Path to guardforge schema')
  .option('-i, --report-input <path>', 'Path to run report JSON')
  .action(async (opts) => {
    await runReportGenerate(opts);
  });

program
  .command('ci')
  .description('CI helper commands')
  .command('check')
  .option('-c, --config <path>', 'Path to guardforge config')
  .option('-s, --schema <path>', 'Path to guardforge schema')
  .action(async (opts) => {
    await runCiCheck(opts);
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
