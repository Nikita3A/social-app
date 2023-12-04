import { Chat } from 'src/chat/models/chat.entity';
import { Message } from 'src/chat/models/message.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date' })
  created_on: string;

  @Column({ type: 'date' })
  last_login: string;

  @Column()
  isEmailVerified: boolean;

  // @ManyToMany(() => Chat, (chat) => chat.users)
  // @JoinTable()
  // chats: Chat[];
  @ManyToMany(() => Chat, (chat) => chat.users)
  @JoinTable({
    name: 'user_chats_chat', // name of the table that will be created in the database
    joinColumn: {
      name: 'userId', // column name in the junction table
      referencedColumnName: 'id', // column name in the owner entity
    },
    inverseJoinColumn: {
      name: 'chatId', // column name in the junction table
      referencedColumnName: 'id', // column name in the inverse entity
    },
  })
  chats: Chat[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
