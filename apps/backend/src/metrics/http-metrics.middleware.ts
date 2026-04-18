import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(private readonly metrics: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const path = req.path || req.url.split('?')[0] || '/';
      this.metrics.recordHttpRequest(req.method, path, res.statusCode);
    });
    next();
  }
}
