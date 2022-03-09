import * as jwtDecode from "jwt-decode";

const TOKEN_MIN_VAL_FOR_REFRESH = 15 * 60;

export function shouldRefreshToken(token: string | undefined): boolean {
  return (
    isTokenValid(token) &&
    tokenValidityDuration(token) < TOKEN_MIN_VAL_FOR_REFRESH
  );
}

export function isTokenValid(token: string | undefined): boolean {
  return tokenValidityDuration(token) > 0;
}

export function tokenValidityDuration(token: string | undefined): number {
  if (!token) {
    return 0;
  }
  try {
    const decoded: { exp: number } = jwtDecode.default(token);
    const now = Date.now() / 1000;
    return decoded.exp - now;
  } catch (error) {
    return 0;
  }
}
