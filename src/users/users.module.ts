import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './repositories/users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { FilesUploadModule } from '../providers/file-upload-provider/file-upload-provider.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { WalletRepository } from 'src/wallet/repositories/wallet.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersRepository, WalletRepository
    ]),
    forwardRef(() => AuthModule),
    FilesUploadModule,
    WalletModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
