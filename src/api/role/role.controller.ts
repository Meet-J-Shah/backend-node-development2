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

import { PermissionDecorator } from '../../decorators/permission.decorator';
import { AdminAuthDecorator } from '../../decorators/adminAuth.decorator';
import { AdminAuthGuard } from '../../guards/adminAuth.guard';
import { GlobalService } from '../../utils/global/global.service';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { rolePermissionsConstant } from './constants/permission.constant';
import { ControllerResDto, ServiceResDto } from '../../utils/global/dto/global.dto';
import {
  FindManyRoleQueryReq,
  FindOneRoleParamReqDto,
  CreateRoleBodyReqDto,
  UpdateRoleBodyReqDto,
  DeleteRoleBodyReqDto,
  UpdateRolePermissionBodyReqDto,
} from './dto/role.dto';

@Controller({ path: 'admin/roles', version: '1' })
@UseGuards(AdminAuthGuard)
export class RoleController {
  constructor(
    private globalService: GlobalService,
    private roleService: RoleService,
  ) { }

  /**
   * ROLE API: find many roles
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(rolePermissionsConstant.ADMIN_ROLE_FIND_ALL)
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
  @Get(':roleId')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(rolePermissionsConstant.ADMIN_ROLE_FIND_ONE)
  async findOne(
    @Param() finOneRoleParamReqDto: FindOneRoleParamReqDto,
  ): Promise<ControllerResDto<Role>> {
    const { roleId } = finOneRoleParamReqDto;
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
  async update(
    @AdminAuthDecorator() adminAuth: any,
    @Param() updateRoleParamReq: FindOneRoleParamReqDto,
    @Body() updateRoleBodyReq: UpdateRoleBodyReqDto,
  ): Promise<ControllerResDto<Role>> {
    const { roleId } = updateRoleParamReq;
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
  async softDelete(
    @AdminAuthDecorator() adminAuth: any,
    @Param() deleteRoleParamReq: FindOneRoleParamReqDto,
  ): Promise<ControllerResDto<{ isDeleted: boolean; }>> {
    const { roleId } = deleteRoleParamReq;
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
  async rollback(
    @AdminAuthDecorator() adminAuth: any,
    @Param() deleteRoleParamReq: FindOneRoleParamReqDto,
  ): Promise<ControllerResDto<Role>> {
    const { roleId } = deleteRoleParamReq;
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
  async hardDelete(
    @Param() deleteRoleParamReq: FindOneRoleParamReqDto,
  ): Promise<ControllerResDto<{ isDeleted: boolean; }>> {
    const { roleId } = deleteRoleParamReq;
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
  async updatePermission(
    @AdminAuthDecorator() adminAuth: any,
    @Param() updateRoleParamReq: FindOneRoleParamReqDto,
    @Body() updateRolePermissionBodyReq: UpdateRolePermissionBodyReqDto,
  ): Promise<ControllerResDto<Role>> {
    const { roleId } = updateRoleParamReq;
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
