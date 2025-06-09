import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const decoratorPermissionKey = this.configService.get<string>(
      'api.decoratorPermissionKey',
    );
    // get permission name
    const requiredPermission: unknown = this.reflector.getAllAndOverride<any>(
      decoratorPermissionKey,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      return false;
    }
    // get admin auth data
    const { adminAuthData } = context.switchToHttp().getRequest();
    if (!adminAuthData) {
      return false;
    }
    const permissionArray = adminAuthData?.permissions;
    if (permissionArray.indexOf(requiredPermission) > -1) {
      return true;
    }
    return false;
  }
}
