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
import { IUser, UserRole } from './models/user.interface';
import { DeleteResult } from 'typeorm';

import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDTO } from './models/user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthGuard('jwt'))
  getUsers(): Observable<IUser[]> {
    return this.usersService.findAll();
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of user',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @Get('/:id')
  async getUserById(@Param('id') id): Promise<IUser> {
    return await this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of user',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @Delete('/:id')
  deleteUserById(@Param() params): Observable<DeleteResult> {
    return this.usersService.remove(params.id);
  }
}
