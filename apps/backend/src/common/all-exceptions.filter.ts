import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonLogger } from './json-logger.service';
import { LoggedInternalServerErrorException } from './logged-http-exception';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: JsonLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : undefined;
    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse
        ? exceptionResponse
        : { message: exception instanceof Error ? exception.message : 'Internal server error' };

    const logPayload = {
      method: request.method,
      path: request.path,
      statusCode: status,
      error: exception instanceof Error ? exception.message : String(exception),
    };

    if (exception instanceof LoggedInternalServerErrorException) {
      // ScenarioService already logged the structured error with scenario fields.
    } else if (status >= 500) {
      this.logger.error('HTTP exception', exception instanceof Error ? exception.stack : undefined, 'AllExceptionsFilter', logPayload);
    } else {
      this.logger.warn('HTTP exception', 'AllExceptionsFilter', logPayload);
    }

    response.status(status).json({
      statusCode: status,
      path: request.path,
      timestamp: new Date().toISOString(),
      ...message,
    });
  }
}
