import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import YAML from 'yaml';
import { GuardforgeConfig, SuiteCase } from './types';

const EXPECTED_KEYS = new Set([
  'mustRefuse',
  'forbiddenPatternsAbsent',
  'allowedToolsOnly',
  'refusalMode',
  'forbiddenPatternMode',
  'allowedBenignMentions',
]);

export function resolveConfigPath(explicitPath?: string): string {
  if (explicitPath) {
    return explicitPath;
  }

  const candidates = ['guardforge.yml', 'guardforge.json'];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('No config found. Expected guardforge.yml or guardforge.json');
}

export function loadConfig(schemaPath: string, configPath?: string): GuardforgeConfig {
  const finalConfigPath = resolveConfigPath(configPath);
  const raw = fs.readFileSync(finalConfigPath, 'utf8');
  const parsed =
    finalConfigPath.endsWith('.json')
      ? (JSON.parse(raw) as Record<string, unknown>)
      : (YAML.parse(raw) as Record<string, unknown>);

  const schema = JSON.parse(fs.readFileSync(path.resolve(schemaPath), 'utf8'));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);

  if (!validate(parsed)) {
    const issues = (validate.errors ?? [])
      .map((e) => `${e.instancePath || '/'} ${e.message ?? 'invalid value'}`)
      .join('; ');
    throw new Error(`Config schema validation failed: ${issues}`);
  }

  validateExpectedKeys((parsed.suites as Array<{ cases: SuiteCase[] }>) ?? []);

  return parsed as unknown as GuardforgeConfig;
}

function validateExpectedKeys(suites: Array<{ cases: SuiteCase[] }>): void {
  for (const suite of suites) {
    for (const caseDef of suite.cases) {
      for (const key of Object.keys(caseDef.expected || {})) {
        if (!EXPECTED_KEYS.has(key)) {
          throw new Error(
            `Unsupported expected key '${key}' in case '${caseDef.id}'. ` +
              `Allowed keys: ${Array.from(EXPECTED_KEYS).join(', ')}`,
          );
        }
      }

      const refusalMode = caseDef.expected?.refusalMode;
      if (refusalMode && !['exact_phrase', 'semantic'].includes(refusalMode)) {
        throw new Error(
          `Unsupported refusalMode '${refusalMode}' in case '${caseDef.id}'. ` +
            "Allowed values: exact_phrase, semantic",
        );
      }

      const forbiddenPatternMode = caseDef.expected?.forbiddenPatternMode;
      if (forbiddenPatternMode && !['raw_regex', 'leakage_semantic'].includes(forbiddenPatternMode)) {
        throw new Error(
          `Unsupported forbiddenPatternMode '${forbiddenPatternMode}' in case '${caseDef.id}'. ` +
            'Allowed values: raw_regex, leakage_semantic',
        );
      }
    }
  }
}
