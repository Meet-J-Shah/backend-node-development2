/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { GlobalService } from '../../utils/global/global.service';
import { Pizza } from './entities/pizza.entity';
import {
  PaginationResDto,
  ServiceResDto,
  TypeOrmDeleteResult,
} from '../../utils/global/dto/global.dto';
import {
  PizzaFullBodyReqDto,
  CreatePizzaBodyReqDto,
  UpdatePizzaBodyReqDto,
  UpdateAndDeletePizzaBodyReqDto,
} from './dto/pizza.dto';
import { ModelService } from '../../utils/model/model.service';
import { DeleteRollBackDto } from '../../utils/model/model.dto';
import { CustomLogger } from 'src/utils/logger/logger.service';

@Injectable()
export class PizzaService {
  constructor(
    @InjectRepository(Pizza)
    private pizzaRepository: Repository<Pizza>,
    private globalService: GlobalService,
    private modelService: ModelService,
    private readonly customLogger: CustomLogger,
  ) {}

  async findMany(
    where: FindOptionsWhere<Pizza> = {},
    page: number,
    limit: number,
  ): Promise<ServiceResDto<Pizza[]>> {
    try {
      const skipRecord = this.globalService.getSkipRecord(page, limit);
      const [dataArray, dataCount] = await this.pizzaRepository.findAndCount({
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

  async create(createDto: CreatePizzaBodyReqDto): Promise<Pizza> {
    const createEntity: Pizza = this.pizzaRepository.create({
      myName: Date.now().toString(),
      myId: Math.floor(Math.random() * 10000),
      thirdId: uuidv4(),
      secondId: 'some-fixed-second-id',
      ...createDto,
    });
    const saveEntity: Pizza = await this.pizzaRepository.save(createEntity);
    if (!saveEntity) {
      throw new BadRequestException('Fail to create');
    }
    return this.modelService.removeUserBy(saveEntity);
  }

  async findOne(id: string): Promise<Pizza> {
    const data = await this.pizzaRepository.findOne({
      where: { myName: id },
      relations: {},
    });
    if (!data) throw new BadRequestException('Pizza not found');
    return data;
  }

  async update(
    updateDto: UpdateAndDeletePizzaBodyReqDto,
    id: string,
    isRollback = false,
  ): Promise<Pizza> {
    const rollbackObj: DeleteRollBackDto = isRollback
      ? { withDeleted: true }
      : {};

    let entity = await this.pizzaRepository.findOne({
      where: { myName: id },
      ...rollbackObj,
    });
    if (!entity) throw new BadRequestException('Pizza not found');

    entity = this.modelService.updateModelValue(entity, updateDto);

    return await this.pizzaRepository.save(entity);
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.pizzaRepository.findOne({
      where: { myName: id },
      withDeleted: true,
    });

    if (!data) throw new BadRequestException('Pizza not exists');
    if (!data.deletedAt)
      throw new BadRequestException('Only soft-deleted records can be deleted');

    const result = await this.pizzaRepository.delete(id);
    return result.affected ? true : false;
  }
}
