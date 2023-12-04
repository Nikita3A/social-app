// token.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/models/user.entity'; // assuming you have a User entity defined
import { Client } from './client.entity';

@Entity()
export class Token {
  // @PrimaryGeneratedColumn()
  // id: number;

  // @Column()
  // accessToken: string;

  // @Column({ nullable: true })
  // refreshToken: string;

  // @ManyToOne(() => User)
  // user: User;

  // @ManyToOne(() => Client)
  // client: Client;
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text' })
  accessToken: string;

  @Column({ type: 'timestamp without time zone' })
  accessTokenExpiresAt: Date;

  @Column({ type: 'text' })
  refreshToken: string;

  @Column({ type: 'timestamp without time zone' })
  refreshTokenExpiresAt: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Client)
  client: Client;
}
