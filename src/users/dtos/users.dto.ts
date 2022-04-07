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
    profileImageUrl: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}

export class UpdateUserBodyDto {
    @ApiProperty()
    displayName: string

    @ApiProperty()
    collectibleId: string
    
}