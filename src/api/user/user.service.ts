import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';

import { GlobalService } from '../../utils/global/global.service';
import { BcryptService } from '../../utils/bcrypt/bcrypt.service';
import { Role } from '../role/entities/role.entity';
import { User } from './entities/user.entity';
import {
  PaginationResDto,
  ServiceResDto,
  TypeOrmDeleteResult,
} from '../../utils/global/dto/global.dto';
import {
  UserBodyReqDto,
  UserWhereDto,
  UserBodyUpdateReqDto,
} from './dto/user.dto';
import { ModelService } from '../../utils/model/model.service';
import { DeleteRollBackDto } from '../../utils/model/model.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private globalService: GlobalService,
    private bcryptService: BcryptService,
    private modelService: ModelService,
  ) {}

  /**
   * service: get all users service
   */
  async findMany(
    where: any = {},
    page: number,
    limit: number,
  ): Promise<ServiceResDto<User[]>> {
    const skipRecord: number = this.globalService.getSkipRecord(page, limit);
    const [dataArray, dataCount]: [User[], number] =
      await this.userRepository.findAndCount({
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
  }

  /**
   * service: create new user service
   */
  async create(
    createUserBodyReq: UserBodyReqDto<Role>,
    createdByUser: User,
  ): Promise<User> {
    // check if user already exists
    const userData: User = await this.userRepository.findOne({
      where: {
        email: createUserBodyReq?.email,
      },
    });
    if (userData) {
      throw new BadRequestException('User exist with this email.');
    }
    // check role exists or not
    const roleIdArray: any = createUserBodyReq?.roles || [];
    const roleArray: Role[] = await this.roleRepository.find({
      where: {
        id: In(roleIdArray),
      },
    });
    if (roleArray.length !== roleIdArray.length) {
      throw new BadRequestException('Some role not exists in system');
    }
    createUserBodyReq.roles = [...roleArray];
    // create password
    createUserBodyReq.password = await this.bcryptService.generatePassword(
      createUserBodyReq.password,
    );
    const createUser: User = this.userRepository.create(createUserBodyReq);
    const saveUser: User = await this.userRepository.save(createUser);
    delete saveUser.password;
    return saveUser;
  }

  /**
   * get one user by id service
   */
  async findOne(userId: string): Promise<User> {
    const userData: User = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        roles: true,
      },
    });
    if (!userData) {
      throw new BadRequestException('User not exists');
    }
    return userData;
  }

  /**
   * find user by email for auth guard
   * */
  async findOneForAuth(
    userWhere: UserWhereDto,
    isAdmin: boolean = false,
    needPassword: boolean = false,
  ): Promise<User> {
    const selectFields: any = ['id', 'email', 'firstName', 'lastName'];
    if (needPassword) {
      selectFields.push('password');
    }
    const user: User = await this.userRepository.findOne({
      select: selectFields,
      relations: {
        roles: {
          permissions: true,
        },
      },
      where: {
        ...userWhere,
        roles: {
          isAdmin,
        },
      },
    });
    return user;
  }

  /**
   * service: update user by id
   */
  // TODO: Check the full function correction needed...
  async update(
    updateUserBodyReq: UserBodyUpdateReqDto<Role>,
    userId: string,
    updatedByUser: User,
    isRollback: boolean = false,
  ): Promise<User> {
    const rollbackObj: DeleteRollBackDto = {};
    if (isRollback) {
      rollbackObj.withDeleted = true;
    }

    let userData: User;
    // check email exists
    if (updateUserBodyReq?.email) {
      userData = await this.userRepository.findOne({
        where: {
          email: updateUserBodyReq.email,
          id: Not(userId),
        },
        ...rollbackObj,
      });
      if (userData) {
        throw new BadRequestException('User already exists with this email');
      }
    }
    userData = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      ...rollbackObj,
    });
    if (!userData) {
      throw new BadRequestException('User not exists');
    }
    // update password
    if (updateUserBodyReq?.password) {
      userData.password = await this.bcryptService.generatePassword(
        updateUserBodyReq.password,
      );
    }
    // update roles
    if (updateUserBodyReq?.roles) {
      const roleIdArray: any = updateUserBodyReq?.roles || [];
      const roleArray: Role[] = await this.roleRepository.find({
        where: {
          id: In(roleIdArray),
        },
      });
      if (roleArray.length !== roleIdArray.length) {
        throw new BadRequestException('Some role not exists in system');
      }
      userData.roles = [...roleArray];
    }

    // updating data
    userData = this.modelService.updateModelValue(
      userData,
      updateUserBodyReq,
      updatedByUser,
    );

    userData.email = updateUserBodyReq?.email || userData.email;
    userData.firstName = updateUserBodyReq?.firstName || userData.firstName;
    userData.lastName = updateUserBodyReq?.lastName || userData.lastName;
    userData = await this.userRepository.save(userData);
    return userData;
  }

  /**
   * service: hard delete user by id
   */
  async delete(userId: string): Promise<boolean> {
    try {
      const userData: User = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        withDeleted: true,
      });
      if (!userData) {
        throw new BadRequestException('User are not exists');
      }

      if (!userData?.deletedAt) {
        throw new BadRequestException(
          'This action work for soft deleted record.',
        );
      }
      const deleteUser: TypeOrmDeleteResult =
        await this.userRepository.delete(userId);
      return deleteUser.affected ? true : false;
    } catch (error) {
      // TODO: add log
      throw new InternalServerErrorException(error);
    }
  }
}
