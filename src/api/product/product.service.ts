/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, FindOptionsWhere } from 'typeorm';

import { GlobalService } from '../../utils/global/global.service';
import { Product } from './entities/product.entity';
import {
  PaginationResDto,
  ServiceResDto,
  TypeOrmDeleteResult,
} from '../../utils/global/dto/global.dto';
import {
  ProductFullBodyReqDto,
  CreateProductBodyReqDto,
  UpdateProductBodyReqDto,
  UpdateAndDeleteProductBodyReqDto,
} from './dto/product.dto';
import { ModelService } from '../../utils/model/model.service';
import { DeleteRollBackDto } from '../../utils/model/model.dto';
import { CustomLogger } from 'src/utils/logger/logger.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private globalService: GlobalService,
    private modelService: ModelService,
    private readonly customLogger: CustomLogger,
  ) {}

  async findMany(
    where: FindOptionsWhere<Product> = {},
    page: number,
    limit: number,
  ): Promise<ServiceResDto<Product[]>> {
    try {
      const skipRecord = this.globalService.getSkipRecord(page, limit);
      const [dataArray, dataCount] = await this.productRepository.findAndCount({
        where,
        take: limit,
        skip: skipRecord,
      });
      const paginationData = this.globalService.setPagination(
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

  async create(createDto: CreateProductBodyReqDto): Promise<Product> {
    const createEntity: Product = this.productRepository.create({
      ...createDto,
    });
    const saveEntity: Product = await this.productRepository.save(createEntity);
    if (!saveEntity) {
      throw new BadRequestException('Fail to create');
    }
    return this.modelService.removeUserBy(saveEntity);
  }

  async findOne(id: string): Promise<Product> {
    const data = await this.productRepository.findOne({
      where: { id },
      relations: {},
    });
    if (!data) throw new BadRequestException('Product not found');
    return data;
  }

  async update(
    updateDto: UpdateAndDeleteProductBodyReqDto,
    id: string,
    isRollback = false,
  ): Promise<Product> {
    const rollbackObj: DeleteRollBackDto = isRollback
      ? { withDeleted: true }
      : {};

    let entity = await this.productRepository.findOne({
      where: { id },
      ...rollbackObj,
    });
    if (!entity) throw new BadRequestException('Product not found');

    entity = this.modelService.updateModelValue(entity, updateDto);

    return await this.productRepository.save(entity);
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.productRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!data) throw new BadRequestException('Product not exists');
    if (!data.deletedAt)
      throw new BadRequestException('Only soft-deleted records can be deleted');

    const result = await this.productRepository.delete(id);
    return result.affected ? true : false;
  }
}
