/*
  Warnings:

  - Added the required column `updatedAt` to the `avaliacoes_360` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `criterio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `trilhas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "avaliacoes_360" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "criterio" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "trilhas" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
