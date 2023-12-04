import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Observable, from } from 'rxjs';
import { IUser } from 'src/users/models/user.interface';
import { Repository } from 'typeorm';
import { Token } from '../oauth/models/token.entity';
import { UsersService } from 'src/users/users.service';
import { SignUpDTO } from 'src/users/models/user.model';
import { User } from 'src/users/models/user.entity';
import { ClientService } from 'src/oauth/services/client.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private clientService: ClientService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signup(user: SignUpDTO) {
    const passwordHash = await this.hashPassword(user.password);

    const newUser = new User();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.password = passwordHash;
    newUser.isEmailVerified = false;
    newUser.created_on = new Date().toLocaleDateString();
    newUser.last_login = new Date().toLocaleDateString();

    return await this.usersService.signup(newUser);
  }

  async signin(user: any): Promise<any> {
    const validatedUser = await this.validateUser(user.email, user.password);

    if (!validatedUser) {
      throw new UnauthorizedException('Wrong Credentials');
    }

    if (user.clientId) {
      user.clientId = await this.clientService.getClientById(user.clientId);
    }

    const accessToken = this.jwtService.sign(
      { user: validatedUser },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '1h' },
    );
    const refreshToken = this.jwtService.sign(
      { user: validatedUser },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
    );

    const accessTokenExpiresAt = new Date();
    accessTokenExpiresAt.setSeconds(accessTokenExpiresAt.getHours() + 1); // 5 seconds from now

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 7 days from now

    const token = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt,
      refreshTokenExpiresAt: refreshTokenExpiresAt,
      user: validatedUser,
      client: user.clientId,
    };
    await this.tokenRepository.save(token);
    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const match = await this.comparePasswords(password, user.password);

    if (!match) {
      throw new BadRequestException('Wrong password');
    }

    const { password: userPassword, ...result } = user;
    return result;
  }

  // async generateJWT(user: IUser): Promise<string> {
  //   return await this.jwtService.signAsync({ user });
  // }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  comparePasswords(newPassword: string, passwordHash: string): Observable<any> {
    return from(bcrypt.compare(newPassword, passwordHash));
  }

  decodeToken(token: string) {
    const pureToken = token.split(' ')[1];
    if (!pureToken) return this.jwtService.decode(token);

    return this.jwtService.decode(pureToken);
  }

  async refreshToken(refreshToken: string) {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (e) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.usersService.findOneByEmail(payload.email); // Find the user associated with the token

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.jwtService.sign(
      { user: user },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '5s' },
    );

    return { accessToken };
  }

  blackListToken(token) {
    return this.tokenRepository.save(token);
  }

  //   findBlackListedToken(token: string): Promise<Token> {
  //     const data = this.tokenRepository.findOne({ token: token });
  //     return data;
  //   }
}
