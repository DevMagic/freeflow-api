import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, UseGuards, Req, Put, UseInterceptors, UploadedFile, HttpException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { ErrorHandling } from 'src/config/error-handling';
import { HttpResponseDto } from 'src/config/http-response.dto';
import { UsersLoginBodyDto, UsersCreateBodyDto } from './dtos/users-login-body.dto';
import { UsersLoginResponseDto, UsersExistResponseDto } from './dtos/users-login-response.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseUserDto, UpdateUserBodyDto, ResponseContractDto } from './dtos/users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @ApiTags('users')
  @ApiOperation({ summary: 'Login with Threefold Connect account' })
  @ApiBody({ type: UsersLoginBodyDto })
  @ApiResponse({ status: 200, description: 'Successfully logged in', type: UsersLoginResponseDto })
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
  @ApiResponse({ status: 200, description: 'Success', type: UsersExistResponseDto })
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

  @ApiTags('users')
  @ApiOperation({ summary: 'Return self user' })
  @ApiBearerAuth('Bearer')
  @ApiResponse({ status: 200, description: 'Success', type: ResponseUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async getUser(@Req() { user }) {
    try {
      return await this.usersService.getUser(user.id)
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @ApiTags('users')
  @ApiOperation({ summary: 'Update user authenticated' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: UpdateUserBodyDto })
  @ApiResponse({ status: 200, description: 'Success', type: ResponseUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  @Put()
  @HttpCode(200)
  async updateUser(@Body() body: UpdateUserBodyDto, @Req() { user }, @UploadedFile() file,) {
    try {

      return await this.usersService.updateUser(user.id, body, file)

    } catch (error) {

      new ErrorHandling(error);

    }
  }

  @ApiTags('users')
  @ApiOperation({ summary: 'Return contract and qrcode' })
  @ApiBearerAuth('Bearer')
  @ApiResponse({ status: 200, description: 'Success', type: ResponseContractDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @UseGuards(JwtAuthGuard)
  @Get('contract')
  @HttpCode(200)
  async getContract(@Req() { user }) {
    try {
      return await this.usersService.getContract(user.id)
    } catch (error) {
      new ErrorHandling(error);
    }
  }

}
