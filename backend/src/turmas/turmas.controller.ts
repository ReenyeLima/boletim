import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TurmasService } from './turmas.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Controller('turmas')
export class TurmasController {
  constructor(
    private readonly turmasService: TurmasService,
    private prisma: PrismaService
  ) { }

  @Post()
  create(@Body() createTurmaDto: CreateTurmaDto) {
    return this.turmasService.create(createTurmaDto);
  }

  @Get()
  async findAll() {
    return await this.prisma.turmas.findMany({
      include: {
        Alunos: {
          select: {
            nome: true,
            matricula: true,
            email: true
          }
        }
      }
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turmasService.findOne(+id);
  }

  @Get('/usuario/:id')
  findByUser(@Param('id') id: number) {
    return this.turmasService.findByUser(+id);
  }

  @Get('/:id/atividades')
  findAtividades(@Param('id') id: number) {
    return this.turmasService.findAtividades(+id);
  }

  @Get('/:id/aulas')
  findAulas(@Param('id') id: number) {
    return this.turmasService.findAulas(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmasService.update(+id, updateTurmaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turmasService.remove(+id);
  }
}
