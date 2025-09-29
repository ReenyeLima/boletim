import { Role } from "@prisma/client";
import { Request } from 'express'

export type UserDetails = {
    email: string;
    displayName: string;
    avatar: string;
    provider: string;
};

export type LocalUserDetails = {
    email: string;
    password: string;
    tipo: Role;
    nome: string;
}

export type LoginUserDetails = {
    email: string;
    password: string;
}

export type UserRole = {
    userId: number;
    role: Role;
}

export interface RequestWithUser extends Request {
  user: {
    id: string
    email: string
    role: string
    avatar: string
    displayName: string
    iat: number
    exp: number
  }
}