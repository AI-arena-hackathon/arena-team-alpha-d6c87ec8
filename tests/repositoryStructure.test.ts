import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();

describe('repository structure', () => {
  it('exposes an executable start script that boots the API server', () => {
    const startScript = `${ROOT}/start.sh`;
    expect(existsSync(startScript)).toBe(true);
    expect(statSync(startScript).mode & 0o111).toBe(0o111);
    expect(readFileSync(startScript, 'utf8')).toContain('npm start');
  });

  it('documents the quickstart commands in the README', () => {
    const readme = readFileSync(`${ROOT}/README.md`, 'utf8');
    expect(readme).toContain('npm ci');
    expect(readme).toContain('npm start');
    expect(readme).toContain('cp .env.example .env');
  });

  it('replaces the backlog idea placeholder with a real one-line summary', () => {
    const backlog = readFileSync(`${ROOT}/BACKLOG.md`, 'utf8');
    expect(backlog).not.toContain('IDEA:');
  });
});
