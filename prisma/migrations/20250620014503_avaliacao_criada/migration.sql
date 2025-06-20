-- CreateTable
CREATE TABLE "AvaliacaoAbstrata" (
    "id" SERIAL NOT NULL,
    "idAvaliador" INTEGER NOT NULL,
    "idAvaliado" INTEGER NOT NULL,
    "idCiclo" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION,

    CONSTRAINT "AvaliacaoAbstrata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" SERIAL NOT NULL,
    "justificativa" TEXT NOT NULL,
    "criterio" TEXT NOT NULL,
    "avaliacaoAbstrataId" INTEGER NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao360" (
    "id" SERIAL NOT NULL,
    "pontosFortes" TEXT NOT NULL,
    "pontosMelhora" TEXT NOT NULL,
    "avaliacaoAbstrataId" INTEGER NOT NULL,

    CONSTRAINT "Avaliacao360_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_avaliacaoAbstrataId_key" ON "Avaliacao"("avaliacaoAbstrataId");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao360_avaliacaoAbstrataId_key" ON "Avaliacao360"("avaliacaoAbstrataId");

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_avaliacaoAbstrataId_fkey" FOREIGN KEY ("avaliacaoAbstrataId") REFERENCES "AvaliacaoAbstrata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao360" ADD CONSTRAINT "Avaliacao360_avaliacaoAbstrataId_fkey" FOREIGN KEY ("avaliacaoAbstrataId") REFERENCES "AvaliacaoAbstrata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
