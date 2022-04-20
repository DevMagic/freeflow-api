import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  walletAdress : string;

  @ApiProperty()
  @IsNotEmpty()
  amount : number;
}
