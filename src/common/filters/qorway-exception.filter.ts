import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { QorwayErrorResponse } from '../interfaces/qorway-error.interface';
import { StructuredLogger } from '../utils/structured-logger';

@Catch()
export class QorwayExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: StructuredLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId =
      (request.headers['x-correlation-id'] as string) ?? uuidv4();

    let status: number;
    let message: string;
    let errorCode: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as Record<string, unknown>).message?.toString() ??
            exception.message;
      errorCode = `QORWAY_ERR_HTTP_${status}`;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An internal error occurred. Please contact support.';
      errorCode = 'QORWAY_ERR_INTERNAL';
    }

    this.logger.error(
      `[${errorCode}] ${exception instanceof Error ? exception.message : 'Unknown error'} - ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
      'QorwayExceptionFilter',
    );

    const errorResponse: QorwayErrorResponse = {
      error_code: errorCode,
      message,
      correlation_id: correlationId,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
