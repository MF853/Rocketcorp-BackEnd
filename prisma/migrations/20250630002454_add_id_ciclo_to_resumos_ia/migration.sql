-- CreateTable
CREATE TABLE "resumos_ia" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "resumo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumos_ia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resumos_ia_userId_idCiclo_key" ON "resumos_ia"("userId", "idCiclo");

-- AddForeignKey
ALTER TABLE "resumos_ia" ADD CONSTRAINT "resumos_ia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumos_ia" ADD CONSTRAINT "resumos_ia_idCiclo_fkey" FOREIGN KEY ("idCiclo") REFERENCES "ciclos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
