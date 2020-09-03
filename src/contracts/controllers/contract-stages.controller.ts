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

import { CreateContractStageDto } from './dto/contract-stage.create.dto';
import { UpdateContractStageDto } from './dto/contract-stage.update.dto';

import { Contract } from '../db/contract';
import { Utils } from '../../utils';

import { ContractStage } from '../db/contract-stage';
import { Invoice } from '../db/invoice';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Контроллер для работы с объектами "Этапы договора"
 *
 * Примечание: если известен stageId, contractId в качестве входного параметра очевидно не нужен
 * Но с ним url path выглядит красиво и симметрично, так что пусть будет
 * Теоретически у parent могут быть какие-нибудь права которые надо проверить перед операцией...
 *
 */
@ApiBearerAuth()
@ApiTags('Этапы договора')
@Controller('contracts/:contractId')
export class ContractStagesController {
  constructor(private readonly cs: ContractsService) {}

  /**
   * GET ALL
   */

  @UseGuards(JwtAuthGuard)
  @Get('stages')
  @ApiImplicitParam({
    name: 'contractId',
    type: String,
    description: 'Идентификатор договора',
  })
  @ApiOperation({ summary: 'Получение списка всех этапов договора' })
  @ApiResponse({
    status: 200,
    description: 'Список этапов',
    type: [ContractStage],
  })
  async getAll(
    @Param('contractId') contractId: string,
  ): Promise<ContractStage[]> {
    return this.cs.getContractStages(parseInt(contractId));
  }

  /**
   * GET BY ID
   */

  @UseGuards(JwtAuthGuard)
  @Get('stages/:stageId')
  @ApiImplicitParam({
    name: 'contractId',
    type: String,
    description:
      'Идентификатор договора (не нужен но пусть будет для симметрии)',
  })
  @ApiImplicitParam({
    name: 'stageId',
    type: String,
    description: 'Идентификатор этапа договора',
  })
  @ApiOperation({ summary: 'Получение конкретного этапа договора' })
  @ApiResponse({
    status: 200,
    description: 'Этап договора',
    type: ContractStage,
  })
  @ApiNotFoundResponse({ description: 'В случае если объект не найден' })
  async getById(
    @Param('contractId') contractId: string,
    @Param('stageId') stageId: string,
  ): Promise<ContractStage> {
    const res = await this.cs.getContractStage(parseInt(stageId));
    if (!res) throw new HttpException('Not found', 404);
    return res;
  }

  /**
   * ФАКТУРЫ ПО ЭТАПУ
   */

  @UseGuards(JwtAuthGuard)
  @Get('stages/:stageId/invoices')
  @ApiImplicitParam({
    name: 'contractId',
    type: String,
    description: 'Идентификатор договора',
  })
  @ApiImplicitParam({
    name: 'stageId',
    type: String,
    description: 'Идентификатор этапа договора',
  })
  @ApiOperation({ summary: 'Получение списка фактур для этапа договора' })
  @ApiResponse({
    status: 200,
    description: 'Этапов',
    type: ContractStage,
  })
  @ApiNotFoundResponse({ description: 'В случае если объект не найден' })
  async getInvoicesByStage(
    @Param('stageId') stageId: string,
  ): Promise<Invoice[]> {
    return this.cs.getContractStageInvoices(parseInt(stageId));
  }

  /**
   * CREATE NEW
   */

  @UseGuards(JwtAuthGuard)
  @Post('stages')
  @ApiImplicitParam({
    name: 'contractId',
    type: String,
    description: 'Идентификатор договора',
  })
  @HttpCode(200)
  @ApiOperation({ summary: 'Добавление этапа к договору' })
  @ApiResponse({
    status: 200,
    description: 'Описание созданного объекта',
    type: ContractStage,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async create(
    @Param('contractId') contractId: string,
    @Body() params: CreateContractStageDto,
  ): Promise<ContractStage> {
    let contractStage: ContractStage | undefined;

    try {
      contractStage = await this.cs.createContractStage(
        parseInt(contractId),
        params,
      );
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    // убр. relation-ссылку (как бы todo: отдельный интерфейс для public-обмена)
    return Utils.omitProps(contractStage, ['contract']) as ContractStage;
  }

  /**
   * UPDATE
   */

  @UseGuards(JwtAuthGuard)
  @Put('stages/:stageId')
  @ApiImplicitParam({
    name: 'contractId',
    type: String,
    description: 'Идентификатор договора',
  })
  @ApiImplicitParam({
    name: 'stageId',
    type: String,
    description: 'Идентификатор этапа договора',
  })
  @ApiOperation({ summary: 'Изменение этапа договора' })
  @ApiResponse({
    status: 200,
    description: 'Описание измененного объекта',
    type: Contract,
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async update(
    @Param('stageId') stageId: string,
    @Body() params: UpdateContractStageDto,
  ): Promise<ContractStage> {
    let contractStage: ContractStage | undefined;

    try {
      contractStage = await this.cs.updateContractStage(
        parseInt(stageId),
        params,
      );
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    return contractStage;
  }

  /**
   * REMOVE
   */

  @UseGuards(JwtAuthGuard)
  @Delete('stages/:stageId')
  @ApiImplicitParam({
    name: 'contractId',
    type: String,
    description: 'Идентификатор договора',
  })
  @ApiImplicitParam({
    name: 'stageId',
    type: String,
    description: 'Идентификатор этапа договора',
  })
  @ApiOperation({ summary: 'Удаление этапа договора' })
  @ApiResponse({
    status: 200,
    description: 'Успешное удаление',
  })
  @ApiInternalServerErrorResponse({ description: 'Если что-то пошло не так' })
  async remove(@Param('stageId') stageId: string): Promise<void> {
    await this.cs.removeContractStage(parseInt(stageId));
  }
}
