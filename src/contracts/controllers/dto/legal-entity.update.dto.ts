import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

/**
 * Параметры модификации объекта "Юридическое лицо"
 */
export class UpdateLegalEntityDto {
  @IsOptional()
  @IsNumberString()
  @Length(10, 12)
  @ApiPropertyOptional({
    description: 'ИНН',
    example: '2932932932',
  })
  inn?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiPropertyOptional({
    description: 'Название',
    example: 'ООО Взяткодатель',
  })
  name?: string;
}
