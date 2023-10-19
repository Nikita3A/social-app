import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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
}
