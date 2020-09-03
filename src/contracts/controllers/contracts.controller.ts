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
  UseGuards,
} from '@nestjs/common';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ContractsService } from '../contracts.service';

import { CreateContractDto } from './dto/contract.create.dto';
import { UpdateContractDto } from './dto/contract.update.dto';

import { Contract } from '../db/contract';
import { Utils } from '../../utils';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Контроллер для работы с объектами "Договора"
 */
@ApiBearerAuth()
@ApiTags('Договоры')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly cs: ContractsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Получение списка всех договоров' })
  @ApiResponse({
    status: 200,
    description: 'Список договоров',
    type: [Contract],
  })
  async getAll(): Promise<Contract[]> {
    return this.cs.getContracts();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Получение договора' })
  @ApiResponse({
    status: 200,
    description: 'Договор',
    type: Contract,
  })
  @ApiNotFoundResponse({ description: 'В случае если объект не найден' })
  async getById(@Param('id') id: string) {
    const res = await this.cs.getContract(parseInt(id));
    if (!res) throw new HttpException('Not found', 404);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Добавление договора' })
  @ApiResponse({
    status: 200,
    description: 'Описание созданного объекта',
    type: Contract,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async create(@Body() params: CreateContractDto): Promise<Contract> {
    let contract: Contract | undefined;

    try {
      contract = await this.cs.createContract(params);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    // сейчас у contract непустые relation-ссылки, надо бы их грохнуть

    return Utils.omitProps(contract, [
      'type',
      'supplier',
      'payer',
      'currency',
    ]) as Contract;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Изменение договора' })
  @ApiResponse({
    status: 200,
    description: 'Описание измененного объекта',
    type: Contract,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async update(@Param('id') id: string, @Body() params: UpdateContractDto) {
    let contract: Contract | undefined;

    try {
      contract = await this.cs.updateContract(parseInt(id), params);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    return Utils.omitProps(contract, [
      'type',
      'supplier',
      'payer',
      'currency',
    ]) as Contract;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Удаление договора' })
  @ApiResponse({
    status: 200,
    description: 'Успешное удаление',
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.cs.removeContract(parseInt(id));
  }
}
