import { Injectable } from '@nestjs/common';
import { Collectibles, CollectibleType } from './entities/collectibles.entity';
import { CollectiblesRepository } from './repository/collectibles.repository';
import { ResponseCollectiblesDto } from './dtos/collectibles.dto';



@Injectable()
export class CollectiblesService {

    constructor(private readonly collectiblesRepository: CollectiblesRepository){}

    async getCollectibles(collectibleType: CollectibleType, userId: string, limit: number, offset: number): Promise<ResponseCollectiblesDto[]> {
        if(limit < 0 || limit > 50) limit = 20
        return (await this.collectiblesRepository.getCollectibles(collectibleType, userId, limit, offset)).map((collectibles) => {
            let responseCollectibles: ResponseCollectiblesDto = {
                id: collectibles.id,
                collectibleType: collectibles.collectibleType,
                eventTitle: collectibles.event.title,
                eventDate: collectibles.event.eventDate,
                eventDescription: collectibles.event.description,
                imageUrl: collectibles.imageUrl,
                createdAt: collectibles.createdAt,
                updatedAt: collectibles.updatedAt,
            };
            return responseCollectibles
        })
    }
}
