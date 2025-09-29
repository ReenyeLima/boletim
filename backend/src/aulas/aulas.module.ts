import { Module } from '@nestjs/common';
import { AulasService } from './aulas.service';
import { AulasController } from './aulas.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [AulasController],
  providers: [AulasService, PrismaService],
})
export class AulasModule { }
