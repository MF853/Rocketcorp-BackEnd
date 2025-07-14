-- AlterTable
ALTER TABLE "users" ADD COLUMN     "idEquipe" INTEGER;

-- CreateTable
CREATE TABLE "equipes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(255),
    "idGestor" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "equipes" ADD CONSTRAINT "equipes_idGestor_fkey" FOREIGN KEY ("idGestor") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_idEquipe_fkey" FOREIGN KEY ("idEquipe") REFERENCES "equipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "avaliacoes_idUser_idCiclo_criterioId_key" RENAME TO "autoavaliacao_idUser_idCiclo_criterioId_key";
