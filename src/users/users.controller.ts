import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '../authentication/jwt.guard';
import MongooseClassSerializerInterceptor from '../shared/interceptors/mongooseClassSerializer.interceptor';

import { User } from './user.schema';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @Get()
  async getUsers() {
    let users = await this.usersService.getAll();
    return users;
  }
}
