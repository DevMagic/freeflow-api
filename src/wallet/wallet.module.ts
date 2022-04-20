import { Module, forwardRef } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletRepository } from './repositories/wallet.repository';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([WalletRepository])],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
