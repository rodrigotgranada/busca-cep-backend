import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CepModule } from './cep/cep.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, CepModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
