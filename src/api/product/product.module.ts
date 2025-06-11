import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

import { Product } from './entities/product.entity';
import { CustomLogger } from 'src/utils/logger/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => AuthModule),
    UtilsModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, CustomLogger],
  exports: [ProductService],
})
export class ProductModule {}
