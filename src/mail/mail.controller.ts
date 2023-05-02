import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUser } from 'src/common';
import { User } from 'src/users/entities/user.entity';

import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/register')
  async sendRegisterConfirmation(@CurrentUser() user: User): Promise<void> {
    await this.mailService.sendRegisterConfirmation(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/reset-pwd')
  async resetPassword(@CurrentUser() user: User): Promise<void> {
    await this.mailService.resetPassword(user);
  }
}
