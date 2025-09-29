import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Usuarios, Alunos } from "@prisma/client";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService
    ) {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    serializeUser(user: Usuarios, done: Function) {
        //console.log("Serializer User");

        done(null, user);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    async deserializeUser(payload: any, done: Function) {
        //console.log("Deserializer User");

        const user = await this.authService.findUser(payload.id);
        return user != null ? done(null, user) : done(null, null);
    }
} 