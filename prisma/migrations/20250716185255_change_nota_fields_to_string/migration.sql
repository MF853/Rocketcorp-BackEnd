-- AlterTable
ALTER TABLE "autoavaliacao" ALTER COLUMN "nota" SET DATA TYPE TEXT,
ALTER COLUMN "notaGestor" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "avaliacoes_360" ALTER COLUMN "nota" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "equalizacoes" ALTER COLUMN "mediaAutoavaliacao" SET DATA TYPE TEXT,
ALTER COLUMN "mediaAvaliacaoGestor" SET DATA TYPE TEXT,
ALTER COLUMN "mediaAvaliacao360" SET DATA TYPE TEXT,
ALTER COLUMN "notaFinal" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "mentoring" ALTER COLUMN "nota" SET DATA TYPE TEXT;
