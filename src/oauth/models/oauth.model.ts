import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/models/user.entity';
import { Client } from './client.entity';
import { Token } from './token.entity';
import { AuthorizationCode } from './code.entity';

@Injectable()
export class OauthModel {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
    @InjectRepository(AuthorizationCode)
    private codeRepository: Repository<AuthorizationCode>,
  ) {}

  async getAccessToken(bearerToken: string): Promise<Token> {
    const token = await this.tokensRepository.findOne({
      where: {
        accessToken: bearerToken,
      },
      relations: ['user', 'client'],
    });

    return {
      id: token.id,
      user: token.user,
      client: token.client,
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    };
  }

  async getAuthorizationCode(authorizationCode) {
    const res = await this.codeRepository.findOne({
      where: { code: authorizationCode },
      relations: ['user', 'client'],
    });
    return res;
  }

  async revokeAuthorizationCode(authorizationCode) {
    const code = await this.codeRepository.findOne({
      where: { code: authorizationCode.code },
      relations: ['user', 'client'],
    });

    if (!code) {
      throw new Error('Authorization code not found');
    }

    await this.codeRepository.remove(code);

    return true;
  }

  async getClient(clientId: string, clientSecret: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { clientId, clientSecret },
    });
    // console.log('client: ', client);
    return {
      id: client.id,
      clientId: client.clientId,
      clientSecret: client.clientSecret,
      redirectUris: client.redirectUris,
      grant_type: client.grant_type,
      grants: client.grants,
      // grants: ['authorization_code'],
      // grants: client.grant_type,
    };
  }

  async getRefreshToken(bearerToken: string) {
    // ... existing code ...
  }

  async getUser(username: string, password: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username, password } });
  }

  async saveToken(token, client, user): Promise<Token> {
    const tokens = await this.tokensRepository.findOne({
      where: { client: client.id, user: user.id },
      relations: ['user', 'client'],
      order: {
        accessTokenExpiresAt: 'DESC',
      },
    });
    return tokens;
  }

  async saveAuthorizationCode(code, client, user) {
    const authorizationCode = new AuthorizationCode();
    authorizationCode.code = code.authorizationCode;
    authorizationCode.expiresAt = code.expiresAt;
    authorizationCode.redirectUris = code.redirectUri;
    authorizationCode.client = client;
    authorizationCode.user = user;

    await this.codeRepository.save(authorizationCode);

    return {
      authorizationCode: authorizationCode.code,
      expiresAt: authorizationCode.expiresAt,
      redirectUris: authorizationCode.redirectUris,
      client: { id: client.id },
      user: { id: user.id },
    };
  }

  async verifyScope(token, scope) {
    // Implement your logic to verify the scope here.
    // This is just a placeholder implementation.
    return token.scope === scope;
  }
}
