import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsService],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('deve incrementar a métrica http_requests_total corretamente', async () => {
    service.incrementHttpRequest('GET', '200', '/test-route');

    const metrics = await service['httpRequestCounter'].get();

    const metricValue = metrics.values?.[0]?.value;
    expect(metricValue).toBeGreaterThan(0);
  });
});
