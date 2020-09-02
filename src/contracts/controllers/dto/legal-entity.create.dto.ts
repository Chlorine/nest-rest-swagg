import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length, MinLength } from 'class-validator';

/**
 * Параметры создания нового объекта "Юридическое лицо"
 */
export class CreateLegalEntityDto {
  @IsString()
  @IsNumberString()
  @Length(10, 12)
  @ApiProperty({
    description: 'ИНН',
    example: '2932923932',
  })
  inn: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Название', example: 'ООО Взяткодатель' })
  name: string;
}
