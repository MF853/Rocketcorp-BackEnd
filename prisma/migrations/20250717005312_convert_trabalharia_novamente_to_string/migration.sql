/*
  Warnings:

  - Changed the type of `trabalhariaNovamente` on the `avaliacoes_360` table. Converting enum to string to allow encryption.

*/
-- AlterTable: Convert enum to string while preserving data
ALTER TABLE "avaliacoes_360" ALTER COLUMN "trabalhariaNovamente" TYPE TEXT USING "trabalhariaNovamente"::TEXT;

-- DropEnum
DROP TYPE "MotivacaoTrabalhoNovamente";
