 -- Drop the old unique index if it exists
   DROP INDEX IF EXISTS "autoavaliacao_idUser_idCiclo_key";
   DROP INDEX IF EXISTS "avaliacoes_idUser_idCiclo_key";
   -- (The second name is for safety, as it may have been created with either name.)

   -- Ensure the correct unique index exists
   CREATE UNIQUE INDEX IF NOT EXISTS "avaliacoes_idUser_idCiclo_criterioId_key" ON "autoavaliacao"("idUser", "idCiclo", "criterioId");