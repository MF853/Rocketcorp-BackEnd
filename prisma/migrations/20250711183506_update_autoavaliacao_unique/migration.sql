/*
  Warnings:

  - A unique constraint covering the columns `[idUser,idCiclo,criterioId]` on the table `avaliacoes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "avaliacoes_idUser_idCiclo_key";

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_idUser_idCiclo_criterioId_key" ON "avaliacoes"("idUser", "idCiclo", "criterioId");
