import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UsersLoginBodyDto {

    @ApiProperty()
    @IsNotEmpty()
    login : string;

    @ApiProperty()
    @IsNotEmpty()
    seedPhrase : string;

}

export class UsersCreateBodyDto {

    @ApiProperty()
    @IsNotEmpty()
    displayName : string;

    @ApiProperty()
    @IsNotEmpty()
    username : string;

    @ApiProperty()
    @IsNotEmpty()
    email : string;

    @ApiProperty()
    @IsNotEmpty()
    seedPhrase : string;

}

export class UsersExistBodyDto {

    @ApiProperty()
    @IsNotEmpty()
    username : string;

}