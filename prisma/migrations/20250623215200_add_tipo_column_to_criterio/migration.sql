/*
  Warnings:

  - Added the required column `description` to the `criterio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `criterio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "avaliacoes" ALTER COLUMN "criterioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "criterio" ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "peso" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
ADD COLUMN     "tipo" VARCHAR(50) NOT NULL;
