import { Module, forwardRef } from '@nestjs/common';
import { CollectiblesService } from './collectibles.service';
import { CollectiblesController } from './collectibles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectiblesRepository } from './repository/collectibles.repository';
import { EventsRepository } from './repository/events.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CollectiblesRepository,
      EventsRepository
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CollectiblesController],
  providers: [CollectiblesService]
})
export class CollectiblesModule {}
