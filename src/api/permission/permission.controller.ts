/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  UseGuards,
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { PermissionDecorator } from '../../decorators/permission.decorator';
import { AdminAuthGuard } from '../../guards/adminAuth.guard';
import { GlobalService } from '../../utils/global/global.service';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { permissionPermissionsConstant } from './constants/permission.constant';
import {
  ControllerResDto,
  ServiceResDto,
} from '../../utils/global/dto/global.dto';
import {
  FindManyPermissionQueryReq,
  PrimaryKeysPermissionDto,
} from './dto/permission.dto';

@ApiTags('default - Admin: Permissions')
@ApiBearerAuth('access-token')
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
  @PermissionDecorator(permissionPermissionsConstant.ADMIN_PERMISSION_FIND_ALL)
  @ApiOperation({ summary: 'Find all permissions with pagination' })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    example: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    example: 10,
    description: 'Number of records per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of permissions returned successfully',
    type: ControllerResDto, // You can use a generic wrapper type here if available
  })
  async findMany(
    @Query() findManyRoleQueryReq: FindManyPermissionQueryReq,
  ): Promise<ControllerResDto<Permission[]>> {
    const { page, limit } = findManyRoleQueryReq;
    const { data, pagination }: ServiceResDto<Permission[]> =
      await this.permissionService.findMany(null, page, limit);
    return this.globalService.setControllerResponse(data, null, pagination);
  }
}
