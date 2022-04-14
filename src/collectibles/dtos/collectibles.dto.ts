import { ApiProperty } from "@nestjs/swagger";
import { CollectibleType, TimeType } from '../enums/collectibles.enum';

export class GetCollectiblesFiltersDto {

    @ApiProperty()
    limit?: number;

    @ApiProperty()
    offset?: number;

    @ApiProperty({ enum: CollectibleType })
    collectibleType?: CollectibleType;

    @ApiProperty({ enum: TimeType })
    time?: TimeType;


}

export class ResponseCollectiblesDto {
    
    @ApiProperty()
    id: string

    @ApiProperty({ enum: CollectibleType })
    collectibleType: string

    @ApiProperty()
    authorName: string

    @ApiProperty()
    qrCodeImageUrl: string

    @ApiProperty()
    contractAddress: string

    @ApiProperty()
    tokenId: number
    
    @ApiProperty({nullable: true})
    imageUrl: string

    @ApiProperty()
    eventTitle: string

    @ApiProperty()
    eventDate: Date

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date

}