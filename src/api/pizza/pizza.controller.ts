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

import { AdminAuthDecorator } from '../../decorators/adminAuth.decorator';
import { PermissionDecorator } from '../../decorators/permission.decorator';
import { AdminAuthGuard } from '../../guards/adminAuth.guard';
import { GlobalService } from '../../utils/global/global.service';
import { PizzaService } from './pizza.service';
import {} from '../../configs/entity.config';
import { Pizza } from './entities/pizza.entity';
import { pizzaPermissionsConstant } from './constants/permission.constant';
import {
  ControllerResDto,
  ServiceResDto,
} from '../../utils/global/dto/global.dto';
import {
  FindManyPizzaQueryReq,
  FindOnePizzaParamReqDto,
  CreatePizzaBodyReqDto,
  UpdatePizzaBodyReqDto,
  DeletePizzaBodyReqDto,
} from './dto/pizza.dto';

@Controller({ path: 'admin/pizzas', version: '1' })
@UseGuards(AdminAuthGuard)
export class PizzaController {
  constructor(
    private globalService: GlobalService,
    private pizzaService: PizzaService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(pizzaPermissionsConstant.ADMIN_PIZZA_FIND_ALL)
  async findMany(
    @Query() findManyQueryReq: FindManyPizzaQueryReq,
  ): Promise<ControllerResDto<Pizza[]>> {
    const { page, limit } = findManyQueryReq;
    const { data, pagination }: ServiceResDto<Pizza[]> =
      await this.pizzaService.findMany(null, page, limit);
    return this.globalService.setControllerResponse(data, null, pagination);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(pizzaPermissionsConstant.ADMIN_PIZZA_CREATE)
  async create(
    @AdminAuthDecorator() adminAuth: any,
    @Body() bodyReq: CreatePizzaBodyReqDto,
  ): Promise<ControllerResDto<Pizza>> {
    const result = await this.pizzaService.create(bodyReq);
    return this.globalService.setControllerResponse(
      result,
      'Pizza created successfully.',
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(pizzaPermissionsConstant.ADMIN_PIZZA_FIND_ONE)
  async findOne(
    @Param() paramReqDto: FindOnePizzaParamReqDto,
  ): Promise<ControllerResDto<Pizza>> {
    const result = await this.pizzaService.findOne(paramReqDto.id);
    return this.globalService.setControllerResponse(result);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(pizzaPermissionsConstant.ADMIN_PIZZA_UPDATE)
  async update(
    @AdminAuthDecorator() adminAuth: any,
    @Param() paramReqDto: FindOnePizzaParamReqDto,
    @Body() bodyReq: UpdatePizzaBodyReqDto,
  ): Promise<ControllerResDto<Pizza>> {
    const result = await this.pizzaService.update(bodyReq, paramReqDto.id);
    return this.globalService.setControllerResponse(
      result,
      'Pizza updated successfully.',
    );
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(pizzaPermissionsConstant.ADMIN_PIZZA_HARD_DELETE)
  async hardDelete(
    @Param() paramReqDto: FindOnePizzaParamReqDto,
  ): Promise<ControllerResDto<{ isDeleted: boolean }>> {
    const isDeleted = await this.pizzaService.delete(paramReqDto.id);
    return this.globalService.setControllerResponse(
      { isDeleted },
      'Pizza deleted successfully.',
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(pizzaPermissionsConstant.ADMIN_PIZZA_SOFT_DELETE)
  async softDelete(
    @AdminAuthDecorator() adminAuth: any,
    @Param() paramReqDto: FindOnePizzaParamReqDto,
  ): Promise<ControllerResDto<{ isDeleted: boolean }>> {
    const bodyReq: DeletePizzaBodyReqDto = { hasSoftDeleted: true };
    const result = await this.pizzaService.update(bodyReq, paramReqDto.id);
    return this.globalService.setControllerResponse(
      { isDeleted: !!result },
      'Pizza deleted successfully.',
    );
  }

  @Put(':id/rollback')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(pizzaPermissionsConstant.ADMIN_PIZZA_ROLLBACK)
  async rollback(
    @AdminAuthDecorator() adminAuth: any,
    @Param() paramReqDto: FindOnePizzaParamReqDto,
  ): Promise<ControllerResDto<Pizza>> {
    const bodyReq: DeletePizzaBodyReqDto = { hasSoftDeleted: false };
    const result = await this.pizzaService.update(
      bodyReq,
      paramReqDto.id,
      true,
    );
    return this.globalService.setControllerResponse(
      result,
      'Pizza rollback successful.',
    );
  }
}
