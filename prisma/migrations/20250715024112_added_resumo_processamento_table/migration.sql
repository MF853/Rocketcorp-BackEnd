-- CreateEnum
CREATE TYPE "statusProcessamento" AS ENUM ('PENDENTE', 'PROCESSANDO', 'CONCLUIDO', 'ERRO');

-- CreateTable
CREATE TABLE "ResumoProcessamento" (
    "id" TEXT NOT NULL,
    "cicloId" INTEGER NOT NULL,
    "status" "statusProcessamento" NOT NULL,
    "statistics" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumoProcessamento_pkey" PRIMARY KEY ("id")
);
