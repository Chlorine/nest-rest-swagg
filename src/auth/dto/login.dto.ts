import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginParams {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'superadmin',
  })
  username: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Пароль',
    example: '1234',
  })
  password: string;
}
