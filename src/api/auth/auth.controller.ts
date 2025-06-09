import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { GlobalService } from '../../utils/global/global.service';
import { AuthService } from './auth.service';
import { ControllerResDto } from '../../utils/global/dto/global.dto';
import { LoginReqDto, LoginResDto } from './dto/auth.dto';

@Controller({ path: 'admin/auth', version: '1' })
export class AuthController {
  constructor(
    private globalService: GlobalService,
    private authService: AuthService,
  ) {}

  /**
   * Admin login api
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginReqDto,
  ): Promise<ControllerResDto<LoginResDto>> {
    const authData: LoginResDto = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return this.globalService.setControllerResponse(
      authData,
      'Logged in successfully.',
    );
  }
}
