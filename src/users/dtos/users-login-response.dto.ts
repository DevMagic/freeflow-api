import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UsersLoginResponseDto {

    @ApiProperty()
    id : string;

    @ApiProperty()
    username : string;

    @ApiProperty()
    email : string;

    @ApiProperty()
    token : string;

}