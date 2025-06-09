import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor() { }
  /**
   * BCRYPT UTIL: generate password
   */
  async generatePassword(password: string): Promise<any> {
    try {
      const saltRounds: number = 10;
      return bcrypt.hash(password, saltRounds);
      // return hashedPassword;
    } catch (error) {
      // TODO: Create common function
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to generate password.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  /**
   * BCRYPT UTIL: generate password
   */
  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    try {
      return bcrypt.compare(password, hashPassword);
    } catch (error) {
      // TODO: Create common function
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to generate password.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
