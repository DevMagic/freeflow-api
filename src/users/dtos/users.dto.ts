import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ResponseUserDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    displayName: string

    @ApiProperty()
    username: string

    @ApiProperty()
    contractAddress: string

    @ApiProperty()
    profileImageUrl: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}

export class ResponseContractDto {
    @ApiProperty()
    qrCodeImageUrl: string
    
    @ApiProperty()
    contractAddress: string
}

export class UpdateUserBodyDto {
    @ApiProperty({required: false})
    displayName: string

    @ApiProperty({required: false})
    collectibleId: string

    @ApiProperty({ required: false, type: "file" })
    file : object;
    
}