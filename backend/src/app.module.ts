import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { TurmasModule } from './turmas/turmas.module';
import { AlunosModule } from './alunos/alunos.module';
import { AtividadesModule } from './atividades/atividades.module';
import { AulasModule } from './aulas/aulas.module';

@Module({
  imports: [AuthModule, TurmasModule, AlunosModule, AtividadesModule, AulasModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
