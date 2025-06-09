import { Module, Global } from '@nestjs/common';
import { GlobalModule } from './global/global.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { JwtTokenModule } from './jwtToken/jwtToken.module';
import { ModelModule } from './model/model.module';

@Global()
@Module({
  imports: [GlobalModule, BcryptModule, JwtTokenModule, ModelModule],
  exports: [GlobalModule, BcryptModule, JwtTokenModule, ModelModule],
})
export class UtilsModule { }
