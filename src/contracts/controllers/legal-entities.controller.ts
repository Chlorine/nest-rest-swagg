import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ContractsService } from '../contracts.service';

import { CreateLegalEntityDto } from './dto/legal-entity.create.dto';
import { UpdateLegalEntityDto } from './dto/legal-entity.update.dto';

import { LegalEntity } from '../db/legal-entity';

/**
 * Контроллер для работы с объектами "Юрлица"
 */
@ApiTags('Юридические лица')
@Controller('legal-entities')
export class LegalEntitiesController {
  constructor(private readonly cs: ContractsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение списка всех юрлиц' })
  @ApiResponse({
    status: 200,
    description: 'Список юридических лиц',
    type: [LegalEntity],
  })
  async getAll(): Promise<LegalEntity[]> {
    return this.cs.getLegalEntities();
  }

  @Get(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Получение юрлица' })
  @ApiResponse({
    status: 200,
    description: 'Юрлицо',
    type: LegalEntity,
  })
  @ApiNotFoundResponse({ description: 'В случае если объект не найден' })
  async getById(@Param('id') id: string) {
    const res = await this.cs.getLegalEntity(parseInt(id));
    if (!res) throw new HttpException('Not found', 404);
    return res;
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Добавление юрлица' })
  @ApiResponse({
    status: 200,
    description: 'Описание созданного объекта',
    type: LegalEntity,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async create(@Body() params: CreateLegalEntityDto) {
    let le: LegalEntity | undefined;

    try {
      le = await this.cs.createLegalEntity(params);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    return le;
  }

  @Put(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Изменение юрлица' })
  @ApiResponse({
    status: 200,
    description: 'Описание измененного объекта',
    type: LegalEntity,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async update(@Param('id') id: string, @Body() params: UpdateLegalEntityDto) {
    let le: LegalEntity | undefined;

    try {
      le = await this.cs.updateLegalEntity(parseInt(id), params);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    return le;
  }

  @Delete(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Удаление юрлица' })
  @ApiResponse({
    status: 200,
    description: 'Успешное удаление',
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.cs.removeLegalEntity(parseInt(id));
  }
}
