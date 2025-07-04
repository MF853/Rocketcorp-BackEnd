-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avaliadorId" INTEGER,
ADD COLUMN     "mentorId" INTEGER;

-- CreateTable
CREATE TABLE "referencias" (
    "id" SERIAL NOT NULL,
    "idReferenciador" INTEGER NOT NULL,
    "idReferenciado" INTEGER NOT NULL,
    "justificativa" TEXT NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referencias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referencias_idReferenciador_idx" ON "referencias"("idReferenciador");

-- CreateIndex
CREATE INDEX "referencias_idReferenciado_idx" ON "referencias"("idReferenciado");

-- CreateIndex
CREATE INDEX "referencias_idCiclo_idx" ON "referencias"("idCiclo");

-- CreateIndex
CREATE UNIQUE INDEX "referencias_idReferenciador_idReferenciado_idCiclo_key" ON "referencias"("idReferenciador", "idReferenciado", "idCiclo");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referencias" ADD CONSTRAINT "referencias_idReferenciador_fkey" FOREIGN KEY ("idReferenciador") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referencias" ADD CONSTRAINT "referencias_idReferenciado_fkey" FOREIGN KEY ("idReferenciado") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
