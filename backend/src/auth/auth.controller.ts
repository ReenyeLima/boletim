
import { BadRequestException, Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from 'express';
import { GoogleAuthGuard } from "./utils/Guards";
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto, RegisterUserDto } from "./dto/user-register.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";
import { Public } from "@/decorators/public.decorator";
import { UserRole } from "@/utils/types";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    @Public()
    @Post('register')
    handleRegisterUser(@Body() body: RegisterUserDto) {
        return this.authService.validateLocalUser(body);
    }

    @Public()
    @Post('login')
    async handleLoginLocalUser(@Body() body: LoginUserDto) {
        return { token: await this.authService.loginLocalUser(body) }
    }

    @Get('status')
    user(@Req() request: Request) {
        // if (request.user) {
        //     return { msg: "Authenticated" };
        // } else {
        //     return { msg: "Not Authenticated" };
        // }
    }

    @Patch('update-role')
    async handleUpdateRole(@Body() body: UserRole, @Req() request: Request) {
        // return await this.authService.updateUserRole(body);
    }
}