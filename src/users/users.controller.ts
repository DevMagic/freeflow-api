import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandling } from 'src/config/error-handling';
import { HttpResponseDto } from 'src/config/http-response.dto';
import { UsersLoginBodyDto, UsersCreateBodyDto } from './dtos/users-login-body.dto';
import { UsersLoginResponseDto, UsersExistResponseDto } from './dtos/users-login-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    ) {}

  @ApiTags('users')
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

  @ApiTags('users')
  @ApiOperation({ summary: 'Create account in Threefold' })
  @ApiBody({ type: UsersCreateBodyDto })
  @ApiResponse({ status: 200, description: 'Successfully created account' })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @Post('create')
  @HttpCode(200)
  create(@Body() body: UsersCreateBodyDto) {
    try {
      return this.usersService.createUser(body)
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @ApiTags('users')
  @ApiOperation({ summary: 'Checks if user already exists' })
  @ApiResponse({ status: 200, description: 'Success', type : UsersExistResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @Get('/:username/exists')
  @HttpCode(200)
  async exist(@Param('username') username: string) {
    try {
      return await this.usersService.checkUserExists(username)
    } catch (error) {
      new ErrorHandling(error);
    }
  }

}
