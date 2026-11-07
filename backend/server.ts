import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export function createApp(): Express {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });
  return app;
}

export function start(): void {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`EchoFit API listening on port ${PORT}`);
  });
}

if (require.main === module) {
  start();
}
