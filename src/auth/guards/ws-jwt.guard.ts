import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.token;
    try {
      const decoded = verify(token, process.env.JWT_SECRET);
      client.user = decoded;
      return true;
    } catch (e) {
      return false;
    }
  }
}
