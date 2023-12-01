import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './models/user.entity';
import { Token } from 'src/oauth/models/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  providers: [UsersService],
  controllers: [UsersController],
  // exports: [UsersService],
})
export class UsersModule {}
