import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { PizzaController } from './pizza.controller';
import { PizzaService } from './pizza.service';

import { Pizza } from './entities/pizza.entity';
import { CustomLogger } from 'src/utils/logger/logger.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Pizza]),
    forwardRef(() => AuthModule),
    UtilsModule,
  ],
  controllers: [PizzaController],
  providers: [PizzaService, CustomLogger],
  exports: [PizzaService],
})
export class PizzaModule {}
