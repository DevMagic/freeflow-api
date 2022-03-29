import { Module, forwardRef } from '@nestjs/common';
import { UsersTranscriptService } from './users-transcript.service';
import { UsersTranscriptController } from './users-transcript.controller';
import { UsersTranscriptRepository } from './repositories/users-transcript.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersTranscriptRepository]), forwardRef(() => AuthModule)],
  controllers: [UsersTranscriptController],
  providers: [UsersTranscriptService],
  exports: [UsersTranscriptService],
})
export class UsersTranscriptModule {}
