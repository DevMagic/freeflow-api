import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUsersTranscriptDto {

  @ApiProperty()
  @IsNotEmpty()
  category : string;

  @ApiProperty()
  @IsNotEmpty()
  amount : number;

  @ApiProperty()
  transferAction : string

  @ApiProperty()
  exchangeUserId : string

  @ApiProperty()
  gratitudeType : string

}

export class GetUsersTranciptDto{

  @ApiProperty()
  category : string

  @ApiProperty()
  @IsNotEmpty()
  offset : number;

}
