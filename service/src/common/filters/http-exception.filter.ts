import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();

      if (typeof exResponse === 'string') {
        message = exResponse;
      } else if (typeof exResponse === 'object') {
        const obj = exResponse as Record<string, any>;
        // class-validator 返回的 message 可能是数组
        if (Array.isArray(obj.message)) {
          message = (obj.message[0] as string) || message;
        } else if (typeof obj.message === 'string') {
          message = obj.message;
        }
      }
    } else if (exception instanceof Error) {
      console.error(`[${request.method}] ${request.url} -`, exception);
      message = exception.message || message;
    }

    response.status(status).json({
      code: status,
      message,
      data: null,
    });
  }
}
