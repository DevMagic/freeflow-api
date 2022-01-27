import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [AuthModule, CryptoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
