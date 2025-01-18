import { Module, MiddlewareConsumer } from '@nestjs/common';
import { CepController } from './cep.controller';
import { CepService } from './cep.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [AuthModule],
  controllers: [CepController],
  providers: [CepService],
})
export class CepModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CepController);
  }
}
