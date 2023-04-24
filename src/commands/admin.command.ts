import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Command, Console } from 'nestjs-console';

import { AdminService } from '../admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';

@Injectable()
@Console({
  command: 'admin',
})
export class AdminCommand {
  private readonly logger = new Logger(AdminCommand.name);
  constructor(private readonly adminService: AdminService) {}

  @Command({
    command: 'create <email> <password>',
    description: 'Create a new admin account',
  })
  async createAdmin(email: string, password: string): Promise<void> {
    const createAdminDto = plainToInstance(CreateAdminDto, { email, password });
    const errors = await validate(createAdminDto);

    if (errors.length > 0) {
      this.logger.error('Validation failed:', errors[0].constraints);
      return;
    }
    await this.adminService.createAdmin(createAdminDto);
    this.logger.log(`Admin account created with email: ${email}`);
  }
}
