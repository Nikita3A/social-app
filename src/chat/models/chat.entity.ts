import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/users/models/user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.chats)
  users: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
