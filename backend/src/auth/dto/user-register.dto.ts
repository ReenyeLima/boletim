import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from "@prisma/client";

export class RegisterUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    nome: string;

    @IsString()
    tipo: Role;
}

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}