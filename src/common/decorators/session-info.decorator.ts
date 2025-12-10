import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Session } from '../types/types';

export const SessionInfo = createParamDecorator(
  (_, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<Request & { session: Session }>().session,
);
