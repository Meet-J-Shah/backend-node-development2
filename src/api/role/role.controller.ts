import {
  UseGuards,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { PermissionDecorator } from '../../decorators/permission.decorator';
import { AdminAuthDecorator } from '../../decorators/adminAuth.decorator';
import { AdminAuthGuard } from '../../guards/adminAuth.guard';
import { GlobalService } from '../../utils/global/global.service';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { rolePermissionsConstant } from './constants/permission.constant';
import {
  ControllerResDto,
  ServiceResDto,
} from '../../utils/global/dto/global.dto';
import {
  FindManyRoleQueryReq,
  PrimaryKeysRoleDto,
  CreateRoleBodyReqDto,
  UpdateRoleBodyReqDto,
  DeleteRoleBodyReqDto,
  UpdateRolePermissionBodyReqDto,
} from './dto/role.dto';

@ApiTags('default - Admin:Roles')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/roles', version: '1' })
@UseGuards(AdminAuthGuard)
export class RoleController {
  constructor(
    private globalService: GlobalService,
    private roleService: RoleService,
  ) {}

  /**
   * ROLE API: find many roles
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(rolePermissionsConstant.ADMIN_ROLE_FIND_ALL)
  @ApiOperation({ summary: 'Find many roles' })
  @ApiResponse({ status: 200, description: 'List of roles returned' })
  async findMany(
    @Query() findManyRoleQueryReq: FindManyRoleQueryReq,
  ): Promise<ControllerResDto<Role[]>> {
    const { page, limit } = findManyRoleQueryReq;
    const { data, pagination }: ServiceResDto<Role[]> =
      await this.roleService.findMany(null, page, limit);
    return this.globalService.setControllerResponse(data, null, pagination);
  }

  /**
   * ROLE API: find one role by role id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(rolePermissionsConstant.ADMIN_ROLE_FIND_ONE)
  @ApiOperation({ summary: 'Find one role by ID' })
  @ApiResponse({ status: 200, description: 'Single role returned' })
  async findOne(
    @Param() finOneRoleParamReqDto: PrimaryKeysRoleDto,
  ): Promise<ControllerResDto<Role>> {
    const { id: roleId } = finOneRoleParamReqDto;
    const serviceResponse: Role = await this.roleService.findOne({
      id: roleId,
    });
    return this.globalService.setControllerResponse(serviceResponse);
  }

  /**
   * ROLE API: create new role
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(rolePermissionsConstant.ADMIN_ROLE_CREATE)
  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse({ status: 200, description: 'Role created successfully' })
  async create(
    @AdminAuthDecorator() adminAuth: any,
    @Body() createRoleBodyReq: CreateRoleBodyReqDto,
  ): Promise<ControllerResDto<Role>> {
    const serviceResponse: Role = await this.roleService.create(
      createRoleBodyReq,
      adminAuth,
    );
    return this.globalService.setControllerResponse(
      serviceResponse,
      'Role created successfully.',
    );
  }

  /**
   * ROLE API: update role by role id
   */
  @Put(':roleId')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(rolePermissionsConstant.ADMIN_ROLE_UPDATE)
  @ApiOperation({ summary: 'Update role by ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  async update(
    @AdminAuthDecorator() adminAuth: any,
    @Param() updateRoleParamReq: PrimaryKeysRoleDto,
    @Body() updateRoleBodyReq: UpdateRoleBodyReqDto,
  ): Promise<ControllerResDto<Role>> {
    const { id: roleId } = updateRoleParamReq;
    const serviceResponse: Role = await this.roleService.update(
      roleId,
      updateRoleBodyReq,
      adminAuth,
    );
    return this.globalService.setControllerResponse(
      serviceResponse,
      'Role updated successfully.',
    );
  }

  /**
   * ROLE API: soft delete role by role id
   */
  @Delete(':roleId')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(rolePermissionsConstant.ADMIN_ROLE_SOFT_DELETE)
  @ApiOperation({ summary: 'Soft delete role by ID' })
  @ApiResponse({ status: 200, description: 'Role soft deleted' })
  async softDelete(
    @AdminAuthDecorator() adminAuth: any,
    @Param() deleteRoleParamReq: PrimaryKeysRoleDto,
  ): Promise<ControllerResDto<{ isDeleted: boolean }>> {
    const { id: roleId } = deleteRoleParamReq;
    const updateRoleBodyReq: DeleteRoleBodyReqDto = {
      hasSoftDeleted: true,
    };
    const serviceResponse: Role = await this.roleService.update(
      roleId,
      updateRoleBodyReq,
      adminAuth,
    );
    return this.globalService.setControllerResponse(
      { isDeleted: serviceResponse ? true : false },
      'Role deleted successfully.',
    );
  }

  /**
   * ROLE API: rollback soft deleted role by role id
   */
  @Put(':roleId/rollback')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(rolePermissionsConstant.ADMIN_ROLE_ROLLBACK)
  @ApiOperation({ summary: 'Rollback soft deleted role by ID' })
  @ApiResponse({ status: 200, description: 'Soft delete rollback successful' })
  async rollback(
    @AdminAuthDecorator() adminAuth: any,
    @Param() deleteRoleParamReq: PrimaryKeysRoleDto,
  ): Promise<ControllerResDto<Role>> {
    const { id: roleId } = deleteRoleParamReq;
    const updateRoleBodyReq: DeleteRoleBodyReqDto = {
      hasSoftDeleted: false,
    };
    const serviceResponse: Role = await this.roleService.update(
      roleId,
      updateRoleBodyReq,
      adminAuth,
      true,
    );
    return this.globalService.setControllerResponse(
      serviceResponse,
      'Deleted role rollback successfully.',
    );
  }

  /**
   * ROLE API: hard delete role by role id
   */
  @Delete(':roleId/permanent')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(rolePermissionsConstant.ADMIN_ROLE_HARD_DELETE)
  @ApiOperation({ summary: 'Hard delete role by ID' })
  @ApiResponse({ status: 200, description: 'Role permanently deleted' })
  async hardDelete(
    @Param() deleteRoleParamReq: PrimaryKeysRoleDto,
  ): Promise<ControllerResDto<{ isDeleted: boolean }>> {
    const { id: roleId } = deleteRoleParamReq;
    const isDeleted: boolean = await this.roleService.delete(roleId);
    return this.globalService.setControllerResponse(
      isDeleted,
      'Role deleted successfully.',
    );
  }

  /**
   * ROLE API: update permission into role by role id
   */
  @Put(':roleId/permissions')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(rolePermissionsConstant.ADMIN_ROLE_UPDATE_PERMISSION)
  @ApiOperation({ summary: 'Update permissions for role' })
  @ApiResponse({ status: 200, description: 'Role permissions updated' })
  async updatePermission(
    @AdminAuthDecorator() adminAuth: any,
    @Param() updateRoleParamReq: PrimaryKeysRoleDto,
    @Body() updateRolePermissionBodyReq: UpdateRolePermissionBodyReqDto,
  ): Promise<ControllerResDto<Role>> {
    const { id: roleId } = updateRoleParamReq;
    const serviceResponse: Role = await this.roleService.updatePermissions(
      roleId,
      updateRolePermissionBodyReq,
      adminAuth,
    );
    return this.globalService.setControllerResponse(
      serviceResponse,
      'Role updated with permission successfully.',
    );
  }
}
