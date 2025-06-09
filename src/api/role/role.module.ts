import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { User } from '../user/entities/user.entity';
import { CustomLogger } from 'src/utils/logger/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, User]),
    UtilsModule,
    AuthModule,
  ],
  controllers: [RoleController],
  providers: [RoleService, CustomLogger],
})
export class RoleModule { }
