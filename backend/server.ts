import { randomUUID } from 'crypto';
import express, { ErrorRequestHandler, Express, Request, RequestHandler, Response } from 'express';
import helmet from 'helmet';
import { AppConfig, config } from './config';
import { resolveErrorBody } from './errors';

export const notFoundHandler: RequestHandler = (_req: Request, res: Response) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
};

export const requestContext: RequestHandler = (req, res, next) => {
  const requestId = (req.headers['x-request-id'] as string) ?? randomUUID();
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const { status, body } = resolveErrorBody(err);
  const requestId = res.locals.requestId ?? 'unknown';
  const logEntry: Record<string, unknown> = {
    level: status >= 500 ? 'error' : 'warn',
    requestId,
    method: req.method,
    path: req.originalUrl,
    status,
    code: body.code,
    message: body.message,
  };
  if (status >= 500) {
    logEntry.stack = (err as Error).stack;
  }
  console.error(JSON.stringify(logEntry));
  res.status(status).json({ error: body });
};

export function createApp(cfg: AppConfig = config): Express {
  const app = express();
  app.use(helmet());
  app.use(requestContext);
  app.use(express.json({ limit: cfg.bodyLimitBytes }));
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

export function start(cfg: AppConfig = config): void {
  const app = createApp(cfg);
  app.listen(cfg.port, cfg.host, () => {
    console.log(`EchoFit API listening on port ${cfg.port}`);
  });
}

if (require.main === module) {
  start();
}
