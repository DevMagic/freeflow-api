import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CryptoService } from 'src/crypto/crypto.service';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [CryptoModule],
})
export class AuthModule {}
