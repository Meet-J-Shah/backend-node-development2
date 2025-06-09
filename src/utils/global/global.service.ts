import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';

import { ControllerResDto, PaginationResDto } from './dto/global.dto';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class GlobalService {
  constructor(
    private readonly customLogger: CustomLogger,
  ) { }

  /**
   * Global UTIL: set controller response
   */
  setControllerResponse(
    data: any,
    message: string = 'Ok',
    pagination: PaginationResDto = null,
    statusCode: number = HttpStatus.OK,
  ): ControllerResDto<any> {
    const apiResponse: ControllerResDto<any> = {
      statusCode,
      message: message || 'Ok',
      data,
    };
    if (pagination) {
      apiResponse.pagination = pagination;
    }
    return apiResponse;
  }

  /**
   * Global UTIL: get pagination data
   */
  getSkipRecord(page: number, limit: number): number {
    page = page > 0 ? page : 0;
    limit = limit > 0 ? limit : 10;
    const previousPage: number = page - 1 > 0 ? page - 1 : 0;
    return previousPage * limit;
  }

  /**
   * Global UTIL: get pagination data
   */
  setPagination(
    page: number,
    limit: number,
    totalRecords: number,
  ): PaginationResDto {
    try {
      page = page > 0 ? page : 0;
      limit = limit > 0 ? limit : 10;
      totalRecords = totalRecords > 0 ? totalRecords : 0;
      const totalPages = Math.ceil(totalRecords / limit) || 0;
      const previousPage: number = page - 1 > 0 ? page - 1 : 0;
      const currentPage: number = page;
      const nextPage: number = page + 1 < totalPages ? page + 1 : totalPages;
      const skipRecords: number = previousPage * limit;
      return {
        totalPages,
        previousPage,
        currentPage,
        nextPage,
        totalRecords,
        skipRecords,
        limit,
      };
    } catch (error) {
      this.customLogger.error('Error while gtting pagination data::', error.stack);
      throw new InternalServerErrorException(error);
    }
  }
}
