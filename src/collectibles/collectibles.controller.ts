import { Controller, Get, Query, HttpCode, UseGuards, HttpException } from '@nestjs/common';
import { CollectiblesService } from './collectibles.service';
import { Collectibles, CollectibleType } from './entities/collectibles.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetCollectiblesFiltersDto, ResponseCollectiblesDto } from './dtos/collectibles.dto';
import { HttpResponseDto } from '../config/http-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  @ApiResponse({ status: 200, description: 'Collectibles', type: ResponseCollectiblesDto })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
  @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
  @Get()
  @HttpCode(200)
  async getCollectibles(@Query() {collectibleType, limit, offset}: GetCollectiblesFiltersDto): Promise<ResponseCollectiblesDto[]> {
    try {
      return await this.collectiblesService.getCollectibles(collectibleType, limit, offset)
    } catch (error) {
      throw new HttpException(error, 500)
    }
  }
}
