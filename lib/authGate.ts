export class AuthGateError extends Error {
  constructor() {
    super("Sign up or log in required");
    this.name = "AuthGateError";
  }
}

/** Throws AuthGateError for a 401/403 response, otherwise no-ops. */
export function throwIfGated(response: Response): void {
  if (response.status === 401 || response.status === 403) {
    throw new AuthGateError();
  }
}
