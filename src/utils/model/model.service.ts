import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class ModelService {
  /**,
   * Model UTIL: update value if exist in request body
   * TODO: update interface
   */

  constructor(private readonly customLogger: CustomLogger) {}
  updateModelValue(dbRecord: any, reqRecord: any, updatedBy: any = null): any {
    try {
      Object.keys(reqRecord).forEach((key) => {
        if (dbRecord?.[key] && reqRecord?.[key]) {
          dbRecord[key] = reqRecord?.[key];
        }
      });
      // set updated user by
      if (updatedBy) {
        dbRecord.updatedBy = updatedBy;
      }
      // update publishedAt with date
      if (reqRecord?.hasPublished === true) {
        dbRecord.publishedAt = new Date();
      }
      // update publishedAt with null
      if (reqRecord?.hasPublished === false) {
        dbRecord.publishedAt = null;
      }
      // update deletedAt with date
      if (reqRecord?.hasSoftDeleted === true) {
        dbRecord.deletedAt = new Date();
      }
      // update deletedAt with null
      if (reqRecord?.hasSoftDeleted === false) {
        dbRecord.deletedAt = null;
      }
      // set deleted user by
      if (updatedBy && reqRecord?.deletedAt) {
        dbRecord.deletedBy = updatedBy;
      }
      return dbRecord;
    } catch (error) {
      this.customLogger.error('Error while updating model::', error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Model UTIL: remove extra fields from createBy and updatedBy
   */
  removeUserBy(resData): any {
    try {
      ['createdBy', 'updatedBy'].forEach((field) => {
        if (resData?.[field]?.roles) {
          delete resData?.[field].roles;
        }
        if (resData?.[field]?.permissions) {
          delete resData?.[field].permissions;
        }
      });
      if (resData?.deletedAt) {
        delete resData.deletedAt;
      }
      return resData;
    } catch (error) {
      this.customLogger.error(
        'Error while removing fields from model::',
        error.stack,
      );
      throw new InternalServerErrorException(error);
    }
  }
}
