import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let token;
    request.rawHeaders.map((element) => {
      if (element.includes('Bearer')) token = element;
    });

    // const isBlacklisted = await this.authService.findBlackListedToken(token);

    // if (isBlacklisted) {
    //   throw new HttpException('You need to signin', HttpStatus.FORBIDDEN);
    // } else {
    //   return true;
    // }
    return true;
  }
}
