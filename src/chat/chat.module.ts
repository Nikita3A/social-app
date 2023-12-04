import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './models/chat.entity';
import { Message } from './models/message.entity';
import { ChatGateway } from './chat.gateway';
import { ChatsController } from './chat.controller';
import { User } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, User])],
  providers: [ChatGateway, ChatService, UsersService],
  controllers: [ChatsController],
})
export class ChatModule {}
