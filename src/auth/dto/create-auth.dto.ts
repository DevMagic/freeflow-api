import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {

    @ApiProperty()
    @IsNotEmpty()
    login : string;

    @ApiProperty()
    @IsNotEmpty()
    seedPhrase : string;

}
