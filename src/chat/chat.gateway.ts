import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { ChatService } from './chat.service';

// @UseGuards(WsJwtGuard)
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: ['http://localhost:3006', 'http://localhost:5173'],
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    credentials: true,
  },
})
// @WebSocketGateway({ namespace: '/socket' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  // @SubscribeMessage('joinChat')
  // async handleJoinChat(client: Socket, chatId: string, userId: string) {
  //   console.log('Joned chat: ', chatId);
  //   await this.server.in(userId).socketsJoin(chatId);
  //   // await this.userService.addUserToRoom(payload.roomName, payload.user)
  //   // client.join(chatId);
  // }

  @SubscribeMessage('joinChat')
  async handleJoinChat(client: Socket, chatId: string) {
    console.log('Joned chat: ', chatId);
    client.join(chatId);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, chatId: string): void {
    client.leave(chatId);
  }

  // @SubscribeMessage('messageToServer')
  // handleMessagg(client: Socket, payload: string): void {
  //   console.log(`Received message "${payload}" from client ${client.id}`);
  //   this.server.emit('messageToClient', `Hello, you sent "${payload}"`);
  // }

  @SubscribeMessage('requestMessages')
  async handleMessage(client: Socket, chatId: string): Promise<void> {
    try {
      const messages = await this.chatService.getMessages(chatId); // Fetch messages from the database
      console.log('Getting msgs: ', messages);
      console.log('chatId: ', chatId);

      // client.emit('chatToClient', messages); // Emit the messages to the client
      this.server.to(chatId).emit('chatToClient', messages);
      // this.server.emit('chatToClient', messages); // works but emit to all chats
    } catch (error) {
      console.error('Error fetching messages: ', error);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { chatId: string; text: string; userId: string },
  ) {
    // Save the new message to the database
    const newMessage = await this.chatService.sendMessage(
      payload.text,
      payload.userId,
      payload.chatId,
    );
    // Emit the new message to all clients in the chat room
    // this.server.to(payload.chatId).emit('newMessage', newMessage);
    // this.server.emit('newMessage', newMessage);

    // newMessage.user = { ...newMessage.user, id: Number(payload.userId) };
    console.log('new: ', newMessage);
    const messages = await this.chatService.getMessages(payload.chatId); // Fetch messages from the database
    this.server.to(payload.chatId).emit('chatToClient', messages);

    // this.server.to(payload.chatId).emit('newMessage', newMessage);
  }

  @SubscribeMessage('chatToServer')
  handleMessages(client: Socket, payload: string): void {
    console.log('pp: ', payload);

    this.server.emit('chatToClient', payload);
  }

  afterInit(server: Server) {
    console.log('afterInit');

    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected');

    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
