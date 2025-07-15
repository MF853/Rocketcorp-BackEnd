/*
  Warnings:

  - Added the required column `idCiclo` to the `equalizacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "equalizacoes" ADD COLUMN     "idCiclo" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "equalizacoes" ADD CONSTRAINT "equalizacoes_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
