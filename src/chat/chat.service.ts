import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/models/user.entity';
import { Chat } from './models/chat.entity';
import { Message } from './models/message.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private userService: UsersService,
  ) {}

  // async sendMessage(user: User, chat: Chat, text: string): Promise<Message> {
  //   const message = this.messagesRepository.create({ user, chat, text });
  //   return this.messagesRepository.save(message);
  // }

  async sendMessage(text: string, user: any, chat: any): Promise<Message> {
    const message = this.messagesRepository.create({
      text: text,
      user: user,
      chat: chat,
    });
    return this.messagesRepository.save(message);
  }

  async getChatsOfUser(user: User): Promise<Chat[]> {
    return this.chatsRepository.find({ where: { users: user } });
  }

  async getMessages(chatId): Promise<Message[]> {
    return await this.messagesRepository.find({
      where: { chat: { id: chatId } },
      order: { id: 'ASC' },
    });
  }

  async createChat(createChatDto) {
    const user = await this.userService.findOneById(createChatDto.userId);
    const newChat = this.chatsRepository.create({
      name: createChatDto.name,
      users: [user],
    });

    await this.chatsRepository.save(newChat);
    return newChat;
  }

  async getChats() {
    return await this.chatsRepository.find();
  }

  async getChat(id: string) {
    const chat = await this.chatsRepository.findOne({
      where: { id: Number(id) },
      relations: ['messages'],
    });
    return chat;
  }

  // async sendMessage(id: string, sendMessageDto) {
  //   const chat = await this.chatsRepository.findOne(id);
  //   const newMessage = this.messagesRepository.create(sendMessageDto);
  //   newMessage.chat = chat;
  //   await this.messagesRepository.save(newMessage);
  //   return newMessage;
  // }

  async addUser(chatId: string | number, userId: string | number) {
    const chat = await this.chatsRepository.findOne({
      where: { id: Number(chatId) },
      relations: ['users'],
    });

    if (!chat) {
      throw new NotFoundException(`Chat with id ${chatId} not found`);
    }

    const user = await this.userService.findOneById(userId);

    chat.users.push(user);
    await this.chatsRepository.save(chat);
    return chat;
  }

  async removeUser(id: string, userId: string) {
    // const chat = await this.chatsRepository.findOne(id, {
    //   relations: ['users'],
    // });
    const chat = await this.chatsRepository.findOne({
      where: { id: Number(id) },
      relations: ['users'],
    });
    chat.users = chat.users.filter((user) => user.id !== parseInt(userId));
    await this.chatsRepository.save(chat);
    return chat;
  }
}
