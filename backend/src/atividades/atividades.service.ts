import { Injectable } from '@nestjs/common';
import { CreateAtividadeDto, CreateEntregaDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AtividadesService {
  constructor(private prisma: PrismaService) { }

  async create(createAtividadeDto: CreateAtividadeDto) {
    return await this.prisma.atividades.create({
      data: {
        titulo: createAtividadeDto.titulo,
        peso: createAtividadeDto.peso,
        dataLimite: new Date(createAtividadeDto.dataLimite),
        tipo: createAtividadeDto.tipo,
        ComponentesTurmas: {
          connect: {
            id: createAtividadeDto.ComponenteTurmaId,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all atividades`;
  }

  findOne(id: number) {
    return this.prisma.atividades.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        titulo: true,
        peso: true,
        ComponenteTurmaId: true,
        dataLimite: true,
        tipo: true,
        Entregas: true
      }
    });
  }

  update(id: number, updateAtividadeDto: UpdateAtividadeDto) {
    return `This action updates a #${id} atividade`;
  }

  remove(id: number) {
    return `This action removes a #${id} atividade`;
  }

  async createEntrega(createEntregaDto: CreateEntregaDto[]) {
    const upsertPromises = createEntregaDto.map((item: CreateEntregaDto) => {
      return this.prisma.entregas.upsert({
        where: {
          atividadeId_alunoId: {
            atividadeId: item.atividadeId,
            alunoId: item.alunoId
          }
        },
        update: {
          nota: item.nota
        },
        create: {
          atividadeId: item.atividadeId,
          alunoId: item.alunoId,
          nota: item.nota
        }
      });
    });

    return await this.prisma.$transaction(upsertPromises);
  }
}
