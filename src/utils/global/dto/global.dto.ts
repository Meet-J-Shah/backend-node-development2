export class PaginationResDto {
  totalPages: number;
  previousPage: number;
  currentPage: number;
  nextPage: number;
  totalRecords: number;
  skipRecords: number;
  limit: number;
}

export class ControllerResDto<T> {
  statusCode?: number;
  message: string;
  data: T;
  pagination?: PaginationResDto;
  error?: any;
}

export class ServiceResDto<T> {
  data: T;
  pagination?: PaginationResDto;
}

export declare class TypeOrmUpdateResult {
  raw: any;
  affected?: number;
  generatedMaps: any;
}

export declare class TypeOrmDeleteResult {
  raw: any;
  affected?: number | null;
}
