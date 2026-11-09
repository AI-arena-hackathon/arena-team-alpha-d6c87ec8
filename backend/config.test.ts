import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, loadConfig } from './config';

describe('loadConfig', () => {
  it('returns the default configuration when no environment variables are set', () => {
    expect(loadConfig({})).toEqual(DEFAULT_CONFIG);
  });

  it('reads overrides from the environment source', () => {
    expect(
      loadConfig({
        PORT: '8080',
        HOST: '127.0.0.1',
        NODE_ENV: 'production',
        BODY_LIMIT: '2048',
      }),
    ).toEqual({
      port: 8080,
      host: '127.0.0.1',
      nodeEnv: 'production',
      bodyLimitBytes: 2048,
    });
  });

  it('falls back to defaults for invalid environment values', () => {
    expect(loadConfig({ PORT: 'not-a-port', NODE_ENV: 'staging', BODY_LIMIT: 'abc' })).toEqual(DEFAULT_CONFIG);
  });

  it('falls back to the default host when it is unset or blank', () => {
    expect(loadConfig({ HOST: '   ' }).host).toBe(DEFAULT_CONFIG.host);
  });
});
