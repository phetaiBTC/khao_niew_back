// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthProfile = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // ถ้าอยากเลือก field: @User('email')
    return data ? user?.[data] : user;
  },
);
