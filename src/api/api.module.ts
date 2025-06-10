import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';
import { CrudGeneratorModule } from './crudGenerator/crudGenerator.module';

@Module({
  imports: [
    AuthModule,
    RoleModule,
    PermissionModule,
    UserModule,
    CrudGeneratorModule,
  ],
})
export class ApiModule {}
