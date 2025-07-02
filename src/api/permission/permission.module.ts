import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { AdminPermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { CustomLogger } from 'src/utils/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), UtilsModule, AuthModule],
  controllers: [AdminPermissionController],
  providers: [PermissionService, CustomLogger],
})
export class PermissionModule {}
