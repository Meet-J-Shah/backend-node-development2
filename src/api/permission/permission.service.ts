import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { GlobalService } from '../../utils/global/global.service';
import { ModelService } from '../../utils/model/model.service';
import { Permission } from './entities/permission.entity';
import { ServiceResDto, PaginationResDto } from '../../utils/global/dto/global.dto';
import { CustomLogger } from 'src/utils/logger/logger.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private globalService: GlobalService,
    private readonly customLogger: CustomLogger,
    private modelService: ModelService,
  ) { }

  async findMany(
    where: FindOptionsWhere<Permission> = {},
    page: number,
    limit: number,
  ): Promise<ServiceResDto<Permission[]>> {
    try {
      const skipRecord: number = this.globalService.getSkipRecord(page, limit);
      const [dataArray, dataCount]: [Permission[], number] =
        await this.permissionRepository.findAndCount({
          select: Permission.selectFields,
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
      this.customLogger.error('Error while finding permissions::', error.stack);
      throw new InternalServerErrorException(error);
    }
  }
}
