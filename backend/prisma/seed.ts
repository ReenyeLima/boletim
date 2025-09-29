import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  const psw = "senha1234";
  var senha = await bcrypt.hash(psw, 10);

  console.log(senha);


  await prisma.usuarios.upsert({
    where: { email: 'reenye.lima@senaisp.edu.br' },
    update: {},
    create: {
      nome: 'Reenye Lima',
      email: 'reenye.lima@senaisp.edu.br',
      senha: senha,
      tipo: 'PROF',
    },
  });

  await prisma.turmas.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "SESI 2º B - Desenvolvimento de Sistemas",
      periodo: "Integral",
      sigla: "2ºB DES"
    }
  });

  await prisma.usuariosPorTurma.upsert({
    where: { id: 1 },
    update: {},
    create: {
      usuarioId: 1,
      turmaId: 1
    }
  })

  await prisma.alunos.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: 'Alice Rodrigues da Silva',
      email: 'alice-silva332@portalsesisp.org.br',
      senha: senha,
      matricula: '25129175',
      turmaId: 1
    }
  });

  await prisma.alunos.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: 'Ana Lívia Prado',
      email: 'aprado@portalsesisp.org.br',
      senha: senha,
      matricula: '25129085',
      turmaId: 1
    }
  });

  await prisma.alunos.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nome: 'Bruno Adala Vaz de Oliveira',
      email: 'boliveira@portalsesisp.org.br',
      senha: senha,
      matricula: '25129021',
      turmaId: 1
    }
  });

  await prisma.alunos.upsert({
    where: { id: 4 },
    update: {},
    create: {
      nome: 'Carlos Henrique Campos de Albuquerque',
      email: 'carlos.albuquerque@portalsesisp.org.br',
      senha: senha,
      matricula: '25129019',
      turmaId: 1
    }
  });

  await prisma.componentes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "Linguagem de Marcação",
      carga: 120,
      sigla: "LIMA"
    }
  });

  await prisma.componentes.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: "Banco de Dados",
      carga: 75,
      sigla: "BCD"
    }
  });

  await prisma.componentesTurmas.upsert({
    where: { id: 1 },
    update: {},
    create: {
      turmaId: 1,
      componenteId: 1
    }
  });

  await prisma.componentesTurmas.upsert({
    where: { id: 2 },
    update: {},
    create: {
      turmaId: 1,
      componenteId: 2
    }
  });

  await prisma.atividades.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titulo: "Portifólio",
      ComponenteTurmaId: 1,
      peso: 5,
      dataLimite: new Date('2025-08-26'),
      tipo: 'SOM'
    }
  });

  console.log('Database seeded');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
