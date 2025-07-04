/*
  Warnings:

  - You are about to drop the `_Avaliacao360ToCiclo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AvaliacaoToCiclo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CicloToreferencia` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idCiclo` to the `criterio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_Avaliacao360ToCiclo" DROP CONSTRAINT "_Avaliacao360ToCiclo_A_fkey";

-- DropForeignKey
ALTER TABLE "_Avaliacao360ToCiclo" DROP CONSTRAINT "_Avaliacao360ToCiclo_B_fkey";

-- DropForeignKey
ALTER TABLE "_AvaliacaoToCiclo" DROP CONSTRAINT "_AvaliacaoToCiclo_A_fkey";

-- DropForeignKey
ALTER TABLE "_AvaliacaoToCiclo" DROP CONSTRAINT "_AvaliacaoToCiclo_B_fkey";

-- DropForeignKey
ALTER TABLE "_CicloToreferencia" DROP CONSTRAINT "_CicloToreferencia_A_fkey";

-- DropForeignKey
ALTER TABLE "_CicloToreferencia" DROP CONSTRAINT "_CicloToreferencia_B_fkey";

-- AlterTable
ALTER TABLE "criterio" ADD COLUMN     "idCiclo" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_Avaliacao360ToCiclo";

-- DropTable
DROP TABLE "_AvaliacaoToCiclo";

-- DropTable
DROP TABLE "_CicloToreferencia";

-- CreateIndex
CREATE INDEX "criterio_idCiclo_idx" ON "criterio"("idCiclo");

-- AddForeignKey
ALTER TABLE "criterio" ADD CONSTRAINT "criterio_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referencias" ADD CONSTRAINT "referencias_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_360" ADD CONSTRAINT "avaliacoes_360_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
