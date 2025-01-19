import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CepModule } from './cep/cep.module';
import { AuthModule } from './auth/auth.module';
import { Logger } from './logging/logger.service';

@Module({
  imports: [CepModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}
