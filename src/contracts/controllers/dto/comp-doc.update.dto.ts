import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

/**
 * Параметры модификации объекта "Документ выполнения"
 */
export class UpdateCompDocDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Номер документа',
    example: 'ДВ-001',
  })
  refNumber?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Дата документа в виде строки в формате ISO 8601 (UTC)',
    example: '2017-06-07T14:34:08.700Z',
  })
  timestamp?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'ID типа документа', example: 1001 })
  typeId?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'ID валюты', example: 1001 })
  currencyId?: number;
}
