import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsString } from 'class-validator';

/**
 * Параметры создания нового объекта "Фактура"
 */
export class CreateInvoiceDto {
  @IsInt()
  @ApiProperty({ description: 'ID этапа договора', example: 1001 })
  contractStageId: number;

  @IsDateString()
  @ApiProperty({
    description: 'Дата выполнения в виде строки в формате ISO 8601 (UTC)',
    example: '2017-06-07T14:34:08.700Z',
  })
  timestamp: string;

  @IsString()
  @ApiProperty({ description: 'Позиция', example: 'Некоторая_позиция' })
  position: string;

  @IsNumber()
  @ApiProperty({ description: 'Сумма', example: 99.98 })
  sum: number;

  @IsInt()
  @ApiProperty({ description: 'Количество', example: 4 })
  quantity: number;
}
