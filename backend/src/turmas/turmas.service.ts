import { Injectable } from '@nestjs/common';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TurmasService {
  constructor(private prisma: PrismaService) { }

  async create(createTurmaDto: CreateTurmaDto) {
    const turma = await this.prisma.turmas.create({
      data: createTurmaDto
    })
    return turma;
  }

  async findByUser(usuarioId: number) {
    const turmas = await this.prisma.usuariosPorTurma.findMany({
      where: {
        usuarioId
      },
      select: {
        Turmas: {
          select: {
            id: true,
            nome: true,
            periodo: true,
            sigla: true,
            _count: {
              select: {
                Alunos: true
              }
            }
          }
        }
      }
    });

    return turmas;
  }

  findAtividades(id: number) {
    const atividades = this.prisma.componentesTurmas.findMany({
      where: {
        turmaId: id
      },
      select: {
        id: true,
        turma: {
          select: {
            nome: true,
            sigla: true
          }
        },
        componente: {
          select: {
            nome: true,
          }
        },
        Atividades: true
      }
    });

    return atividades;
  }

  findAll() {
    return `This action returns all turmas`;
  }

  async findOne(id: number) {
    return await this.prisma.turmas.findUnique({
      where: {
        id: id
      },
      select: {
        Alunos: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });
  }

  findAulas(turmaId: number) {
    return this.prisma.aulas.findMany({
      select: {
        id: true,
        data: true,
        ComponenteTurmaId: true,
        cargahoraria: true,
        descricao: true,
        ComponentesTurmas: true
      },
      where: {
        ComponentesTurmas: {
          turmaId: turmaId
        }
      }
    });
  }

  update(id: number, updateTurmaDto: UpdateTurmaDto) {
    return `This action updates a #${id} turma`;
  }

  remove(id: number) {
    return `This action removes a #${id} turma`;
  }
}
