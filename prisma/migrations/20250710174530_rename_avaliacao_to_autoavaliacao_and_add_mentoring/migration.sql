/*
  Warnings:

  - You are about to drop the column `justificativaGestor` on the `mentoring` table. All the data in the column will be lost.
  - You are about to drop the column `notaGestor` on the `mentoring` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mentoring" DROP COLUMN "justificativaGestor",
DROP COLUMN "notaGestor";
