import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HttpResponseDto } from 'src/config/http-response.dto';
import { ErrorHandling } from 'src/config/error-handling';
import { WalletService } from './wallet.service';
import { TransactionDto } from './dto/create-wallet.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransferResponseDto } from './dto/wallet-response.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiTags('wallet')
  @ApiOperation({ summary: 'Transfer currency betwen wallets' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: TransactionDto })
  @ApiResponse({ status: 200, description: 'Success', type: TransferResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  @HttpCode(200)
  transfer(@Req() { user }, @Body() body: TransactionDto) {
    try {
      return this.walletService.transactionWalletAmounds(user.id, body);
    } catch (error) {
      new ErrorHandling(error);
    }
  }
}
