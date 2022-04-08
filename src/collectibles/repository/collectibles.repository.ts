import { Repository, EntityRepository, LessThanOrEqual, MoreThan } from 'typeorm';
import { Collectibles } from '../entities/collectibles.entity';
import { Injectable } from '@nestjs/common';
import { CollectibleType } from '../enums/collectibles.enum';


@Injectable()
@EntityRepository(Collectibles)
export class CollectiblesRepository extends Repository<Collectibles>{

    constructor() {
        super();
    }

    async getCollectibles(collectibleType: CollectibleType, userId: string, limit: number, offset: number, time: string): Promise<Collectibles[]> {
        return this.find({
            where: {
                ...(collectibleType && {collectibleType}),
                ...(userId && {userId}),
                ...(time && time == 'past' && {event: {eventDate: LessThanOrEqual(new Date())}} 
                || time && time == 'future' && {event: {eventDate: MoreThan(new Date())}}),
            },
            take: limit,
            skip: offset,
            relations: ['event'] 
        })
    }
    async getCollectible(collectibleId: string): Promise<Collectibles> {
        return this.findOne({
            where: {
                id: collectibleId
            },
            relations: ['event']
        })
    }

}