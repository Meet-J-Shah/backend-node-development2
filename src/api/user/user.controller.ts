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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AdminAuthDecorator } from '../../decorators/adminAuth.decorator';
import { PermissionDecorator } from '../../decorators/permission.decorator';
import { AdminAuthGuard } from '../../guards/adminAuth.guard';
import { GlobalService } from '../../utils/global/global.service';
import { UserService } from './user.service';
import { Role } from '../role/entities/role.entity';
import { User } from './entities/user.entity';
import { userPermissionConstant } from './constants/permission.constant';
import {
  ControllerResDto,
  ServiceResDto,
} from '../../utils/global/dto/global.dto';
import {
  UserBodyReqDto,
  PrimaryKeysUserDto,
  UserBodyUpdateReqDto,
  DeleteUserBodyReqDto,
} from './dto/user.dto';

@ApiTags('default - Admin: Users')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/users', version: '1' })
@UseGuards(AdminAuthGuard)
export class UserController {
  constructor(
    private globalService: GlobalService,
    private userService: UserService,
  ) {}

  /**
   * get all user api
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(userPermissionConstant.ADMIN_USER_FIND_ALL)
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  async findMany(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ControllerResDto<User[]>> {
    const { data, pagination }: ServiceResDto<User[]> =
      await this.userService.findMany(null, page, limit);
    return this.globalService.setControllerResponse(data, null, pagination);
  }

  /**
   * create new user api
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(userPermissionConstant.ADMIN_USER_CREATE)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UserBodyReqDto })
  @ApiResponse({ status: 200, description: 'User created', type: User })
  async create(
    @AdminAuthDecorator() adminAuth: any,
    @Body() userBodyReq: UserBodyReqDto<Role>,
  ): Promise<ControllerResDto<User>> {
    const serviceResponse: User = await this.userService.create(
      userBodyReq,
      adminAuth,
    );
    return this.globalService.setControllerResponse(
      serviceResponse,
      'User created successfully.',
    );
  }

  /**
   * get one user by id api
   */
  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(userPermissionConstant.ADMIN_USER_FIND_ONE)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'User data', type: User })
  async findOne(
    @Param() userParamReqDto: PrimaryKeysUserDto,
  ): Promise<ControllerResDto<User>> {
    const { userId } = userParamReqDto;
    const serviceResponse: User = await this.userService.findOne(userId);
    return this.globalService.setControllerResponse(serviceResponse);
  }

  /**
   * update user by id api
   */
  @Put(':userId')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(userPermissionConstant.ADMIN_USER_UPDATE)
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: String })
  @ApiBody({ type: UserBodyUpdateReqDto })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  async update(
    @AdminAuthDecorator() adminAuth: any,
    @Param() userParamReq: PrimaryKeysUserDto,
    @Body() userBodyReq: UserBodyUpdateReqDto<Role>,
  ): Promise<ControllerResDto<Role>> {
    const { userId } = userParamReq;
    const serviceResponse: User = await this.userService.update(
      userBodyReq,
      userId,
      adminAuth,
    );
    return this.globalService.setControllerResponse(
      serviceResponse,
      'User updated successfully.',
    );
  }

  /**
   * permanent delete user by id
   */
  @Delete(':userId/permanent')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(userPermissionConstant.ADMIN_USER_HARD_DELETE)
  @ApiOperation({ summary: 'Permanently delete a user by ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'User permanently deleted' })
  async hardDelete(
    @Param() userParamReq: PrimaryKeysUserDto,
  ): Promise<ControllerResDto<{ isDeleted: boolean }>> {
    const { userId } = userParamReq;
    const isDeleted: boolean = await this.userService.delete(userId);
    return this.globalService.setControllerResponse(
      isDeleted,
      'User deleted successfully.',
    );
  }

  /**
   * soft delete user by id
   */
  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(userPermissionConstant.ADMIN_USER_SOFT_DELETE)
  @ApiOperation({ summary: 'Soft delete a user by ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'User soft deleted' })
  async softDelete(
    @AdminAuthDecorator() adminAuth: any,
    @Param() userParamReq: PrimaryKeysUserDto,
  ): Promise<ControllerResDto<{ isDeleted: boolean }>> {
    const { userId } = userParamReq;
    const updateUserBodyReq: DeleteUserBodyReqDto = {
      hasSoftDeleted: true,
    };
    const serviceResponse: User = await this.userService.update(
      updateUserBodyReq,
      userId,
      adminAuth,
    );
    return this.globalService.setControllerResponse(
      { isDeleted: serviceResponse ? true : false },
      'User deleted successfully.',
    );
  }

  /**
   * rollback soft deleted user by user id
   */
  @Put(':userId/rollback')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(userPermissionConstant.ADMIN_USER_ROLLBACK)
  @ApiOperation({ summary: 'Rollback soft-deleted user by ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Soft delete rolled back',
    type: User,
  })
  async rollback(
    @AdminAuthDecorator() adminAuth: any,
    @Param() deleteUserParamReq: PrimaryKeysUserDto,
  ): Promise<ControllerResDto<Role>> {
    const { userId } = deleteUserParamReq;
    const updateRoleBodyReq: DeleteUserBodyReqDto = {
      hasSoftDeleted: false,
    };
    const serviceResponse: User = await this.userService.update(
      updateRoleBodyReq,
      userId,
      adminAuth,
      true,
    );
    return this.globalService.setControllerResponse(
      serviceResponse,
      'Deleted user rollback successfully.',
    );
  }
}
