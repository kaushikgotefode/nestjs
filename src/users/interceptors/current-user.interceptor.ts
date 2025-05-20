import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(public usersService: UsersService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context
      .switchToHttp()
      .getRequest<{ session: { userId: string }; currentUser?: any }>();
    const { userId } = request.session || {};
    if (!userId) {
      throw new BadRequestException('User not found');
    }

    return this.usersService.findOne(+userId).then((user) => {
      request.currentUser = user;
      return next.handle();
    });
  }
}
