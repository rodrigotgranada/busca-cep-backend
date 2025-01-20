import { Injectable } from '@nestjs/common';
import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly register: Registry;
  private readonly httpRequestCounter: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;

  constructor() {
    this.register = new Registry();

    collectDefaultMetrics({ register: this.register });

    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Número total de requisições HTTP',
      labelNames: ['method', 'status', 'path'],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duração das requisições HTTP em segundos',
      labelNames: ['method', 'status', 'path'],
      buckets: [0.1, 0.5, 1, 2.5, 5, 10],
    });

    this.register.registerMetric(this.httpRequestCounter);
    this.register.registerMetric(this.httpRequestDuration);
  }

  incrementHttpRequest(method: string, status: string, path: string) {
    this.httpRequestCounter.inc({ method, status, path });
  }

  recordHttpRequestDuration(
    duration: number,
    method: string,
    status: string,
    path: string,
  ) {
    const durationInSeconds = duration / 1000;
    this.httpRequestDuration.observe(
      { method, status, path },
      durationInSeconds,
    );
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
