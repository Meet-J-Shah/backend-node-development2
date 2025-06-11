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
import { ProductService } from './product.service';
import {} from '../../configs/entity.config';
import { Product } from './entities/product.entity';
import { productPermissionsConstant } from './constants/permission.constant';
import {
  ControllerResDto,
  ServiceResDto,
} from '../../utils/global/dto/global.dto';
import {
  FindManyProductQueryReq,
  FindOneProductParamReqDto,
  CreateProductBodyReqDto,
  UpdateProductBodyReqDto,
  DeleteProductBodyReqDto,
} from './dto/product.dto';

@Controller({ path: 'admin/products', version: '1' })
@UseGuards(AdminAuthGuard)
export class ProductController {
  constructor(
    private globalService: GlobalService,
    private productService: ProductService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(productPermissionsConstant.ADMIN_PRODUCT_FIND_ALL)
  async findMany(
    @Query() findManyQueryReq: FindManyProductQueryReq,
  ): Promise<ControllerResDto<Product[]>> {
    const { page, limit } = findManyQueryReq;
    const { data, pagination }: ServiceResDto<Product[]> =
      await this.productService.findMany(null, page, limit);
    return this.globalService.setControllerResponse(data, null, pagination);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(productPermissionsConstant.ADMIN_PRODUCT_CREATE)
  async create(
    @AdminAuthDecorator() adminAuth: any,
    @Body() bodyReq: CreateProductBodyReqDto,
  ): Promise<ControllerResDto<Product>> {
    const result = await this.productService.create(bodyReq);
    return this.globalService.setControllerResponse(
      result,
      'Product created successfully.',
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(productPermissionsConstant.ADMIN_PRODUCT_FIND_ONE)
  async findOne(
    @Param() paramReqDto: FindOneProductParamReqDto,
  ): Promise<ControllerResDto<Product>> {
    const result = await this.productService.findOne(paramReqDto.ProductId);
    return this.globalService.setControllerResponse(result);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(productPermissionsConstant.ADMIN_PRODUCT_UPDATE)
  async update(
    @AdminAuthDecorator() adminAuth: any,
    @Param() paramReqDto: FindOneProductParamReqDto,
    @Body() bodyReq: UpdateProductBodyReqDto,
  ): Promise<ControllerResDto<Product>> {
    const result = await this.productService.update(
      bodyReq,
      paramReqDto.ProductId,
    );
    return this.globalService.setControllerResponse(
      result,
      'Product updated successfully.',
    );
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(productPermissionsConstant.ADMIN_PRODUCT_HARD_DELETE)
  async hardDelete(
    @Param() paramReqDto: FindOneProductParamReqDto,
  ): Promise<ControllerResDto<{ isDeleted: boolean }>> {
    const isDeleted = await this.productService.delete(paramReqDto.ProductId);
    return this.globalService.setControllerResponse(
      { isDeleted },
      'Product deleted successfully.',
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(productPermissionsConstant.ADMIN_PRODUCT_SOFT_DELETE)
  async softDelete(
    @AdminAuthDecorator() adminAuth: any,
    @Param() paramReqDto: FindOneProductParamReqDto,
  ): Promise<ControllerResDto<{ isDeleted: boolean }>> {
    const bodyReq: DeleteProductBodyReqDto = { hasSoftDeleted: true };
    const result = await this.productService.update(
      bodyReq,
      paramReqDto.ProductId,
    );
    return this.globalService.setControllerResponse(
      { isDeleted: !!result },
      'Product deleted successfully.',
    );
  }

  @Put(':id/rollback')
  @HttpCode(HttpStatus.OK)
  @PermissionDecorator(productPermissionsConstant.ADMIN_PRODUCT_ROLLBACK)
  async rollback(
    @AdminAuthDecorator() adminAuth: any,
    @Param() paramReqDto: FindOneProductParamReqDto,
  ): Promise<ControllerResDto<Product>> {
    const bodyReq: DeleteProductBodyReqDto = { hasSoftDeleted: false };
    const result = await this.productService.update(
      bodyReq,
      paramReqDto.ProductId,
      true,
    );
    return this.globalService.setControllerResponse(
      result,
      'Product rollback successful.',
    );
  }
}
