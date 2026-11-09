export type NodeEnv = 'development' | 'test' | 'production';

export interface AppConfig {
  readonly port: number;
  readonly host: string;
  readonly nodeEnv: NodeEnv;
  readonly bodyLimitBytes: number;
}

export interface ConfigSource {
  readonly PORT?: string;
  readonly HOST?: string;
  readonly NODE_ENV?: string;
  readonly BODY_LIMIT?: string;
}

export const DEFAULT_CONFIG: AppConfig = {
  port: 3000,
  host: '0.0.0.0',
  nodeEnv: 'development',
  bodyLimitBytes: 1024 * 100,
};

const VALID_NODE_ENVS: readonly NodeEnv[] = ['development', 'test', 'production'];

function resolvePort(raw: string | undefined): number {
  const parsed = raw === undefined ? Number.NaN : Number(raw);
  const isValid = Number.isInteger(parsed) && parsed >= 1 && parsed <= 65535;
  return isValid ? parsed : DEFAULT_CONFIG.port;
}

function resolveHost(raw: string | undefined): string {
  const trimmed = raw?.trim();
  const isValid = trimmed !== undefined && trimmed.length > 0;
  return isValid ? trimmed : DEFAULT_CONFIG.host;
}

function resolveNodeEnv(raw: string | undefined): NodeEnv {
  const value = raw?.toLowerCase() as NodeEnv | undefined;
  const isValid = value !== undefined && VALID_NODE_ENVS.includes(value);
  return isValid ? value : 'development';
}

function resolveBodyLimitBytes(raw: string | undefined): number {
  const parsed = raw === undefined ? Number.NaN : Number(raw);
  const isValid = Number.isInteger(parsed) && parsed > 0;
  return isValid ? parsed : DEFAULT_CONFIG.bodyLimitBytes;
}

export function loadConfig(source: ConfigSource = process.env): AppConfig {
  return {
    port: resolvePort(source.PORT),
    host: resolveHost(source.HOST),
    nodeEnv: resolveNodeEnv(source.NODE_ENV),
    bodyLimitBytes: resolveBodyLimitBytes(source.BODY_LIMIT),
  };
}

export const config: AppConfig = loadConfig();
