import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, catchError, switchMap, map } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './models/user.entity';
import { User } from './models/user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  getHello(): string {
    return 'Hello World from users/hello!';
  }

  findAll(): Observable<User[]> {
    return from(this.usersRepository.find());
  }

  findOne(id): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findOneById(id): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  remove(id: string): Observable<DeleteResult> {
    return from(this.usersRepository.delete(id));
  }
}
