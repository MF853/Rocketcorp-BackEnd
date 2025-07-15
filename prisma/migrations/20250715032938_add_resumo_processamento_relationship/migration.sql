-- AddForeignKey
ALTER TABLE "ResumoProcessamento" ADD CONSTRAINT "ResumoProcessamento_cicloId_fkey" FOREIGN KEY ("cicloId") REFERENCES "ciclos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
