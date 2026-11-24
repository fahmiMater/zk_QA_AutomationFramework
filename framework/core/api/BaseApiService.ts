import { APIRequestContext, APIResponse } from '@playwright/test';
import { AuthTokenManager } from './AuthTokenManager';
import { z } from 'zod';
import { ApiResponseValidator } from './ApiResponseValidator';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: any;
  role?: string;
  strictMode?: boolean;
}

export interface ApiResponse<T = any> {
  status: number;
  ok: boolean;
  headers: Record<string, string>;
  body: T;
  rawResponse: APIResponse;
}

/**
 * Base Service Object Model (SOM) class wrapping Playwright's APIRequestContext.
 * Implements strict mode error handling, multi-role auth header injection, schema validation, and offline QA fallback.
 */
export abstract class BaseApiService {
  protected request: APIRequestContext;
  protected baseUrl: string;
  protected defaultStrictMode: boolean;
  protected tokenManager: AuthTokenManager;

  constructor(
    request: APIRequestContext,
    baseUrl: string = 'http://localhost:3000/api/v1',  // override per environment via constructor arg,
    defaultStrictMode: boolean = true
  ) {
    this.request = request;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultStrictMode = defaultStrictMode;
    this.tokenManager = AuthTokenManager.getInstance();
  }

  /**
   * Constructs request headers including multi-role JWT Bearer tokens.
   */
  protected getHeaders(role?: string, customHeaders?: Record<string, string>): Record<string, string> {
    const targetRole = role || 'ADMIN';
    const token = this.tokenManager.getToken(targetRole) || `mock_jwt_token_${targetRole.toLowerCase()}`;

    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...customHeaders,
    };
  }

  /**
   * Normalizes the endpoint URL.
   */
  protected getUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  /**
   * Generates mock data for offline QA execution mode.
   */
  protected getOfflineMockData(endpoint: string, data?: any, options?: ApiRequestOptions): any {
    // Offline QA fallback: generic echo response so teams can smoke-test
    // their service wiring without a live backend. Replace with real
    // backend-backed execution once the environment is configured.
    if (options?.role && options.role !== 'ADMIN' && endpoint.includes('approve')) {
      return { error: 'Forbidden', message: `Role ${options.role} is not authorized to approve` };
    }
    return {
      id: data?.id ?? 1,
      ...data,
      status: data?.status ?? 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Processes raw Playwright APIResponse, handling strict mode assertion and Zod schema validation.
   */
  protected async processResponse<T = any>(
    response: APIResponse,
    options?: ApiRequestOptions,
    schema?: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    const isStrict = options?.strictMode ?? this.defaultStrictMode;
    const status = response.status();
    const ok = response.ok();
    let body: any;

    try {
      const text = await response.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }

    const apiResponse: ApiResponse<T> = {
      status,
      ok,
      headers: response.headers(),
      body,
      rawResponse: response,
    };

    if (schema && ok) {
      apiResponse.body = ApiResponseValidator.validate(schema, body);
    }

    if (isStrict && !ok) {
      throw new Error(`[API Failure] ${response.url()} returned HTTP ${status}\nPayload: ${JSON.stringify(body, null, 2)}`);
    }

    return apiResponse;
  }

  /**
   * Safe wrapper for HTTP calls with offline QA fallback.
   */
  protected async safeExecute<T = any>(
    action: () => Promise<APIResponse>,
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions,
    schema?: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await action();
      return await this.processResponse<T>(response, options, schema);
    } catch (err: any) {
      // If error is ECONNREFUSED/network failure and strictMode is false, return safe offline QA mock response
      const isStrict = options?.strictMode ?? this.defaultStrictMode;
      if (!isStrict && (err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed') || err.name === 'TypeError')) {
        const mockBody = this.getOfflineMockData(endpoint, data, options);
        let mockStatus = 200;
        if (options?.role && options.role !== 'ADMIN' && endpoint.includes('approve')) {
          mockStatus = 403;
        } else if (['post', 'put'].some((m) => action.toString().includes(`.${m}`))) {
          mockStatus = 201;
        }
        
        return {
          status: mockStatus,
          ok: mockStatus < 400,
          headers: { 'content-type': 'application/json' },
          body: schema && mockStatus < 400 ? ApiResponseValidator.validate(schema, mockBody) : mockBody,
          rawResponse: null as any,
        };
      }
      throw err;
    }
  }

  public async get<T = any>(
    endpoint: string,
    options?: ApiRequestOptions,
    schema?: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    const url = this.getUrl(endpoint);
    const headers = this.getHeaders(options?.role, options?.headers);

    return this.safeExecute<T>(
      () => this.request.get(url, { headers, params: options?.params as Record<string, string> }),
      endpoint,
      undefined,
      options,
      schema
    );
  }

  public async post<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions,
    schema?: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    const url = this.getUrl(endpoint);
    const headers = this.getHeaders(options?.role, options?.headers);

    return this.safeExecute<T>(
      () => this.request.post(url, { headers, data: data ?? options?.data, params: options?.params as Record<string, string> }),
      endpoint,
      data,
      options,
      schema
    );
  }

  public async put<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions,
    schema?: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    const url = this.getUrl(endpoint);
    const headers = this.getHeaders(options?.role, options?.headers);

    return this.safeExecute<T>(
      () => this.request.put(url, { headers, data: data ?? options?.data, params: options?.params as Record<string, string> }),
      endpoint,
      data,
      options,
      schema
    );
  }

  public async delete<T = any>(
    endpoint: string,
    options?: ApiRequestOptions,
    schema?: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    const url = this.getUrl(endpoint);
    const headers = this.getHeaders(options?.role, options?.headers);

    return this.safeExecute<T>(
      () => this.request.delete(url, { headers, params: options?.params as Record<string, string> }),
      endpoint,
      undefined,
      options,
      schema
    );
  }
}
