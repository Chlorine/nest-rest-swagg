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

import { CreateInvoiceDto } from './dto/invoice.create.dto';
import { UpdateInvoiceDto } from './dto/invoice.update.dto';

import { Invoice } from '../db/invoice';
import { Utils } from '../../utils';
import { doc } from 'prettier';

/**
 * Контроллер для работы с объектами "Фактура"
 *
 */
@ApiTags('Фактуры по документам')
@Controller('comp-docs/:documentId')
export class InvoicesController {
  constructor(private readonly cs: ContractsService) {}

  /**
   * GET ALL
   */

  @Get('invoices')
  @ApiImplicitParam({
    name: 'documentId',
    type: String,
    description: 'Идентификатор документа',
  })
  @ApiOperation({
    summary: 'Получение списка всех фактур по документу выполнения',
  })
  @ApiResponse({
    status: 200,
    description: 'Список фактур',
    type: [Invoice],
  })
  async getAll(@Param('documentId') documentId: string): Promise<Invoice[]> {
    return this.cs.getInvoices(parseInt(documentId));
  }

  /**
   * GET BY ID
   */

  @Get('invoices/:invoiceId')
  @ApiImplicitParam({
    name: 'documentId',
    type: String,
    description: 'Идентификатор документа',
  })
  @ApiImplicitParam({
    name: 'invoiceId',
    type: String,
    description: 'Идентификатор фактуры',
  })
  @ApiOperation({ summary: 'Получение конкретной фактуры' })
  @ApiResponse({
    status: 200,
    description: 'Фактура',
    type: Invoice,
  })
  @ApiNotFoundResponse({ description: 'В случае если объект не найден' })
  async getById(@Param('invoiceId') invoiceId: string): Promise<Invoice> {
    const res = await this.cs.getInvoice(parseInt(invoiceId));
    if (!res) throw new HttpException('Not found', 404);
    return res;
  }

  /**
   * CREATE NEW
   */

  @Post('invoices')
  @ApiImplicitParam({
    name: 'documentId',
    type: String,
    description: 'Идентификатор документа выполнения',
  })
  @HttpCode(200)
  @ApiOperation({ summary: 'Добавление фактуры' })
  @ApiResponse({
    status: 200,
    description: 'Описание созданного объекта',
    type: Invoice,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async create(
    @Param('documentId') documentId: string,
    @Body() params: CreateInvoiceDto,
  ): Promise<Invoice> {
    let invoice: Invoice | undefined;

    try {
      invoice = await this.cs.createInvoice(parseInt(documentId), params);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    // убр. relation-ссылку (как бы todo: отдельный интерфейс для public-обмена)
    return Utils.omitProps(invoice, [
      'completionDocument',
      'contractStage',
    ]) as Invoice;
  }

  /**
   * UPDATE
   */

  @Put('invoices/:invoiceId')
  @ApiImplicitParam({
    name: 'documentId',
    type: String,
    description: 'Идентификатор документа выполнения',
  })
  @ApiImplicitParam({
    name: 'invoiceId',
    type: String,
    description: 'Идентификатор фактуры',
  })
  @ApiOperation({ summary: 'Изменение фактуры' })
  @ApiResponse({
    status: 200,
    description: 'Описание измененного объекта',
    type: Invoice,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async update(
    @Param('invoiceId') invoiceId: string,
    @Body() params: UpdateInvoiceDto,
  ): Promise<Invoice> {
    let invoice: Invoice | undefined;

    try {
      invoice = await this.cs.updateInvoice(parseInt(invoiceId), params);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    return Utils.omitProps(invoice, [
      'completionDocument',
      'contractStage',
    ]) as Invoice;
  }

  /**
   * REMOVE
   */

  @Delete('stages/:stageId')
  @ApiImplicitParam({
    name: 'documentId',
    type: String,
    description: 'Идентификатор документа выполнения',
  })
  @ApiImplicitParam({
    name: 'invoiceId',
    type: String,
    description: 'Идентификатор фактуры',
  })
  @ApiOperation({ summary: 'Удаление фактуры' })
  @ApiResponse({
    status: 200,
    description: 'Успешное удаление',
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async remove(@Param('invoiceId') invoiceId: string): Promise<void> {
    await this.cs.removeInvoice(parseInt(invoiceId));
  }
}
