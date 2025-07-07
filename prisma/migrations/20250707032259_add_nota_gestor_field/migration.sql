-- AlterTable
ALTER TABLE "avaliacao" ADD COLUMN     "notaGestor" INTEGER,
ALTER COLUMN "nota" DROP NOT NULL;
