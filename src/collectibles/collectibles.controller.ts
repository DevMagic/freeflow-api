import { Controller, Get, Query, HttpCode, UseGuards, HttpException, Req, Param } from '@nestjs/common';
import { CollectiblesService } from './collectibles.service';
import { Collectibles } from './entities/collectibles.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetCollectiblesFiltersDto, ResponseCollectiblesDto } from './dtos/collectibles.dto';
import { HttpResponseDto } from '../config/http-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ErrorHandling } from '../config/error-handling';
import { CollectibleType, TimeType } from './enums/collectibles.enum';

@Controller('collectibles')
@UseGuards(JwtAuthGuard)
export class CollectiblesController {
  constructor(private readonly collectiblesService: CollectiblesService) {}

  @ApiTags('collectibles')
  @ApiOperation({ summary: 'Return all collectibles' })
  @ApiBearerAuth('Bearer')
  @ApiQuery({ name: "limit", type: "number", description: "Limit of posts (50 max.)", required: true })
  @ApiQuery({ name: "offset", type: "number", required: true })
  @ApiQuery({ name: "collectibleType", type: "enum", enum: CollectibleType, required: false })
  @ApiQuery({ name: "time", type: "enum", enum: TimeType, required: false })
  @ApiResponse({ status: 200, description: 'Collectibles', type: ResponseCollectiblesDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @Get()
  @HttpCode(200)
  async getCollectibles(@Query() {collectibleType, limit, offset, time}: GetCollectiblesFiltersDto, @Req() { user }): Promise<ResponseCollectiblesDto[]> {
    try {
      return await this.collectiblesService.getCollectibles(collectibleType, user.id, limit, offset, time)
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  
  @ApiTags('collectibles')
  @ApiOperation({ summary: 'Return collectible' })
  @ApiBearerAuth('Bearer')
  @ApiResponse({ status: 200, description: 'Collectibles', type: ResponseCollectiblesDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @Get(':id')
  @HttpCode(200)
  async getCollectible(@Param('id') collectibleId: string): Promise<ResponseCollectiblesDto> {
    try {
      return await this.collectiblesService.getCollectible(collectibleId)
    } catch (error) {
      new ErrorHandling(error);
    }
  }

}
