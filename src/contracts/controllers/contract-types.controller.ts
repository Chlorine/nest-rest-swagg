import { Controller, Get, HttpException, Param } from '@nestjs/common';

import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ContractsService } from '../contracts.service';

import { ContractType } from '../db/contract-type';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

/**
 * Контроллер для справочника типов договоров
 */
@ApiTags('Типы договоров')
@Controller('contract-types')
export class ContractTypesController {
  constructor(private readonly cs: ContractsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение списка всех типов договоров' })
  @ApiResponse({
    status: 200,
    description: 'Список типов',
    type: [ContractType],
  })
  async getAll(): Promise<ContractType[]> {
    return this.cs.getContractTypes();
  }

  @Get(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Получение конкретного типа договора' })
  @ApiResponse({
    status: 200,
    description: 'Тип договора',
    type: ContractType,
  })
  @ApiNotFoundResponse({ description: 'В случае если объект не найден' })
  async getById(@Param('id') id: string) {
    const res = await this.cs.getContractType(parseInt(id));
    if (!res) throw new HttpException('Not found', 404);
    return res;
  }
}
