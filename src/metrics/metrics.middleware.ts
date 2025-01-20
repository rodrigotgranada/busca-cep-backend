import { Injectable, NestMiddleware } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: any, res: any, next: () => void) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      this.metricsService.incrementHttpRequest(
        req.method,
        res.statusCode.toString(),
        req.route?.path || req.url,
      );

      this.metricsService.recordHttpRequestDuration(
        duration,
        req.method,
        res.statusCode.toString(),
        req.route?.path || req.url,
      );
    });

    next();
  }
}
