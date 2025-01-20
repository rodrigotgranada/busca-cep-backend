import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Metrics E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/metrics (GET)', async () => {
    // Faz uma requisição para o endpoint /health antes
    await request(app.getHttpServer()).get('/health').expect(200);

    // Adiciona um delay para garantir que as métricas sejam atualizadas
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Faz a requisição para o endpoint de métricas
    const response = await request(app.getHttpServer()).get('/metrics');

    expect(response.status).toBe(200);

    // Busca a métrica esperada usando regex para flexibilidade
    const metricLine = response.text
      .split('\n')
      .find((line) =>
        line.includes(
          'http_requests_total{method="GET",status="200",path="/health"}',
        ),
      );

    // Valida se a métrica está presente
    expect(metricLine).toBeTruthy();

    // Verifica se o valor da métrica é pelo menos 1
    const metricValue = metricLine?.match(/ (\d+)$/)?.[1];
    expect(metricValue).toBe('1');
  });

  afterAll(async () => {
    await app.close();
  });
});
