import {
  Controller,
  Get,
  HttpException,
  Param,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ContractsService } from '../contracts.service';

import { ContractType } from '../db/contract-type';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Контроллер для справочника типов договоров
 */
@ApiBearerAuth()
@ApiTags('Типы договоров')
@Controller('contract-types')
export class ContractTypesController {
  constructor(private readonly cs: ContractsService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
