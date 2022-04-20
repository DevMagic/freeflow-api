import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TransferResponseDto{
  @ApiProperty()
  id : string;

  @ApiProperty()
  date : string;

  @ApiProperty()
  senderEmail : string;

  @ApiProperty()
  amount : number;

  @ApiProperty()
  fee : string;
}