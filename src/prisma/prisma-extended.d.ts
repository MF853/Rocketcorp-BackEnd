// src/types/prisma-extended.d.ts

// You might not need to explicitly import Prisma if you have
// "/// <reference types="@prisma/client" />" or if your tsconfig.json
// is set up to automatically include declaration files.
// However, explicitly importing provides better clarity.
import { Prisma } from "@prisma/client";

// Define the type for Avaliacao with its included relations.
// This uses Prisma's generated `AvaliacaoGetPayload` helper,
// which correctly infers the type based on the include statement.
export type AvaliacaoWithIncludes = Prisma.AvaliacaoGetPayload<{
  include: {
    avaliador: true;
    avaliado: true;
    criterio: true;
  };
}>;

// Define the type for Avaliacao360 with its included relations.
export type Avaliacao360WithIncludes = Prisma.Avaliacao360GetPayload<{
  include: {
    avaliador: true;
    avaliado: true;
    // Add any other specific includes for Avaliacao360 here,
    // as defined by your getAvaliacao360Includes() method.
  };
}>;

// You can add other custom types related to your Prisma models here if needed.
