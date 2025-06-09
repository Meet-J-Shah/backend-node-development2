import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, FindOptionsWhere } from 'typeorm';

import { GlobalService } from '../../utils/global/global.service';
import { ModelService } from '../../utils/model/model.service';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { User } from '../user/entities/user.entity';
import {
  PaginationResDto,
  ServiceResDto,
  TypeOrmDeleteResult,
} from '../../utils/global/dto/global.dto';
import { DeleteRollBackDto } from '../../utils/model/model.dto';
import {
  RoleFullBodyReqDto,
  UpdateRolePermissionBodyReqDto,
} from './dto/role.dto';
import { CustomLogger } from 'src/utils/logger/logger.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private globalService: GlobalService,
    private modelService: ModelService,
    private readonly customLogger: CustomLogger,
  ) {}

  /**
   * ROLE SERVICE: find many roles
   */
  async findMany(
    where: FindOptionsWhere<Role> = {},
    page: number,
    limit: number,
  ): Promise<ServiceResDto<Role[]>> {
    try {
      const skipRecord: number = this.globalService.getSkipRecord(page, limit);
      const [dataArray, dataCount]: [Role[], number] =
        await this.roleRepository.findAndCount({
          select: Role.selectFields,
          relations: Role.relationalFields,
          where,
          take: limit,
          skip: skipRecord,
        });
      const paginationData: PaginationResDto = this.globalService.setPagination(
        page,
        limit,
        dataCount,
      );
      return {
        data: dataArray,
        pagination: paginationData,
      };
    } catch (error) {
      this.customLogger.error('Error while finding roles::', error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * ROLE SERVICE: find one role by role id
   */
  async findOne(where: FindOptionsWhere<Role> = {}): Promise<Role> {
    try {
      const roleData: Role = await this.roleRepository.findOne({
        select: Role.selectFields,
        relations: { ...Role.relationalFields, permissions: true },
        where: {
          ...where,
        },
      });
      if (!roleData) {
        throw new BadRequestException('Role not exists');
      }
      return roleData;
    } catch (error) {
      this.customLogger.error('Failed to find role::', error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * ROLE SERVICE: create new role
   */
  async create(
    createRoleBodyReq: RoleFullBodyReqDto,
    createdByUser: User,
  ): Promise<Role> {
    try {
      const roleData: Role = await this.roleRepository.findOne({
        select: Role.selectFields,
        relations: Role.relationalFields,
        where: {
          name: createRoleBodyReq?.name,
        },
      });
      if (roleData) {
        throw new BadRequestException('Role already exists');
      }
      const createRole: Role = this.roleRepository.create({
        ...createRoleBodyReq,
        isAdmin: true,
        createdBy: createdByUser,
        updatedBy: createdByUser,
      });
      const saveRole: Role = await this.roleRepository.save(createRole);
      if (!saveRole) {
        throw new BadRequestException('Fail to create');
      }
      return this.modelService.removeUserBy(saveRole);
    } catch (error) {
      this.customLogger.error('Error while creating new role::', error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * ROLE SERVICE: update role by role id
   */
  async update(
    roleId: string,
    updateRoleBodyReq: RoleFullBodyReqDto,
    updatedByUser: User,
    isRollback: boolean = false,
  ): Promise<Role> {
    try {
      const rollbackObj: DeleteRollBackDto = {};
      if (isRollback) {
        rollbackObj.withDeleted = true;
      }
      // find role in db
      let roleData: Role = await this.roleRepository.findOne({
        select: Role.selectFields,
        relations: Role.relationalFields,
        where: {
          id: roleId,
        },
        ...rollbackObj,
      });
      if (!roleData) {
        throw new BadRequestException('Role not exists');
      }
      // for update name, checking same name exist
      if (updateRoleBodyReq?.name) {
        const existRoleData: Role = await this.roleRepository.findOne({
          select: Role.selectFields,
          where: {
            name: updateRoleBodyReq.name,
            id: Not(roleId),
          },
        });
        if (existRoleData) {
          throw new BadRequestException('Role already exists with this name');
        }
      }
      // updating data
      roleData = this.modelService.updateModelValue(
        roleData,
        updateRoleBodyReq,
        updatedByUser,
      );
      const updateRole = await this.roleRepository.save(roleData);
      if (!updateRole) {
        throw new BadRequestException('Fail to update');
      }
      return this.modelService.removeUserBy(roleData);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * ROLE SERVICE: hard delete role by role id
   */
  async delete(roleId: string): Promise<boolean> {
    try {
      const roleData: Role = await this.roleRepository.findOne({
        select: { ...Role.selectFields, deletedAt: true },
        where: {
          id: roleId,
        },
        withDeleted: true,
      });
      if (!roleData) {
        throw new BadRequestException('Role are not exists');
      }
      if (!roleData?.deletedAt) {
        throw new BadRequestException(
          'This action work for soft deleted record.',
        );
      }
      const deleteRole: TypeOrmDeleteResult =
        await this.roleRepository.delete(roleId);
      return deleteRole.affected ? true : false;
    } catch (error) {
      this.customLogger.error('Error while deleting role::', error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * ROLE SERVICE: update permission into role by role id
   */
  async updatePermissions(
    roleId: string,
    updateRolePermissionBodyReq: UpdateRolePermissionBodyReqDto,
    updatedByUser: User,
  ): Promise<Role> {
    try {
      // find role in db
      let roleData: Role = await this.roleRepository.findOne({
        select: Role.selectFields,
        relations: { ...Role.relationalFields, permissions: true },
        where: {
          id: roleId,
        },
      });
      if (!roleData) {
        throw new BadRequestException('Role not exists');
      }
      let permissionArray: Permission[] = roleData?.permissions;
      // add permissions
      const addPermissionIdArray: string[] = [
        ...new Set(updateRolePermissionBodyReq?.connect || []),
      ];
      if (addPermissionIdArray.length > 0) {
        const newPermissionArray: Permission[] =
          await this.permissionRepository.find({
            where: {
              id: In(addPermissionIdArray),
            },
          });
        if (newPermissionArray.length < addPermissionIdArray.length) {
          throw new BadRequestException(
            'Some permissions are not exists in system.',
          );
        }
        permissionArray = [...permissionArray, ...newPermissionArray];
      }
      // remove permissions
      const removePermissionIdArray: string[] = [
        ...new Set(updateRolePermissionBodyReq?.disconnect || []),
      ];
      if (removePermissionIdArray.length > 0) {
        permissionArray = permissionArray.filter(
          (permission) => !removePermissionIdArray.includes(permission.id),
        );
        console.log(permissionArray);
      }
      // remove duplicate record
      permissionArray = permissionArray.filter(
        (permission, index, self) =>
          index === self.findIndex((p) => p.id === permission.id),
      );
      // updating permission data
      roleData = this.modelService.updateModelValue(
        roleData,
        { permissions: permissionArray },
        updatedByUser,
      );
      const updateRole = await this.roleRepository.save(roleData);
      if (!updateRole) {
        throw new BadRequestException('Fail to update permissions');
      }
      return this.modelService.removeUserBy(roleData);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
