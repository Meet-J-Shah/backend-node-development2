import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtTokenService } from './jwtToken.service';
import { CustomLogger } from '../logger/logger.service';

@Module({
  imports: [JwtModule],
  providers: [JwtTokenService, CustomLogger],
  exports: [JwtTokenService],
})
export class JwtTokenModule { }
