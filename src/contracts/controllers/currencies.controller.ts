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

import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ContractsService } from '../contracts.service';

import { CreateCurrencyDto } from './dto/currency.create.dto';
import { UpdateCurrencyDto } from './dto/currency.update.dto';

import { Currency } from '../db/currency';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

/**
 * Контроллер для работы с объектами "Валюты"
 */
@ApiTags('Валюты')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly cs: ContractsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение списка всех валют' })
  @ApiResponse({
    status: 200,
    description: 'Список валют',
    type: [Currency],
  })
  async getAll(): Promise<Currency[]> {
    return this.cs.getCurrencies();
  }

  @Get(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Получение валюты' })
  @ApiResponse({
    status: 200,
    description: 'Валюта',
    type: Currency,
  })
  @ApiNotFoundResponse({ description: 'В случае если объект не найден' })
  async getById(@Param('id') id: string) {
    const res = await this.cs.getCurrency(parseInt(id));
    if (!res) throw new HttpException('Not found', 404);
    return res;
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Добавление валюты' })
  @ApiResponse({
    status: 200,
    description: 'Описание созданного объекта',
    type: Currency,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async create(@Body() params: CreateCurrencyDto) {
    let currency: Currency | undefined;

    try {
      currency = await this.cs.createCurrency(params);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    return currency;
  }

  @Put(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Изменение валюты' })
  @ApiResponse({
    status: 200,
    description: 'Описание измененного объекта',
    type: Currency,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async update(@Param('id') id: string, @Body() params: UpdateCurrencyDto) {
    let currency: Currency | undefined;

    try {
      currency = await this.cs.updateCurrency(parseInt(id), params);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    return currency;
  }

  @Delete(':id')
  @ApiImplicitParam({
    name: 'id',
    type: String,
    description: 'Идентификатор объекта',
  })
  @ApiOperation({ summary: 'Удаление валюты' })
  @ApiResponse({
    status: 200,
    description: 'Успешное удаление',
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.cs.removeCurrency(parseInt(id));
  }
}
