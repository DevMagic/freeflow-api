import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configService } from './config/config';
import { UsersModule } from './users/users.module';
import { UsersTranscriptModule } from './users-transcript/users-transcript.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UsersModule,
    UsersTranscriptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
