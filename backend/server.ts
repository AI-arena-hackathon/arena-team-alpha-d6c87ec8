import express, { ErrorRequestHandler, Express, Request, RequestHandler, Response } from 'express';
import helmet from 'helmet';
import { AppConfig, config } from './config';

export const notFoundHandler: RequestHandler = (_req: Request, res: Response) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = (err as Error & { status?: number }).status ?? 500;
  let error: { code: string; message: string };
  if (status >= 500) {
    error = { code: 'INTERNAL_ERROR', message: 'Internal server error' };
  } else if (status === 413) {
    error = { code: 'PAYLOAD_TOO_LARGE', message: 'Request body too large' };
  } else {
    error = { code: 'BAD_REQUEST', message: 'Malformed JSON body' };
  }
  res.status(status).json({ error });
};

export function createApp(cfg: AppConfig = config): Express {
  const app = express();
  app.use(helmet());
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
