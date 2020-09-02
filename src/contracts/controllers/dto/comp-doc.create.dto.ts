import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString } from 'class-validator';

/**
 * Параметры создания нового объекта "Документ выполнения"
 */
export class CreateCompDocDto {
  @IsString()
  @ApiProperty({
    description: 'Номер документа',
    example: 'ДВ-001',
  })
  refNumber: string;

  @IsDateString()
  @ApiProperty({
    description: 'Дата документа в виде строки в формате ISO 8601 (UTC)',
    example: '2017-06-07T14:34:08.700Z',
  })
  timestamp: string;

  @IsInt()
  @ApiProperty({ description: 'ID типа документа', example: 1001 })
  typeId: number;

  @IsInt()
  @ApiProperty({ description: 'ID валюты', example: 1001 })
  currencyId: number;
}
