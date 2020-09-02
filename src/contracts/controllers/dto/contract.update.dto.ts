import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * Параметры модификации объекта "Договор"
 */
export class UpdateContractDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Номер договора',
    example: 'Д-001',
  })
  refNumber: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Дата договора в виде строки в формате ISO 8601 (UTC)',
    example: '2017-06-07T14:34:08.700Z',
  })
  timestamp: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'ID типа договора', example: 1001 })
  typeId: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'ID юрлица, явл. поставщиком', example: 1001 })
  supplierId: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'ID юрлица, явл. плательщиком', example: 1001 })
  payerId: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'ID валюты', example: 1001 })
  currencyId: number;
}
