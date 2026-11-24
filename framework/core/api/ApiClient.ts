import { request, APIRequestContext } from '@playwright/test';
import { AuthTokenManager } from './AuthTokenManager';
import { BaseApiService, ApiRequestOptions, ApiResponse } from './BaseApiService';

/**
 * Enhanced High-speed API Client wrapper for background execution, multi-role auth management, and data seeding.
 */
export class ApiClient extends BaseApiService {
  private requestContext?: APIRequestContext;

  constructor(baseUrl: string = 'http://localhost:3000/api/v1', defaultStrictMode: boolean = false) {
    // Pass a placeholder context to BaseApiService; init() will bind real context
    super(null as any, baseUrl, defaultStrictMode);
  }

  /**
   * Initializes the API Request context.
   */
  public async init(): Promise<void> {
    if (!this.requestContext) {
      this.requestContext = await request.newContext({
        baseURL: this.baseUrl,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      this.request = this.requestContext;
    }
  }

  /**
   * Authenticates and caches the token for a specific role.
   */
  // password must be passed from environment variables - never hardcode
  public async login(username: string, role: string = 'ADMIN', password: string): Promise<string> {
    await this.init();

    const cachedToken = this.tokenManager.getToken(role);
    if (cachedToken) {
      return cachedToken;
    }

    try {
      const response = await this.requestContext!.post('/auth/login', {
        data: { username, password },
      });

      if (response.ok()) {
        const body = await response.json();
        const token = body.token || `mock_jwt_token_${role.toLowerCase()}`;
        this.tokenManager.setToken(role, token);
        return token;
      }
    } catch {
      // Catch connection errors in offline QA fallback mode
    }

    // Fallback mock token for QA test execution
    const mockToken = `mock_jwt_token_${role.toLowerCase()}`;
    this.tokenManager.setToken(role, mockToken);
    return mockToken;
  }

  /**
   * Disposes the API request context.
   */
  public async dispose(): Promise<void> {
    if (this.requestContext) {
      await this.requestContext.dispose();
      this.requestContext = undefined;
    }
  }
}
