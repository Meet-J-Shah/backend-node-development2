import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * DECORATOR: get admin auth data
 * TODO: update interface
 */
export const AdminAuthDecorator: any = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest();
    return request?.adminAuthData || null;
  },
);
