import { ApiProperty } from "@nestjs/swagger";

export class ThreefoldUserDto {

    @ApiProperty()
    doublename : string;

    @ApiProperty()
    publicKey? : string;

    @ApiProperty()
    email? : string;

    @ApiProperty()
    phone? : string;

}