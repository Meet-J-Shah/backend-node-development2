import {
  UseGuards,
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { PermissionDecorator } from '../../decorators/permission.decorator';
import { AdminAuthGuard } from '../../guards/adminAuth.guard';
import { GlobalService } from '../../utils/global/global.service';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { permissionPermissionConstant } from './constants/permission.constant';
import {
  ControllerResDto,
  ServiceResDto,
} from '../../utils/global/dto/global.dto';
import { FindManyPermissionQueryReq } from './dto/permission.dto';

@Controller({ path: 'admin/permissions', version: '1' })
@UseGuards(AdminAuthGuard)
export class AdminPermissionController {
  constructor(
    private globalService: GlobalService,
    private permissionService: PermissionService,
  ) {}

  /**
   * PERMISSION API: find many permissions
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(permissionPermissionConstant.ADMIN_PERMISSION_FIND_ALL)
  async findMany(
    @Query() findManyRoleQueryReq: FindManyPermissionQueryReq,
  ): Promise<ControllerResDto<Permission[]>> {
    const { page, limit } = findManyRoleQueryReq;
    const { data, pagination }: ServiceResDto<Permission[]> =
      await this.permissionService.findMany(null, page, limit);
    return this.globalService.setControllerResponse(data, null, pagination);
  }
}
