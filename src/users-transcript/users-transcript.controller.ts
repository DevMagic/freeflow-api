import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ErrorHandling } from 'src/config/error-handling';
import { HttpResponseDto } from 'src/config/http-response.dto';
import { UsersTranscriptService } from './users-transcript.service';
import { CreateUsersTranscriptDto, GetUsersTranciptDto } from './dto/create-users-transcript.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users-transcript')
export class UsersTranscriptController {
  constructor(private readonly usersTranscriptService: UsersTranscriptService) {}

  @ApiTags('users-transcript')
  @ApiOperation({ summary: 'Register history of transactions' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: CreateUsersTranscriptDto })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('register')
  @HttpCode(200)
  recover(@Req() { user }, @Body() body: CreateUsersTranscriptDto) {
    try {
      return this.usersTranscriptService.createTranscriptByCategory(body, user.id)
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @ApiTags('users-transcript')
  @ApiOperation({ summary: 'Get history of transactions with pagination and filter' })
  @ApiBearerAuth('Bearer')
  @ApiQuery({ name : "category", type: "string", required: false })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @UseGuards(JwtAuthGuard)
  @Get('get-users-transcript')
  @HttpCode(200)
  getTranscript(@Req() { user }, @Query() filter : GetUsersTranciptDto) {
    try {
      return this.usersTranscriptService.getUsersTranscript(user.id, filter.category, filter.offset)
    } catch (error) {
      new ErrorHandling(error);
    }
  }
}
