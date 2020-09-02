import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length, Max, Min, MinLength } from 'class-validator';

/**
 * Параметры создания нового объекта "Валюта"
 */
export class CreateCurrencyDto {
  @IsString()
  @Length(3, 3)
  @ApiProperty({
    description: 'Трехбуквенный код валюты (ISO 4217)',
    maxLength: 3,
    minLength: 3,
    example: 'RUB',
  })
  code: string;

  @IsInt()
  @Min(1)
  @Max(999)
  @ApiProperty({ description: 'Трехзначный код (ISO 4217)', example: 643 })
  digitCode: number;

  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Наименование', example: 'Russian ruble' })
  name: string;
}
