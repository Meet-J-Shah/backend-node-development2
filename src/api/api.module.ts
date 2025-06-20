import { PizzaModule } from './pizza/pizza.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';
import { CrudGeneratorModule } from './crudGenerator/crudGenerator.module';
import { GenerateModule } from './generator/generate.module';

@Module({
  imports: [
    PizzaModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    UserModule,
    CrudGeneratorModule,
    GenerateModule,
  ],
})
export class ApiModule {}
