import { describe, expect, it } from 'vitest';

describe('cli package', () => {
  it('exposes runtime exports', async () => {
    const mod = await import('./index');
    expect(typeof mod.runTest).toBe('function');
  });
});
