/*
  Warnings:

  - You are about to drop the `Mentoring` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `autoavaliacoes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mentoring" DROP CONSTRAINT "Mentoring_idCiclo_fkey";

-- DropForeignKey
ALTER TABLE "Mentoring" DROP CONSTRAINT "Mentoring_idMentor_fkey";

-- DropForeignKey
ALTER TABLE "Mentoring" DROP CONSTRAINT "Mentoring_idMentorado_fkey";

-- DropForeignKey
ALTER TABLE "autoavaliacoes" DROP CONSTRAINT "autoavaliacoes_criterioId_fkey";

-- DropForeignKey
ALTER TABLE "autoavaliacoes" DROP CONSTRAINT "autoavaliacoes_idCiclo_fkey";

-- DropForeignKey
ALTER TABLE "autoavaliacoes" DROP CONSTRAINT "autoavaliacoes_idUser_fkey";

-- DropIndex
DROP INDEX "mentoring_idCiclo_idx";

-- DropIndex
DROP INDEX "mentoring_idMentor_idMentorado_idCiclo_key";

-- DropIndex
DROP INDEX "mentoring_idMentor_idx";

-- DropIndex
DROP INDEX "mentoring_idMentorado_idx";

-- DropTable
DROP TABLE "Mentoring";

-- DropTable
DROP TABLE "autoavaliacoes";

-- CreateTable
CREATE TABLE "autoavaliacao" (
    "id" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION,
    "justificativa" TEXT NOT NULL,
    "criterioId" INTEGER,
    "notaGestor" DOUBLE PRECISION,
    "justificativaGestor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "autoavaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "autoavaliacao_idUser_idx" ON "autoavaliacao"("idUser");

-- CreateIndex
CREATE INDEX "autoavaliacao_criterioId_idx" ON "autoavaliacao"("criterioId");

-- CreateIndex
CREATE INDEX "autoavaliacao_idCiclo_idx" ON "autoavaliacao"("idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "autoavaliacao_idUser_idCiclo_key" ON "autoavaliacao"("idUser", "idCiclo");

-- AddForeignKey
ALTER TABLE "autoavaliacao" ADD CONSTRAINT "autoavaliacao_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autoavaliacao" ADD CONSTRAINT "autoavaliacao_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autoavaliacao" ADD CONSTRAINT "autoavaliacao_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
