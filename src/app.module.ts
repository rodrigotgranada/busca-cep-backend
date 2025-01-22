import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CepModule } from './cep/cep.module';
import { AuthModule } from './auth/auth.module';
import { Logger } from './logging/logger.service';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health/health.controller';
import { MetricsModule } from './metrics/metrics.module';
import { MetricsMiddleware } from './metrics/metrics.middleware';

@Module({
  imports: [CepModule, AuthModule, TerminusModule, HttpModule, MetricsModule],
  controllers: [HealthController],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
