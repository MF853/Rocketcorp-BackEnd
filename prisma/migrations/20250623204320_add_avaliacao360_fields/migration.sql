/*
  Warnings:

  - Added the required column `nomeProjeto` to the `avaliacoes_360` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodoMeses` to the `avaliacoes_360` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trabalhariaNovamente` to the `avaliacoes_360` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MotivacaoTrabalhoNovamente" AS ENUM ('DISCORDO_TOTALMENTE', 'DISCORDO_PARCIALMENTE', 'INDIFERENTE', 'CONCORDO_PARCIALMENTE', 'CONCORDO_TOTALMENTE');

-- AlterTable
ALTER TABLE "avaliacoes_360" ADD COLUMN     "nomeProjeto" VARCHAR(255) NOT NULL,
ADD COLUMN     "periodoMeses" INTEGER NOT NULL,
ADD COLUMN     "trabalhariaNovamente" "MotivacaoTrabalhoNovamente" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "unidade" VARCHAR(50);
