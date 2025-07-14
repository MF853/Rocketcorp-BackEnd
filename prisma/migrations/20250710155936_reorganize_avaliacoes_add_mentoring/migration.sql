/*
  Warnings:

  - You are about to drop the `avaliacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_criterioId_fkey";

-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_idAvaliado_fkey";

-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_idAvaliador_fkey";

-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_idCiclo_fkey";

-- DropTable
DROP TABLE "avaliacao";

-- CreateTable
CREATE TABLE "autoavaliacoes" (
    "id" SERIAL NOT NULL,
    "idAvaliador" INTEGER NOT NULL,
    "idAvaliado" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "criterioId" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION,
    "notaGestor" DOUBLE PRECISION,
    "justificativa" TEXT NOT NULL,
    "justificativaGestor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "autoavaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentoring" (
    "id" SERIAL NOT NULL,
    "idMentor" INTEGER NOT NULL,
    "idMentorado" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION,
    "notaGestor" DOUBLE PRECISION,
    "justificativa" TEXT NOT NULL,
    "justificativaGestor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentoring_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "autoavaliacoes_idAvaliador_idAvaliado_idCiclo_criterioId_key" ON "autoavaliacoes"("idAvaliador", "idAvaliado", "idCiclo", "criterioId");

-- CreateIndex
CREATE INDEX "mentoring_idMentor_idx" ON "mentoring"("idMentor");

-- CreateIndex
CREATE INDEX "mentoring_idMentorado_idx" ON "mentoring"("idMentorado");

-- CreateIndex
CREATE INDEX "mentoring_idCiclo_idx" ON "mentoring"("idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "mentoring_idMentor_idMentorado_idCiclo_key" ON "mentoring"("idMentor", "idMentorado", "idCiclo");

-- AddForeignKey
ALTER TABLE "autoavaliacoes" ADD CONSTRAINT "autoavaliacoes_idAvaliador_fkey" FOREIGN KEY ("idAvaliador") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autoavaliacoes" ADD CONSTRAINT "autoavaliacoes_idAvaliado_fkey" FOREIGN KEY ("idAvaliado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autoavaliacoes" ADD CONSTRAINT "autoavaliacoes_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autoavaliacoes" ADD CONSTRAINT "autoavaliacoes_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentoring" ADD CONSTRAINT "mentoring_idMentor_fkey" FOREIGN KEY ("idMentor") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentoring" ADD CONSTRAINT "mentoring_idMentorado_fkey" FOREIGN KEY ("idMentorado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentoring" ADD CONSTRAINT "mentoring_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
