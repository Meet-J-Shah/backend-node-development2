import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindManyQueryReq {
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  page: number;

  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  limit: number;
}
