import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandling } from 'src/config/error-handling';
import { HttpResponseDto } from 'src/config/http-response.dto';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('auth')
  @ApiOperation({ summary: 'Login with Threefold Connect account' })
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({ status: 200, description: 'Successfully logged in '})
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @Post('recover')
  @HttpCode(200)
  recover(@Body() createAuthDto: CreateAuthDto) {
    try {
      return this.authService.recover(createAuthDto.login, createAuthDto.seedPhrase);
    } catch (error) {
      new ErrorHandling(error);
    }
  }

}
