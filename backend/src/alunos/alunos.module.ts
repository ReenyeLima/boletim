import { Module } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';

@Module({
  controllers: [AlunosController],
  providers: [AlunosService],
})
export class AlunosModule {}
