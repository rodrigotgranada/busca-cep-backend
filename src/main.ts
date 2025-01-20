import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MetricsService } from './metrics/metrics.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const metricsService = app.get(MetricsService);

  app.use((req: any, res: any, next: () => void) => {
    res.on('finish', () => {
      metricsService.incrementHttpRequest(
        req.method,
        res.statusCode.toString(),
        req.path,
      );
    });

    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Busca de CEP')
    .setDescription(
      'API para busca de informações de CEP usando múltiplos provedores, com autenticação JWT',
    )
    .setVersion('1.0')
    .addTag('CEP')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
