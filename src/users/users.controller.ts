import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandling } from 'src/config/error-handling';
import { HttpResponseDto } from 'src/config/http-response.dto';
import { UsersLoginBodyDto } from './dtos/users-login-body.dto';
import { UsersLoginResponseDto } from './dtos/users-login-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    ) {}

  @ApiTags('auth')
  @ApiOperation({ summary: 'Login with Threefold Connect account' })
  @ApiBody({ type: UsersLoginBodyDto })
  @ApiResponse({ status: 200, description: 'Successfully logged in', type : UsersLoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @Post('recover')
  @HttpCode(200)
  recover(@Body() body: UsersLoginBodyDto) {
    try {
      return this.usersService.login(body.login, body.seedPhrase);
    } catch (error) {
      new ErrorHandling(error);
    }
  }

}
