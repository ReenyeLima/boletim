import { TipoAtividade } from '@prisma/client';

export class CreateAtividadeDto {
    titulo: string;
    ComponenteTurmaId: number;
    peso: number;
    dataLimite: Date;
    tipo: TipoAtividade;
}

export class CreateEntregaDto {
    atividadeId: number;
    alunoId: number;
    nota: number;
}