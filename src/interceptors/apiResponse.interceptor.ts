import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class apiResponseDto {
  statusCode: number;
  message: string;
  data?: any;
  devResObj?: {
    responseTime?: string;
  };
}

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        const statusCode: number =
          context.switchToHttp().getResponse().statusCode ||
          HttpStatus.BAD_REQUEST;
        // update message if not exist
        const message: string = data?.message || 'Okay';
        // prepare common response
        const apiResponse: apiResponseDto = {
          statusCode,
          message,
          ...data,
        };
        // attach dev repose object for development only
        // TODO: use ConfigService instead of process.env.NODE_ENV
        if (process.env.NODE_ENV === 'development') {
          apiResponse.devResObj = {};
          apiResponse.devResObj.responseTime = `${Date.now() - now} ms`;
        }
        return apiResponse;
      }),
    );
  }
}
