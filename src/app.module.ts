import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configService } from './config/config';
import { UsersModule } from './users/users.module';
import { UsersTranscriptModule } from './users-transcript/users-transcript.module';
import { CollectiblesModule } from './collectibles/collectibles.module';
import { FilesUploadModule } from './providers/file-upload-provider/file-upload-provider.module';
import { WalletModule } from './wallet/wallet.module';
@Module({
  imports: [
    FilesUploadModule,
    CollectiblesModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UsersModule,
    UsersTranscriptModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
