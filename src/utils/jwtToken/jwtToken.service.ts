import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { jwtTokenPayload } from './jwtToken.dto';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class JwtTokenService {
  private readonly accessTokenSecretKey: string;
  private readonly accessTokenExpired: string;
  private readonly refreshTokenSecretKey: string;
  private readonly refreshTokenExpired: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly customLogger: CustomLogger,
    private readonly accessTokenService: JwtService,
  ) {
    this.accessTokenSecretKey = this.configService.get<string>(
      'jwt.accessToken.secretKey',
    );
    this.accessTokenExpired = this.configService.get<string>(
      'jwt.accessToken.expired',
    );
    this.refreshTokenSecretKey = this.configService.get<string>(
      'jwt.refreshToken.secretKey',
    );
    this.refreshTokenExpired = this.configService.get<string>(
      'jwt.refreshToken.expired',
    );
  }

  /**,
   * JWT TOKEN UTIL: generate JWT token
   */
  generateJwtToken(
    payload: jwtTokenPayload,
    type: string = 'accessToken',
  ): string {
    try {
      let secretKey: string = this.accessTokenSecretKey;
      let expired: string = this.accessTokenExpired;
      if (type === 'refreshToken') {
        secretKey = this.refreshTokenSecretKey;
        expired = this.refreshTokenExpired;
      }
      // get token
      const token = this.jwtService.sign(payload, {
        secret: secretKey,
        expiresIn: expired,
      });
      return token;
      // return hashedPassword;
    } catch (error) {
      this.customLogger.error('Error while generating JWT token::', error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  /**,
   * JWT TOKEN UTIL: decode JWT token
   */
  decodeJwtToken(accessToken: string): jwtTokenPayload {
    try {
      // decode token
      const jwtPayload: jwtTokenPayload = this.jwtService.decode(accessToken);
      return jwtPayload;
      // return hashedPassword;
    } catch (error) {
      this.customLogger.error('Error while decoding JWT token::', error.stack);
      throw new InternalServerErrorException(error);
    }
  }
}
