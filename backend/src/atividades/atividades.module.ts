import { Module } from '@nestjs/common';
import { AtividadesService } from './atividades.service';
import { AtividadesController } from './atividades.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [AtividadesController],
  providers: [AtividadesService, PrismaService],
})
export class AtividadesModule { }
