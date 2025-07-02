import { Injectable, UnauthorizedException } from '@nestjs/common';

import { BcryptService } from '../../utils/bcrypt/bcrypt.service';
import { JwtTokenService } from '../../utils/jwtToken/jwtToken.service';
import { UserService } from '../user/user.service';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { User } from '../user/entities/user.entity';
import { jwtTokenPayload } from '../../utils/jwtToken/jwtToken.dto';
import { LoginResDto, AdminAuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtTokenService: JwtTokenService,
    private bcryptService: BcryptService,
  ) {}

  /**
   * admin login service
   */
  async login(email: string, password: string): Promise<LoginResDto> {
    const user: User = await this.userService.findOneForAuth(
      { email },
      true,
      true,
    );
    if (!user) {
      throw new UnauthorizedException('No User Found');
    }
    const isPasswordMatch: boolean = await this.bcryptService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Email or password.');
    }
    const userPayload: jwtTokenPayload = {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    };
    const accessToken: string =
      this.jwtTokenService.generateJwtToken(userPayload);
    const refreshToken: string = this.jwtTokenService.generateJwtToken(
      userPayload,
      'refreshToken',
    );
    delete user.password;
    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * validate admin auth token
   */
  async validateToken(
    accessToken: string,
    isAdmin: true,
  ): Promise<AdminAuthDto<Role> | boolean> {
    const jwtPayload: jwtTokenPayload =
      this.jwtTokenService.decodeJwtToken(accessToken);
    if (!jwtPayload) {
      return false;
    }
    // check is token expired?
    const currentDate: number = Date.now();
    const expiredDate: Date = new Date(jwtPayload?.exp * 1000);
    const isExpired: boolean = new Date(currentDate) <= new Date(expiredDate);
    if (!isExpired) {
      return false;
    }
    const userData: User = await this.userService.findOneForAuth(
      {
        id: jwtPayload?.id,
        email: jwtPayload?.email,
      },
      isAdmin,
    );
    if (!userData) {
      return false;
    }
    const permissionArray: string[] = [];
    userData?.roles.forEach((role: Role, key: number) => {
      role?.permissions.forEach((permission: Permission) => {
        permissionArray.push(permission.slug);
      });
      delete userData.roles[key].permissions;
    });
    return {
      ...userData,
      permissions: permissionArray,
    };
  }
}
