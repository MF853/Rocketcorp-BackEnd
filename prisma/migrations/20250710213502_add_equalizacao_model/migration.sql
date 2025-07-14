/*
  Warnings:

  - You are about to drop the `Equalizacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Equalizacao" DROP CONSTRAINT "Equalizacao_idAvaliado_fkey";

-- DropForeignKey
ALTER TABLE "Equalizacao" DROP CONSTRAINT "Equalizacao_idAvaliador_fkey";

-- DropTable
DROP TABLE "Equalizacao";

-- CreateTable
CREATE TABLE "equalizacoes" (
    "id" SERIAL NOT NULL,
    "idAvaliador" INTEGER NOT NULL,
    "idAvaliado" INTEGER NOT NULL,
    "mediaAutoavaliacao" DOUBLE PRECISION NOT NULL,
    "mediaAvaliacaoGestor" DOUBLE PRECISION NOT NULL,
    "mediaAvaliacao360" DOUBLE PRECISION NOT NULL,
    "notaFinal" DOUBLE PRECISION NOT NULL,
    "justificativa" TEXT NOT NULL,
    "status" "StatusEqualizacao" NOT NULL,

    CONSTRAINT "equalizacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "equalizacoes" ADD CONSTRAINT "equalizacoes_idAvaliador_fkey" FOREIGN KEY ("idAvaliador") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equalizacoes" ADD CONSTRAINT "equalizacoes_idAvaliado_fkey" FOREIGN KEY ("idAvaliado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
