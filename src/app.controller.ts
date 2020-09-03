import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  HttpCode,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AppService } from './app.service';
import { LoginParams } from './auth/dto/login.dto';
import { IUser, LoginResponse } from './auth/user-info';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@ApiTags('Вспомогательные штуки')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({
    status: 200,
    description: 'Данные для авторизации последующих запросов',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: 'При негодных параметрах входа' })
  async login(
    @Request() req,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() params: LoginParams,
  ): Promise<LoginResponse> {
    // после паспортной магии в реквесте будет юзер, отдадим токен
    return this.authService.login(req.user as IUser);
  }
}
