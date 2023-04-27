import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { LocalAuthGuard } from './guards';

import { CurrentUser } from '../common/decorators';
import { UserResponse } from '../types';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Rejestruje użytkownika i aktywuje konto' })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ description: 'Użytkownik zarejestrowany i konto aktywowane' })
  @HttpCode(HttpStatus.OK)
  @Patch('register')
  register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Loguje użytkownika i zwraca tokeny w cookies' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Użytkownik zalogowany i tokeny w cookies' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Nieprawidłowe dane logowania' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    return this.authService.login(user, res);
  }
}
