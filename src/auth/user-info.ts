import { ApiProperty } from '@nestjs/swagger';

export interface IUser {
  id: number;
  username: string;
}

export class UserInfo {
  @ApiProperty({ example: 1001, description: 'Идентификатор пользователя' })
  id: number;

  @ApiProperty({ example: 'superadmin', description: 'Имя пользователя' })
  username: string;
}

export class LoginResponse {
  @ApiProperty({ example: '%some_token%', description: 'Токен авторизации' })
  access_token: string;
}
