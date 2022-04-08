import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UsersTranscriptResponseDto{
  @ApiProperty()
  amount : number;

  @ApiProperty()
  fee : number;

  @ApiProperty()
  senderEmail : string;

  @ApiProperty()
  reciverEmail : string;

  @ApiProperty()
  senderPhotoUrl : string;

  @ApiProperty()
  reciverPhotoUrl : string;

  @ApiProperty()
  date : string;
}