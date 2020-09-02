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

import { CreateCompDocDto } from './dto/comp-doc.create.dto';
import { UpdateCompDocDto } from './dto/comp-doc.update.dto';

import { CompletionDocument } from '../db/document';
import { Utils } from '../../utils';
import { Contract } from '../db/contract';

/**
 * Контроллер для работы с объектами "Документ выполнения"
 */
@ApiTags('Документы выполнения')
@Controller('comp-docs')
export class CompDocController {
  constructor(private readonly cs: ContractsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение списка всех документов выполнения' })
  @ApiResponse({
    status: 200,
    description: 'Список документов',
    type: [CompletionDocument],
  })
  async getAll(): Promise<CompletionDocument[]> {
    return this.cs.getCompletionDocuments();
  }

  @Get(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Получение документа выполнения' })
  @ApiResponse({
    status: 200,
    description: 'Документ выполнения',
    type: CompletionDocument,
  })
  @ApiNotFoundResponse({ description: 'В случае если объект не найден' })
  async getById(@Param('id') id: string) {
    const res = await this.cs.getCompletionDocument(parseInt(id));
    if (!res) throw new HttpException('Not found', 404);
    return res;
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Добавление документа выполнения' })
  @ApiResponse({
    status: 200,
    description: 'Описание созданного объекта',
    type: CompletionDocument,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async create(@Body() params: CreateCompDocDto) {
    let cd: CompletionDocument | undefined;

    try {
      cd = await this.cs.createCompletionDocument(params);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    return Utils.omitProps(cd, ['type', 'currency']) as CompletionDocument;
  }

  @Put(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Изменение документа выполнения' })
  @ApiResponse({
    status: 200,
    description: 'Описание измененного объекта',
    type: CompletionDocument,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async update(@Param('id') id: string, @Body() params: UpdateCompDocDto) {
    let cd: CompletionDocument | undefined;

    try {
      cd = await this.cs.updateCompletionDocument(parseInt(id), params);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    return Utils.omitProps(cd, ['type', 'currency']) as CompletionDocument;
  }

  @Delete(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Удаление документа выполнения' })
  @ApiResponse({
    status: 200,
    description: 'Успешное удаление',
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.cs.removeCompletionDocument(parseInt(id));
  }
}
