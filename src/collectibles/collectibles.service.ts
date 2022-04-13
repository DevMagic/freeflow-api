import { Injectable, HttpException } from '@nestjs/common';
import { Collectibles} from './entities/collectibles.entity';
import { CollectiblesRepository } from './repository/collectibles.repository';
import { ResponseCollectiblesDto } from './dtos/collectibles.dto';
import { CollectibleType } from './enums/collectibles.enum';



@Injectable()
export class CollectiblesService {

    constructor(private readonly collectiblesRepository: CollectiblesRepository){}

    async getCollectibles(collectibleType: CollectibleType, userId: string, limit: number, offset: number, time: string): Promise<ResponseCollectiblesDto[]> {
        if(limit < 0 || limit > 50) limit = 20
        return (await this.collectiblesRepository.getCollectibles(collectibleType, userId, limit, offset, time)).map((collectibles) => {
            return this.responseColletible(collectibles)
        })
    }

    async getCollectible(collectibleId: string) {
        let collectible = await this.collectiblesRepository.getCollectible(collectibleId)
        if(!collectible) throw new HttpException(`Collectible not found`, 404)
        return this.responseColletible(collectible)
    }

    responseColletible(collectibles: Collectibles) {
        return {
            id: collectibles.id,
            collectibleType: collectibles.collectibleType,
            authorName: collectibles.authorName,
            eventTitle: collectibles.event.title,
            imageUrl: collectibles.imageUrl,
            qrCodeImageUrl: collectibles.qrCodeImageUrl,
            contractAddress: collectibles.contractAddress,
            tokenId: +collectibles.tokenId,
            eventDate: collectibles.event.eventDate,
            createdAt: collectibles.createdAt,
            updatedAt: collectibles.updatedAt,
        } as ResponseCollectiblesDto
    }
}
