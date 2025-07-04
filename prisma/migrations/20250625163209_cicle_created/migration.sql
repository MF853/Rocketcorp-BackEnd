-- CreateTable
CREATE TABLE "ciclos" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'aberto',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ciclos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CicloToreferencia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CicloToreferencia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AvaliacaoToCiclo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AvaliacaoToCiclo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_Avaliacao360ToCiclo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Avaliacao360ToCiclo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ciclos_year_idx" ON "ciclos"("year");

-- CreateIndex
CREATE INDEX "ciclos_period_idx" ON "ciclos"("period");

-- CreateIndex
CREATE UNIQUE INDEX "ciclos_name_year_period_key" ON "ciclos"("name", "year", "period");

-- CreateIndex
CREATE INDEX "_CicloToreferencia_B_index" ON "_CicloToreferencia"("B");

-- CreateIndex
CREATE INDEX "_AvaliacaoToCiclo_B_index" ON "_AvaliacaoToCiclo"("B");

-- CreateIndex
CREATE INDEX "_Avaliacao360ToCiclo_B_index" ON "_Avaliacao360ToCiclo"("B");

-- AddForeignKey
ALTER TABLE "_CicloToreferencia" ADD CONSTRAINT "_CicloToreferencia_A_fkey" FOREIGN KEY ("A") REFERENCES "ciclos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CicloToreferencia" ADD CONSTRAINT "_CicloToreferencia_B_fkey" FOREIGN KEY ("B") REFERENCES "referencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AvaliacaoToCiclo" ADD CONSTRAINT "_AvaliacaoToCiclo_A_fkey" FOREIGN KEY ("A") REFERENCES "avaliacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AvaliacaoToCiclo" ADD CONSTRAINT "_AvaliacaoToCiclo_B_fkey" FOREIGN KEY ("B") REFERENCES "ciclos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Avaliacao360ToCiclo" ADD CONSTRAINT "_Avaliacao360ToCiclo_A_fkey" FOREIGN KEY ("A") REFERENCES "avaliacoes_360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Avaliacao360ToCiclo" ADD CONSTRAINT "_Avaliacao360ToCiclo_B_fkey" FOREIGN KEY ("B") REFERENCES "ciclos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
