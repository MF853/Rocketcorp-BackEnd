-- CreateEnum
CREATE TYPE "Role" AS ENUM ('colaborador', 'admin', 'rh', 'gestor', 'mentor', 'comite');

-- CreateEnum
CREATE TYPE "StatusEqualizacao" AS ENUM ('PENDENTE', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "statusProcessamento" AS ENUM ('PENDENTE', 'PROCESSANDO', 'CONCLUIDO', 'ERRO');

-- CreateTable
CREATE TABLE "equipes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(255),
    "idGestor" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role"[] DEFAULT ARRAY['colaborador']::"Role"[],
    "cargo" VARCHAR(50),
    "unidade" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mentorId" INTEGER,
    "gestorId" INTEGER,
    "trilhaId" INTEGER,
    "idEquipe" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ciclos" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dataAberturaAvaliacao" TIMESTAMP(3) NOT NULL,
    "dataFechamentoAvaliacao" TIMESTAMP(3) NOT NULL,
    "dataAberturaRevisaoGestor" TIMESTAMP(3) NOT NULL,
    "dataFechamentoRevisaoGestor" TIMESTAMP(3) NOT NULL,
    "dataAberturaRevisaoComite" TIMESTAMP(3) NOT NULL,
    "dataFechamentoRevisaoComite" TIMESTAMP(3) NOT NULL,
    "dataFinalizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ciclos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trilhas" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trilhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criterio" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "description" VARCHAR(255) NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "trilhaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "criterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumos_ia" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "resumo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumos_ia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referencias" (
    "id" SERIAL NOT NULL,
    "idReferenciador" INTEGER NOT NULL,
    "idReferenciado" INTEGER NOT NULL,
    "justificativa" TEXT NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autoavaliacao" (
    "id" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "nota" TEXT,
    "justificativa" TEXT NOT NULL,
    "criterioId" INTEGER,
    "notaGestor" TEXT,
    "justificativaGestor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "autoavaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes_360" (
    "id" SERIAL NOT NULL,
    "idAvaliador" INTEGER NOT NULL,
    "idAvaliado" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "nota" TEXT,
    "pontosFortes" TEXT NOT NULL,
    "pontosMelhora" TEXT NOT NULL,
    "nomeProjeto" VARCHAR(255) NOT NULL,
    "periodoMeses" INTEGER NOT NULL,
    "trabalhariaNovamente" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacoes_360_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentoring" (
    "id" SERIAL NOT NULL,
    "idMentor" INTEGER NOT NULL,
    "idMentorado" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "nota" TEXT,
    "justificativa" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equalizacoes" (
    "id" SERIAL NOT NULL,
    "idAvaliador" INTEGER NOT NULL,
    "idAvaliado" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "mediaAutoavaliacao" TEXT NOT NULL,
    "mediaAvaliacaoGestor" TEXT NOT NULL,
    "mediaAvaliacao360" TEXT NOT NULL,
    "notaFinal" TEXT NOT NULL,
    "justificativa" TEXT NOT NULL,
    "status" "StatusEqualizacao" NOT NULL,

    CONSTRAINT "equalizacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumoProcessamento" (
    "id" TEXT NOT NULL,
    "cicloId" INTEGER NOT NULL,
    "status" "statusProcessamento" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumoProcessamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "entity" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_trilhaId_idx" ON "users"("trilhaId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "ciclos_year_idx" ON "ciclos"("year");

-- CreateIndex
CREATE INDEX "ciclos_period_idx" ON "ciclos"("period");

-- CreateIndex
CREATE UNIQUE INDEX "ciclos_year_period_key" ON "ciclos"("year", "period");

-- CreateIndex
CREATE UNIQUE INDEX "trilhas_name_key" ON "trilhas"("name");

-- CreateIndex
CREATE INDEX "criterio_trilhaId_idx" ON "criterio"("trilhaId");

-- CreateIndex
CREATE INDEX "criterio_idCiclo_idx" ON "criterio"("idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "criterio_name_trilhaId_idCiclo_key" ON "criterio"("name", "trilhaId", "idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "resumos_ia_userId_idCiclo_key" ON "resumos_ia"("userId", "idCiclo");

-- CreateIndex
CREATE INDEX "referencias_idReferenciador_idx" ON "referencias"("idReferenciador");

-- CreateIndex
CREATE INDEX "referencias_idReferenciado_idx" ON "referencias"("idReferenciado");

-- CreateIndex
CREATE INDEX "referencias_idCiclo_idx" ON "referencias"("idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "referencias_idReferenciador_idReferenciado_idCiclo_key" ON "referencias"("idReferenciador", "idReferenciado", "idCiclo");

-- CreateIndex
CREATE INDEX "autoavaliacao_idUser_idx" ON "autoavaliacao"("idUser");

-- CreateIndex
CREATE INDEX "autoavaliacao_criterioId_idx" ON "autoavaliacao"("criterioId");

-- CreateIndex
CREATE INDEX "autoavaliacao_idCiclo_idx" ON "autoavaliacao"("idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "autoavaliacao_idUser_idCiclo_criterioId_key" ON "autoavaliacao"("idUser", "idCiclo", "criterioId");

-- CreateIndex
CREATE INDEX "avaliacoes_360_idAvaliador_idx" ON "avaliacoes_360"("idAvaliador");

-- CreateIndex
CREATE INDEX "avaliacoes_360_idAvaliado_idx" ON "avaliacoes_360"("idAvaliado");

-- CreateIndex
CREATE INDEX "avaliacoes_360_idCiclo_idx" ON "avaliacoes_360"("idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_360_idAvaliador_idAvaliado_idCiclo_key" ON "avaliacoes_360"("idAvaliador", "idAvaliado", "idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "equalizacoes_idAvaliado_idCiclo_key" ON "equalizacoes"("idAvaliado", "idCiclo");

-- CreateIndex
CREATE INDEX "logs_userId_idx" ON "logs"("userId");

-- CreateIndex
CREATE INDEX "logs_entity_idx" ON "logs"("entity");

-- AddForeignKey
ALTER TABLE "equipes" ADD CONSTRAINT "equipes_idGestor_fkey" FOREIGN KEY ("idGestor") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_trilhaId_fkey" FOREIGN KEY ("trilhaId") REFERENCES "trilhas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_idEquipe_fkey" FOREIGN KEY ("idEquipe") REFERENCES "equipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criterio" ADD CONSTRAINT "criterio_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criterio" ADD CONSTRAINT "criterio_trilhaId_fkey" FOREIGN KEY ("trilhaId") REFERENCES "trilhas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumos_ia" ADD CONSTRAINT "resumos_ia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumos_ia" ADD CONSTRAINT "resumos_ia_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referencias" ADD CONSTRAINT "referencias_idReferenciador_fkey" FOREIGN KEY ("idReferenciador") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referencias" ADD CONSTRAINT "referencias_idReferenciado_fkey" FOREIGN KEY ("idReferenciado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referencias" ADD CONSTRAINT "referencias_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autoavaliacao" ADD CONSTRAINT "autoavaliacao_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autoavaliacao" ADD CONSTRAINT "autoavaliacao_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autoavaliacao" ADD CONSTRAINT "autoavaliacao_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_360" ADD CONSTRAINT "avaliacoes_360_idAvaliador_fkey" FOREIGN KEY ("idAvaliador") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_360" ADD CONSTRAINT "avaliacoes_360_idAvaliado_fkey" FOREIGN KEY ("idAvaliado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_360" ADD CONSTRAINT "avaliacoes_360_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentoring" ADD CONSTRAINT "mentoring_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentoring" ADD CONSTRAINT "mentoring_idMentor_fkey" FOREIGN KEY ("idMentor") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentoring" ADD CONSTRAINT "mentoring_idMentorado_fkey" FOREIGN KEY ("idMentorado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equalizacoes" ADD CONSTRAINT "equalizacoes_idAvaliador_fkey" FOREIGN KEY ("idAvaliador") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equalizacoes" ADD CONSTRAINT "equalizacoes_idAvaliado_fkey" FOREIGN KEY ("idAvaliado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equalizacoes" ADD CONSTRAINT "equalizacoes_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumoProcessamento" ADD CONSTRAINT "ResumoProcessamento_cicloId_fkey" FOREIGN KEY ("cicloId") REFERENCES "ciclos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
