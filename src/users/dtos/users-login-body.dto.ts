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