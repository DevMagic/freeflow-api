import { ApiProperty } from "@nestjs/swagger";
import { CollectibleType } from '../entities/collectibles.entity';

export class GetCollectiblesFiltersDto {

    @ApiProperty()
    limit?: number;

    @ApiProperty()
    offset?: number;

    @ApiProperty({ enum: CollectibleType })
    collectibleType?: CollectibleType;


}

export class ResponseCollectiblesDto {
    
    @ApiProperty()
    id: string

    @ApiProperty({ enum: CollectibleType })
    collectibleType: string

    @ApiProperty()
    eventTitle: string

    @ApiProperty()
    eventDescription: string

    @ApiProperty()
    eventImageUrl: string

    @ApiProperty()
    eventDate: Date

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date

}