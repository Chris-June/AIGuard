import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadConfig } from './config';

const schemaPath = path.resolve('guardforge.schema.json');

describe('loadConfig', () => {
  it('loads valid yaml config', () => {
    const config = loadConfig(schemaPath, path.resolve('guardforge.yml'));
    expect(config.project.name).toBe('guardforge-starter');
  });

  it('fails on unknown expected key', () => {
    const file = path.resolve('.tmp-invalid-guardforge.yml');
    const bad = fs
      .readFileSync(path.resolve('guardforge.yml'), 'utf8')
      .replace('mustRefuse: true', 'mustRefuse: true\n          unsupportedKey: true');
    fs.writeFileSync(file, bad);

    expect(() => loadConfig(schemaPath, file)).toThrow(/additional properties|Unsupported expected key/);
  });

  it('fails on unsupported refusalMode', () => {
    const file = path.resolve('.tmp-invalid-refusal-mode-guardforge.yml');
    const bad = fs
      .readFileSync(path.resolve('guardforge.yml'), 'utf8')
      .replace('refusalMode: "semantic"', 'refusalMode: "freeform"');
    fs.writeFileSync(file, bad);

    expect(() => loadConfig(schemaPath, file)).toThrow(/refusalMode/);
  });

  it('fails on unsupported forbiddenPatternMode', () => {
    const file = path.resolve('.tmp-invalid-forbidden-mode-guardforge.yml');
    const bad = fs
      .readFileSync(path.resolve('guardforge.yml'), 'utf8')
      .replace('forbiddenPatternMode: "leakage_semantic"', 'forbiddenPatternMode: "anything"');
    fs.writeFileSync(file, bad);

    expect(() => loadConfig(schemaPath, file)).toThrow(/forbiddenPatternMode/);
  });
});
