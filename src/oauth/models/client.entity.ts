import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column({ nullable: true })
  // redirect_uri: string;
  redirectUris: string;

  @Column('simple-array')
  grant_type: string[];

  @Column('simple-array', { nullable: true })
  grants: string[];
}
// Common grant types include authorization_code, password, client_credentials, and refresh_token
