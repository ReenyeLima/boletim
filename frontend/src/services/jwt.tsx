import { jwtDecode } from "jwt-decode";

interface UserJwtPayload {
  sub: string;
  nome: string;
  email: string;
  exp: number;
  iat?: number;
  id: number;
  tipo: string;
}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<UserJwtPayload>(token);
    return exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

function decodeToken(token: string): UserJwtPayload {
  return jwtDecode(token);
}

export default { isTokenExpired, decodeToken };
