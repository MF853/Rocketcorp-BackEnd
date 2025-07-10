/*
  Warnings:

  - You are about to drop the column `idAvaliado` on the `avaliacoes` table. All the data in the column will be lost.
  - You are about to drop the column `idAvaliador` on the `avaliacoes` table. All the data in the column will be lost.
  - You are about to drop the column `avaliadorId` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[idUser,idCiclo]` on the table `avaliacoes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idUser` to the `avaliacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataAberturaAvaliacao` to the `ciclos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataAberturaRevisaoComite` to the `ciclos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataAberturaRevisaoGestor` to the `ciclos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataFechamentoAvaliacao` to the `ciclos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataFechamentoRevisaoComite` to the `ciclos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataFechamentoRevisaoGestor` to the `ciclos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataFinalizacao` to the `ciclos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusEqualizacao" AS ENUM ('PENDENTE', 'FINALIZADO');

-- DropForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_idAvaliado_fkey";

-- DropForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_idAvaliador_fkey";

-- DropIndex
DROP INDEX "avaliacoes_idAvaliado_idx";

-- DropIndex
DROP INDEX "avaliacoes_idAvaliador_idAvaliado_idCiclo_key";

-- DropIndex
DROP INDEX "avaliacoes_idAvaliador_idx";

-- AlterTable
ALTER TABLE "avaliacoes" DROP COLUMN "idAvaliado",
DROP COLUMN "idAvaliador",
ADD COLUMN     "idUser" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ciclos" ADD COLUMN     "dataAberturaAvaliacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataAberturaRevisaoComite" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataAberturaRevisaoGestor" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataFechamentoAvaliacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataFechamentoRevisaoComite" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataFechamentoRevisaoGestor" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataFinalizacao" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avaliadorId",
ADD COLUMN     "cargo" VARCHAR(50),
ADD COLUMN     "gestorId" INTEGER,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT[] DEFAULT ARRAY['user']::TEXT[];

-- CreateTable
CREATE TABLE "Mentoring" (
    "id" SERIAL NOT NULL,
    "idMentor" INTEGER NOT NULL,
    "idMentorado" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION,
    "justificativa" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equalizacao" (
    "id" SERIAL NOT NULL,
    "idAvaliador" INTEGER NOT NULL,
    "idAvaliado" INTEGER NOT NULL,
    "mediaAutoavaliacao" DOUBLE PRECISION NOT NULL,
    "mediaAvaliacaoGestor" DOUBLE PRECISION NOT NULL,
    "mediaAvaliacao360" DOUBLE PRECISION NOT NULL,
    "notaFinal" DOUBLE PRECISION NOT NULL,
    "justificativa" TEXT NOT NULL,
    "status" "StatusEqualizacao" NOT NULL,

    CONSTRAINT "Equalizacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "avaliacoes_idUser_idx" ON "avaliacoes"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_idUser_idCiclo_key" ON "avaliacoes"("idUser", "idCiclo");

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentoring" ADD CONSTRAINT "Mentoring_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentoring" ADD CONSTRAINT "Mentoring_idMentor_fkey" FOREIGN KEY ("idMentor") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentoring" ADD CONSTRAINT "Mentoring_idMentorado_fkey" FOREIGN KEY ("idMentorado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equalizacao" ADD CONSTRAINT "Equalizacao_idAvaliador_fkey" FOREIGN KEY ("idAvaliador") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equalizacao" ADD CONSTRAINT "Equalizacao_idAvaliado_fkey" FOREIGN KEY ("idAvaliado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
