import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ChatService } from './chat.service';
// import { CreateChatDto, SendMessageDto, AddUserDto } from './dto'; // You need to define these DTOs

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatService) {}
  @Post()
  async createChat(@Body() createChatDto) {
    return this.chatService.createChat(createChatDto);
  }

  @Get()
  async getChats() {
    return this.chatService.getChats();
  }

  @Get(':id')
  async getChat(@Param('id') id: string) {
    return this.chatService.getChat(id);
  }

  //   @Post(':id/messages')
  //   async sendMessage(@Param('id') id: string, @Body() sendMessageDto) {
  //     return this.chatService.sendMessage(id, sendMessageDto);
  //   }

  @Put(':id/users/:userId')
  async addUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.chatService.addUser(id, userId);
  }

  @Delete(':id/users/:userId')
  async removeUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.chatService.removeUser(id, userId);
  }
}
