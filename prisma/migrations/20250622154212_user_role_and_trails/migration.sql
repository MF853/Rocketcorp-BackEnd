/*
  Warnings:

  - You are about to drop the `Avaliacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Avaliacao360` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AvaliacaoAbstrata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_avaliacaoAbstrataId_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao360" DROP CONSTRAINT "Avaliacao360_avaliacaoAbstrataId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "trilhaId" INTEGER;

-- DropTable
DROP TABLE "Avaliacao";

-- DropTable
DROP TABLE "Avaliacao360";

-- DropTable
DROP TABLE "AvaliacaoAbstrata";

-- CreateTable
CREATE TABLE "trilhas" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "trilhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criterio" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "trilhaId" INTEGER NOT NULL,

    CONSTRAINT "criterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" SERIAL NOT NULL,
    "idAvaliador" INTEGER NOT NULL,
    "idAvaliado" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION,
    "justificativa" TEXT NOT NULL,
    "criterioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes_360" (
    "id" SERIAL NOT NULL,
    "idAvaliador" INTEGER NOT NULL,
    "idAvaliado" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION,
    "pontosFortes" TEXT NOT NULL,
    "pontosMelhora" TEXT NOT NULL,

    CONSTRAINT "avaliacoes_360_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "criterio_trilhaId_idx" ON "criterio"("trilhaId");

-- CreateIndex
CREATE UNIQUE INDEX "criterio_name_trilhaId_key" ON "criterio"("name", "trilhaId");

-- CreateIndex
CREATE INDEX "avaliacoes_idAvaliador_idx" ON "avaliacoes"("idAvaliador");

-- CreateIndex
CREATE INDEX "avaliacoes_idAvaliado_idx" ON "avaliacoes"("idAvaliado");

-- CreateIndex
CREATE INDEX "avaliacoes_criterioId_idx" ON "avaliacoes"("criterioId");

-- CreateIndex
CREATE INDEX "avaliacoes_idCiclo_idx" ON "avaliacoes"("idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_idAvaliador_idAvaliado_idCiclo_criterioId_key" ON "avaliacoes"("idAvaliador", "idAvaliado", "idCiclo", "criterioId");

-- CreateIndex
CREATE INDEX "avaliacoes_360_idAvaliador_idx" ON "avaliacoes_360"("idAvaliador");

-- CreateIndex
CREATE INDEX "avaliacoes_360_idAvaliado_idx" ON "avaliacoes_360"("idAvaliado");

-- CreateIndex
CREATE INDEX "avaliacoes_360_idCiclo_idx" ON "avaliacoes_360"("idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_360_idAvaliador_idAvaliado_idCiclo_key" ON "avaliacoes_360"("idAvaliador", "idAvaliado", "idCiclo");

-- CreateIndex
CREATE INDEX "users_trilhaId_idx" ON "users"("trilhaId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_trilhaId_fkey" FOREIGN KEY ("trilhaId") REFERENCES "trilhas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criterio" ADD CONSTRAINT "criterio_trilhaId_fkey" FOREIGN KEY ("trilhaId") REFERENCES "trilhas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_idAvaliador_fkey" FOREIGN KEY ("idAvaliador") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_idAvaliado_fkey" FOREIGN KEY ("idAvaliado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_360" ADD CONSTRAINT "avaliacoes_360_idAvaliador_fkey" FOREIGN KEY ("idAvaliador") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_360" ADD CONSTRAINT "avaliacoes_360_idAvaliado_fkey" FOREIGN KEY ("idAvaliado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
