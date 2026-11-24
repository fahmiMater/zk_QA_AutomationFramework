/**
 * Singleton Auth Token Manager to cache and manage JWT tokens across multi-role test suites.
 * Supports roles like ADMIN, ACCOUNTANT, AUDITOR, HR_OFFICER, etc.
 */
export class AuthTokenManager {
  private static instance: AuthTokenManager;
  private tokenCache: Map<string, string> = new Map();

  private constructor() {}

  /**
   * Retrieves the singleton instance.
   */
  public static getInstance(): AuthTokenManager {
    if (!AuthTokenManager.instance) {
      AuthTokenManager.instance = new AuthTokenManager();
    }
    return AuthTokenManager.instance;
  }

  /**
   * Gets a cached token for a specific role.
   */
  public getToken(role: string = 'ADMIN'): string | undefined {
    return this.tokenCache.get(role.toUpperCase());
  }

  /**
   * Caches a token for a specific role.
   */
  public setToken(role: string, token: string): void {
    this.tokenCache.set(role.toUpperCase(), token);
  }

  /**
   * Clears all cached tokens.
   */
  public clearTokens(): void {
    this.tokenCache.clear();
  }

  /**
   * Checks if a token exists for a given role.
   */
  public hasToken(role: string): boolean {
    return this.tokenCache.has(role.toUpperCase());
  }
}
