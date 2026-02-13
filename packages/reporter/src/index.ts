import fs from 'node:fs';
import path from 'node:path';
import { GuardforgeConfig, RunReport } from '@guardforge/core';

export function writeReports(report: RunReport, config: GuardforgeConfig): void {
  for (const output of config.reporters.outputs) {
    if (output.format === 'json') {
      writeJsonReport(report, output.path);
    }

    if (output.format === 'junit') {
      writeJunitReport(report, output.path);
    }

    if (output.format === 'html') {
      writeHtmlReport(report, output.path);
    }
  }
}

export function writeJsonReport(report: RunReport, filePath: string): void {
  ensureParentDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
}

export function writeJunitReport(report: RunReport, filePath: string): void {
  ensureParentDir(filePath);

  const failures = report.totals.failed;
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<testsuite name="guardforge" tests="${report.totals.cases}" failures="${failures}" time="${(
      report.durationMs / 1000
    ).toFixed(3)}">`,
    ...report.cases.map((caseResult) => {
      const failedRules = caseResult.ruleResults.filter((r) => !r.passed);
      const failure = failedRules[0]
        ? `<failure message="${escapeXml(failedRules[0].message)}">${escapeXml(
            JSON.stringify(failedRules[0].evidence),
          )}</failure>`
        : '';
      return `<testcase classname="${escapeXml(caseResult.suiteId)}" name="${escapeXml(
        caseResult.caseId,
      )}" time="${(caseResult.durationMs / 1000).toFixed(3)}">${failure}</testcase>`;
    }),
    '</testsuite>',
  ].join('');

  fs.writeFileSync(filePath, xml);
}

export function writeHtmlReport(report: RunReport, filePath: string): void {
  ensureParentDir(filePath);
  const rows = report.cases
    .map(
      (c) => `<tr>
<td>${escapeHtml(c.suiteId)}</td>
<td>${escapeHtml(c.caseId)}</td>
<td>${c.passed ? 'PASS' : 'FAIL'}</td>
<td>${escapeHtml(c.outputText)}</td>
</tr>`,
    )
    .join('\n');

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GuardForge Report</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 24px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
  </style>
</head>
<body>
<h1>GuardForge Report</h1>
<p>Status: <strong>${report.status.toUpperCase()}</strong></p>
<p>Cases: ${report.totals.cases} | Failed: ${report.totals.failed}</p>
<table>
  <thead>
    <tr><th>Suite</th><th>Case</th><th>Status</th><th>Output</th></tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
</body>
</html>`;

  fs.writeFileSync(filePath, html);
}

function ensureParentDir(filePath: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function escapeHtml(value: string): string {
  return escapeXml(value);
}
