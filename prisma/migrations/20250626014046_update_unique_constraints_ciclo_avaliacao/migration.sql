/*
  Warnings:

  - A unique constraint covering the columns `[idAvaliador,idAvaliado,idCiclo]` on the table `avaliacoes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[year,period]` on the table `ciclos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `trilhas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "avaliacoes_idAvaliador_idAvaliado_idCiclo_criterioId_key";

-- DropIndex
DROP INDEX "ciclos_name_year_period_key";

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_idAvaliador_idAvaliado_idCiclo_key" ON "avaliacoes"("idAvaliador", "idAvaliado", "idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "ciclos_year_period_key" ON "ciclos"("year", "period");

-- CreateIndex
CREATE UNIQUE INDEX "trilhas_name_key" ON "trilhas"("name");
