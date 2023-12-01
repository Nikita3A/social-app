import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, catchError, switchMap, map } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './models/user.entity';
import { IUser } from './models/user.interface';
import { AuthService } from '../auth/auth.service';
// import { User } from '../users/models/user.entity';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // private readonly authService: AuthService,
  ) {}

  async signup(user): Promise<any> {
    // this.logger.log(`User signup: ${JSON.stringify(user)}`);
    // const passwordHash = await this.authService.hashPassword(user.password);
    // const newUser = new User();
    // newUser.username = user.username;
    // newUser.email = user.email;
    // newUser.password = user.passwordHash;
    // newUser.isEmailVerified = false;
    // newUser.created_on = new Date().toLocaleDateString();
    // newUser.last_login = new Date().toLocaleDateString();

    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  findAll(): Observable<User[]> {
    return from(this.usersRepository.find());
  }

  findOne(id): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneById(id): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  remove(id: string): Observable<DeleteResult> {
    return from(this.usersRepository.delete(id));
  }
}
