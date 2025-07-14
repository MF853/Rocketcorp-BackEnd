/*
  Warnings:

  - A unique constraint covering the columns `[idAvaliado,idCiclo]` on the table `equalizacoes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "equalizacoes_idAvaliado_idCiclo_key" ON "equalizacoes"("idAvaliado", "idCiclo");
