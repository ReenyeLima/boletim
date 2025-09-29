import { Injectable } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateChamadaDto } from './dto/create-chamada.dto';

@Injectable()
export class AulasService {
  constructor(private prisma: PrismaService) { }

  async create(createAulaDto: CreateAulaDto) {
    createAulaDto.data = new Date(createAulaDto.data);
    return await this.prisma.aulas.create({
      data: createAulaDto
    });
  }

  findAll() {
    return `This action returns all aulas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aula`;
  }

  update(id: number, updateAulaDto: UpdateAulaDto) {
    return `This action updates a #${id} aula`;
  }

  remove(id: number) {
    return `This action removes a #${id} aula`;
  }

  registraChamada(createChamadaDto: CreateChamadaDto) {
    return this.prisma.faltas;
  }
}
