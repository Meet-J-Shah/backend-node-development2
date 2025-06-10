import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../api/auth/auth.service';
import { Role } from '../api/role/entities/role.entity';
import { AdminAuthDto } from '../api/auth/dto/auth.dto';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get authorization parameters from headers object
    const request: any = context.switchToHttp().getRequest();
    const authorization: string =
      request.headers.authorization || request.headers.Authorization;
    const authToken: string[] =
      authorization && authorization.toString().split(' ');
    // validate token format
    if (!authToken || authToken.length !== 2) {
      throw new UnauthorizedException('Please provide token');
    }
    const scheme: string = authToken[0];
    const accessToken: string = authToken[1];
    // validate token is exist or not
    if (scheme !== 'Bearer' || !accessToken) {
      throw new UnauthorizedException('Please provide token');
    }
    // validate access token with DB record
    const adminAuthData: AdminAuthDto<Role> | boolean =
      await this.authService.validateToken(accessToken, true);
    if (!adminAuthData) {
      throw new UnauthorizedException('Unauthorized request');
    }
    request.adminAuthData = adminAuthData;
    return true;
  }
}
