import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/models/user.entity';
import { Client } from './client.entity';

@Entity('authorization_code')
export class AuthorizationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  code: string;

  @Column('timestamp')
  expiresAt: Date;

  @Column({ length: 500 })
  redirectUris: string;

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => User)
  user: User;
}
