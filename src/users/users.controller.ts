import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';
import { User, UserRole } from './models/user.interface';
import { DeleteResult } from 'typeorm';

import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDTO } from './models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('hello')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  getHello(): string {
    return this.usersService.getHello();
  }

  @Get('users')
  getUsers(): Observable<User[]> {
    return this.usersService.findAll();
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of user',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @Get('users/:id')
  async getUserById(@Param('id') id): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of user',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @Delete('users/:id')
  deleteUserById(@Param() params): Observable<DeleteResult> {
    return this.usersService.remove(params.id);
  }
}
