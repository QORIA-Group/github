import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { QorwayExceptionFilter } from './qorway-exception.filter';
import { StructuredLogger } from '../utils/structured-logger';

describe('QorwayExceptionFilter', () => {
  let filter: QorwayExceptionFilter;
  let mockLogger: Partial<StructuredLogger>;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockRequest: { method: string; url: string; headers: Record<string, string> };
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      method: 'GET',
      url: '/api/v1/test',
      headers: {},
    };

    mockHost = {
      switchToHttp: () => ({
        getResponse: <T = unknown>(): T => mockResponse as T,
        getRequest: <T = unknown>(): T => mockRequest as T,
        getNext: jest.fn(),
      }),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    filter = new QorwayExceptionFilter(mockLogger as StructuredLogger);
  });

  it('should handle HttpException and return Qorway error format', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error_code: 'QORWAY_ERR_HTTP_404',
        message: 'Not Found',
        correlation_id: expect.any(String),
        timestamp: expect.any(String),
      }),
    );
  });

  it('should handle unknown exceptions as 500', () => {
    const exception = new Error('Something broke');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error_code: 'QORWAY_ERR_INTERNAL',
        message: 'An internal error occurred. Please contact support.',
      }),
    );
  });

  it('should never expose stack traces to the client', () => {
    const exception = new Error('Internal details');

    filter.catch(exception, mockHost);

    const jsonArg = mockResponse.json.mock.calls[0][0];
    expect(jsonArg).not.toHaveProperty('stack');
    expect(jsonArg).not.toHaveProperty('trace');
  });

  it('should use correlation ID from request headers if available', () => {
    mockRequest.headers['x-correlation-id'] = 'test-correlation-id';
    const exception = new HttpException('Test', 400);

    filter.catch(exception, mockHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        correlation_id: 'test-correlation-id',
      }),
    );
  });
});
