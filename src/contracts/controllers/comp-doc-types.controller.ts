import {
  Controller,
  Get,
  HttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ContractsService } from '../contracts.service';

import { CompletionDocumentType } from '../db/document-type';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Контроллер для справочника типов документов выполнения
 */
@ApiBearerAuth()
@ApiTags('Типы документов выполнения')
@Controller('completion-document-types')
export class CompDocTypesController {
  constructor(private readonly cs: ContractsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Получение списка всех типов документов выполнения',
  })
  @ApiResponse({
    status: 200,
    description: 'Список типов',
    type: [CompletionDocumentType],
  })
  async getAll(): Promise<CompletionDocumentType[]> {
    return this.cs.getCompletionDocumentTypes();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Получение конкретного типа документа выполнения' })
  @ApiResponse({
    status: 200,
    description: 'Тип документа',
    type: CompletionDocumentType,
  })
  @ApiNotFoundResponse({ description: 'В случае если объект не найден' })
  async getById(@Param('id') id: string) {
    const res = await this.cs.getCompletionDocumentType(parseInt(id));
    if (!res) throw new HttpException('Not found', 404);
    return res;
  }
}
