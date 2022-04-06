import { Repository, EntityRepository } from 'typeorm';
import { Collectibles, CollectibleType } from '../entities/collectibles.entity';
import { Injectable } from '@nestjs/common';


@Injectable()
@EntityRepository(Collectibles)
export class CollectiblesRepository extends Repository<Collectibles>{

    constructor() {
        super();
    }

    async getCollectibles(collectibleType: CollectibleType, userId: string, limit: number, offset: number): Promise<Collectibles[]> {
        return this.find({
            where: {
                ...(collectibleType && {collectibleType}),
                ...(userId && {userId})
            },
            take: limit,
            skip: offset,
            relations: ['event'] 
        })
    }

}