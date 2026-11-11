import { describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { ApiError } from './errors';
import { createApp, errorHandler, notFoundHandler } from './server';

describe('GET /health', () => {
  it('responds with status ok', async () => {
    const app = createApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('API error handling', () => {
  it('returns a JSON 404 envelope for unknown routes', async () => {
    const app = createApp();
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual({ code: 'NOT_FOUND', message: 'Route not found' });
  });

  it('returns a JSON 400 envelope for malformed JSON bodies', async () => {
    const app = createApp();
    const res = await request(app).post('/api/match').set('Content-Type', 'application/json').send('{"values": [');
    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({ code: 'BAD_REQUEST', message: 'Malformed JSON body' });
  });

  it('returns a JSON 413 envelope when the body exceeds the size limit', async () => {
    const app = createApp();
    const res = await request(app).post('/api/match').set('Content-Type', 'application/json').send('x'.repeat(1024 * 1024));
    expect(res.status).toBe(413);
    expect(res.body.error).toEqual({ code: 'PAYLOAD_TOO_LARGE', message: 'Request body too large' });
  });

  it('returns a generic JSON 500 envelope for unexpected errors without leaking internals', async () => {
    const app = express();
    app.get('/api/__boom', () => {
      throw new Error('boom: db password hunter2');
    });
    app.use(notFoundHandler);
    app.use(errorHandler);
    const res = await request(app).get('/api/__boom');
    expect(res.status).toBe(500);
    expect(res.body.error).toEqual({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
  });
});

describe('App configuration', () => {
  it('applies the configured body limit when creating the app', async () => {
    const app = createApp({ port: 3000, host: '127.0.0.1', nodeEnv: 'test', bodyLimitBytes: 1024 });
    const res = await request(app).post('/api/match').set('Content-Type', 'application/json').send('x'.repeat(2048));
    expect(res.status).toBe(413);
  });
});

describe('Typed API errors', () => {
  it('maps a typed ApiError validation failure to its own status and code', async () => {
    const app = express();
    app.get('/api/__validate', () => {
      throw new ApiError(422, 'VALIDATION_ERROR', 'Workout times are required');
    });
    app.use(notFoundHandler);
    app.use(errorHandler);
    const res = await request(app).get('/api/__validate');
    expect(res.status).toBe(422);
    expect(res.body.error).toEqual({ code: 'VALIDATION_ERROR', message: 'Workout times are required' });
  });

  it('maps a client error that carries an explicit status and code to that precise status and code', async () => {
    const app = express();
    app.get('/api/__client-error', () => {
      const err = new Error('Values must not be empty') as Error & { status: number; code: string };
      err.status = 422;
      err.code = 'VALIDATION_ERROR';
      throw err;
    });
    app.use(notFoundHandler);
    app.use(errorHandler);
    const res = await request(app).get('/api/__client-error');
    expect(res.status).toBe(422);
    expect(res.body.error).toEqual({ code: 'VALIDATION_ERROR', message: 'Values must not be empty' });
  });
});

describe('Error request correlation', () => {
  it('returns an X-Request-Id response header on error responses', async () => {
    const app = createApp();
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('logs structured error details with the error status and code', async () => {
    const app = express();
    app.get('/api/__boom', () => {
      throw new Error('boom: db password hunter2');
    });
    app.use(notFoundHandler);
    app.use(errorHandler);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(app).get('/api/__boom');
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(logged.status).toBe(500);
    expect(logged.code).toBe('INTERNAL_ERROR');
    expect(logged.method).toBe('GET');
    expect(logged.path).toBe('/api/__boom');
    consoleSpy.mockRestore();
  });
});
