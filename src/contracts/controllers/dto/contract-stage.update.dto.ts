import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * Параметры модификации объекта "Этап договора"
 */
export class UpdateContractStageDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Номер этапа договора',
    example: 'ЭД-0001',
  })
  refNumber?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Дата начала этапа в виде строки в формате ISO 8601 (UTC)',
    example: '2017-06-07T14:34:08.700Z',
  })
  startTime?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Дата окончания этапа в виде строки в формате ISO 8601 (UTC)',
    example: '2017-06-07T14:34:08.700Z',
  })
  endTime?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Единица измерения', example: 'Фунт' })
  unit?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Сумма', example: 99.98 })
  sum?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'Количество', example: 12 })
  quantity?: number;
}
