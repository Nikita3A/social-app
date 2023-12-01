import { Module } from '@nestjs/common';
import { OauthService } from './services/oauth.service';
import { OauthController } from './oauth.controller';
import { OauthModel } from './models/oauth.model';
import { Client } from './models/client.entity';
import { Token } from './models/token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/models/user.entity';
import { ClientService } from './services/client.service';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthorizationCode } from './models/code.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Client, Token, User, AuthorizationCode]),
  ],
  providers: [OauthService, ClientService, UsersService, OauthModel],
  controllers: [OauthController],
})
export class OauthModule {}
