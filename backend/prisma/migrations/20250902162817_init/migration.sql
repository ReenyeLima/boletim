-- CreateTable
CREATE TABLE `Usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `tipo` ENUM('PROF', 'CORD') NOT NULL,

    UNIQUE INDEX `Usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Turmas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `periodo` VARCHAR(191) NOT NULL,
    `sigla` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alunos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `turmaId` INTEGER NOT NULL,

    UNIQUE INDEX `Alunos_email_key`(`email`),
    UNIQUE INDEX `Alunos_matricula_key`(`matricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Componentes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `carga` INTEGER NOT NULL,
    `sigla` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComponentesTurmas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `turmaId` INTEGER NOT NULL,
    `componenteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Atividades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `ComponenteTurmaId` INTEGER NOT NULL,
    `peso` DOUBLE NOT NULL,
    `dataLimite` DATETIME(3) NOT NULL,
    `tipo` ENUM('SOM', 'FOR', 'DIAG') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entregas` (
    `atividadeId` INTEGER NOT NULL,
    `alunoId` INTEGER NOT NULL,
    `dataEntrega` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nota` DOUBLE NOT NULL,

    PRIMARY KEY (`atividadeId`, `alunoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aulas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL,
    `ComponenteTurmaId` INTEGER NOT NULL,
    `cargahoraria` INTEGER NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faltas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aulaId` INTEGER NOT NULL,
    `alunoId` INTEGER NOT NULL,
    `faltas` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuariosPorTurma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `turmaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Alunos` ADD CONSTRAINT `Alunos_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turmas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComponentesTurmas` ADD CONSTRAINT `ComponentesTurmas_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turmas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComponentesTurmas` ADD CONSTRAINT `ComponentesTurmas_componenteId_fkey` FOREIGN KEY (`componenteId`) REFERENCES `Componentes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Atividades` ADD CONSTRAINT `Atividades_ComponenteTurmaId_fkey` FOREIGN KEY (`ComponenteTurmaId`) REFERENCES `ComponentesTurmas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entregas` ADD CONSTRAINT `Entregas_atividadeId_fkey` FOREIGN KEY (`atividadeId`) REFERENCES `Atividades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entregas` ADD CONSTRAINT `Entregas_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Alunos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aulas` ADD CONSTRAINT `Aulas_ComponenteTurmaId_fkey` FOREIGN KEY (`ComponenteTurmaId`) REFERENCES `ComponentesTurmas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faltas` ADD CONSTRAINT `Faltas_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Alunos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faltas` ADD CONSTRAINT `Faltas_aulaId_fkey` FOREIGN KEY (`aulaId`) REFERENCES `Aulas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPorTurma` ADD CONSTRAINT `UsuariosPorTurma_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPorTurma` ADD CONSTRAINT `UsuariosPorTurma_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turmas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
