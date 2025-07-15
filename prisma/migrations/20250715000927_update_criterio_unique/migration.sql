/*
  Warnings:

  - A unique constraint covering the columns `[name,trilhaId,idCiclo]` on the table `criterio` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "criterio_name_trilhaId_key";

-- CreateIndex
CREATE UNIQUE INDEX "criterio_name_trilhaId_idCiclo_key" ON "criterio"("name", "trilhaId", "idCiclo");
