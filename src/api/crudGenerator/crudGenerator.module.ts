import { Module } from '@nestjs/common';
import { CrudGeneratorController } from './crudGenerator.controller';

@Module({
  controllers: [CrudGeneratorController],
})
export class CrudGeneratorModule {}
