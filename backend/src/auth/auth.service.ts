import bcrypt from 'bcryptjs';
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LocalUserDetails, LoginUserDetails, UserRole, UserDetails } from "../Utils/types";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }


    async findUser(id: number) {
        const user = await this.prisma.usuarios.findUnique({
            where: {
                id: id
            }
        });

        delete user['password'];
        delete user['provider'];

        return user;
    }

    async validateLocalUser(data: LocalUserDetails) {
        const userExists = await this.prisma.usuarios.findUnique({
            where: { email: data.email },
        });

        if (userExists) {
            throw new BadRequestException('E-mail já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.usuarios.create({
            data: {
                email: data.email,
                senha: hashedPassword,
                nome: data.nome,
                tipo: data.tipo
            },
        });

        return { msg: 'Usuário criado com sucesso', id: user.id };
    }

    async loginLocalUser({ email, password }: LoginUserDetails) {
        const user = await this.prisma.usuarios.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        const isValidPassword = bcrypt.compare(password, user.senha);

        if (!isValidPassword) {
            throw new UnauthorizedException('Senha inválida');
        }

        delete user['password'];
        delete user['provider'];

        const { id, tipo, nome } = user;

        return this.jwtService.sign({
            sub: user.id,
            id,
            nome,
            tipo,
            email
        });
    }

    async updateUserRole(user: UserRole) {
        return await this.prisma.usuarios.update({
            where: { id: user.userId },
            data: { tipo: user.role },
            select: {
                id: true
            }
        });
    }
}