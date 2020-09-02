import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';

/**
 * Параметры модификации объекта "Валюта" (можно передавать не всё (todo: как-нибудь подумать про PATCH))
 */
export class UpdateCurrencyDto {
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @ApiPropertyOptional({
    description: 'Трехбуквенный код валюты (ISO 4217)',
    maxLength: 3,
    minLength: 3,
    example: 'RUB',
  })
  code?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(999)
  @ApiPropertyOptional({
    description: 'Трехзначный код (ISO 4217)',
    example: 643,
  })
  digitCode?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiPropertyOptional({
    description: 'Наименование',
    example: 'Russian ruble',
  })
  name?: string;
}
