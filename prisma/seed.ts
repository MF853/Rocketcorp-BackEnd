import {
  PrismaClient,
  MotivacaoTrabalhoNovamente,
  StatusEqualizacao,
} from "@prisma/client";
import * as argon from "argon2";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await argon.hash(password);
}

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes (ordem importa por FK)
  await prisma.equalizacao.deleteMany();
  await prisma.mentoring.deleteMany();
  await prisma.avaliacao360.deleteMany();
  await prisma.autoavaliacao.deleteMany();
  await prisma.referencia.deleteMany();
  await prisma.resumoIA.deleteMany();
  await prisma.criterio.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ciclo.deleteMany();
  await prisma.trilha.deleteMany();
  console.log("🧹 Dados antigos removidos");

  // 1. Trilhas
  const trilhas = await prisma.trilha.createMany({
    data: [
      { name: "Desenvolvimento" },
      { name: "Dados" },
      { name: "Infraestrutura" },
      { name: "Gestão" },
    ],
  });
  const trilhasAll = await prisma.trilha.findMany();
  console.log(`✅ Trilhas criadas: ${trilhas.count}`);

  // 2. Ciclos (com datas obrigatórias)
  const now = new Date();
  const ciclo = await prisma.ciclo.create({
    data: {
      name: "2025.2",
      year: 2025,
      period: 2,
      status: "aberto",
      dataAberturaAvaliacao: now,
      dataFechamentoAvaliacao: new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
      ),
      dataAberturaRevisaoGestor: new Date(
        now.getTime() + 8 * 24 * 60 * 60 * 1000
      ),
      dataFechamentoRevisaoGestor: new Date(
        now.getTime() + 14 * 24 * 60 * 60 * 1000
      ),
      dataAberturaRevisaoComite: new Date(
        now.getTime() + 15 * 24 * 60 * 60 * 1000
      ),
      dataFechamentoRevisaoComite: new Date(
        now.getTime() + 21 * 24 * 60 * 60 * 1000
      ),
      dataFinalizacao: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  // Adicionando mais 3 ciclos com status diferentes
  await prisma.ciclo.create({
    data: {
      name: "2025.1",
      year: 2025,
      period: 1,
      status: "revisao_gestor",
      dataAberturaAvaliacao: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      dataFechamentoAvaliacao: new Date(
        now.getTime() - 53 * 24 * 60 * 60 * 1000
      ),
      dataAberturaRevisaoGestor: new Date(
        now.getTime() - 52 * 24 * 60 * 60 * 1000
      ),
      dataFechamentoRevisaoGestor: new Date(
        now.getTime() - 46 * 24 * 60 * 60 * 1000
      ),
      dataAberturaRevisaoComite: new Date(
        now.getTime() - 45 * 24 * 60 * 60 * 1000
      ),
      dataFechamentoRevisaoComite: new Date(
        now.getTime() - 39 * 24 * 60 * 60 * 1000
      ),
      dataFinalizacao: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.ciclo.create({
    data: {
      name: "2024.2",
      year: 2024,
      period: 2,
      status: "revisao_comite",
      dataAberturaAvaliacao: new Date(
        now.getTime() - 120 * 24 * 60 * 60 * 1000
      ),
      dataFechamentoAvaliacao: new Date(
        now.getTime() - 113 * 24 * 60 * 60 * 1000
      ),
      dataAberturaRevisaoGestor: new Date(
        now.getTime() - 112 * 24 * 60 * 60 * 1000
      ),
      dataFechamentoRevisaoGestor: new Date(
        now.getTime() - 106 * 24 * 60 * 60 * 1000
      ),
      dataAberturaRevisaoComite: new Date(
        now.getTime() - 105 * 24 * 60 * 60 * 1000
      ),
      dataFechamentoRevisaoComite: new Date(
        now.getTime() - 99 * 24 * 60 * 60 * 1000
      ),
      dataFinalizacao: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    },
  });
  const cicloFinalizado = await prisma.ciclo.create({
    data: {
      name: "2024.1",
      year: 2024,
      period: 1,
      status: "finalizado",
      dataAberturaAvaliacao: new Date(
        now.getTime() - 240 * 24 * 60 * 60 * 1000
      ),
      dataFechamentoAvaliacao: new Date(
        now.getTime() - 233 * 24 * 60 * 60 * 1000
      ),
      dataAberturaRevisaoGestor: new Date(
        now.getTime() - 232 * 24 * 60 * 60 * 1000
      ),
      dataFechamentoRevisaoGestor: new Date(
        now.getTime() - 226 * 24 * 60 * 60 * 1000
      ),
      dataAberturaRevisaoComite: new Date(
        now.getTime() - 225 * 24 * 60 * 60 * 1000
      ),
      dataFechamentoRevisaoComite: new Date(
        now.getTime() - 219 * 24 * 60 * 60 * 1000
      ),
      dataFinalizacao: new Date(now.getTime() - 210 * 24 * 60 * 60 * 1000),
    },
  });
  console.log("✅ Ciclo criado");

  // 3. Usuários

  // usuario admin
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 0,
        name: "Raylandson Cesário",
        email: "raylandson.cesario@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["user, admin"],
        unidade: "Desenvolvimento",
        trilhaId: trilhasAll[0].id,
      },
    }),
    //Usuario gestor
    prisma.user.create({
      data: {
        id: 1,
        name: "Alice Cadete",
        email: "alice.cadete@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["manager"],
        unidade: "Desenvolvimento",
        trilhaId: trilhasAll[0].id,
      },
    }),

    // usuarios colaboladores
    prisma.user.create({
      data: {
        id: 2,
        name: "Arthur Lins",
        email: "arthur.lins@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["user"],
        unidade: "Dados",
        trilhaId: trilhasAll[1].id,
      },
    }),
    prisma.user.create({
      data: {
        id: 3,
        name: "Erico Chen",
        email: "erico.chen@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["user"],
        unidade: "Infraestrutura",
        trilhaId: trilhasAll[2].id,
      },
    }),
    prisma.user.create({
      data: {
        id: 4,
        name: "Luan Bezerra",
        email: "luan.bezerra@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["user"],
        unidade: "Desenvolvimento",
        trilhaId: trilhasAll[0].id,
      },
    }),

    // Usuário comitê
    prisma.user.create({
      data: {
        id: 5,
        name: "Fernanda Lima",
        email: "fernanda.lima@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["comite"],
        unidade: "Gestão",
        trilhaId: trilhasAll[3].id,
      },
    }),
    // usuário mentor
    prisma.user.create({
      data: {
        id: 6,
        name: "Bruno Souza",
        email: "bruno.souza@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["mentor"],
        unidade: "Desenvolvimento",
        trilhaId: trilhasAll[0].id,
      },
    }),
  ]);
  console.log(`✅ Usuários criados: ${users.length}`);

  // 4. Relação de mentor
  await prisma.user.update({
    where: { id: users[2].id }, // Arthur Lins
    data: { mentorId: users[6].id }, // Bruno
  });
  await prisma.user.update({
    where: { id: users[1].id }, // Alice
    data: { mentorId: users[6].id }, // Bruno
  });
  console.log("✅ Relação de mentor criada");

  // 5. Critérios (um por trilha)
  const criterios = await Promise.all(
    trilhasAll.map((trilha) =>
      prisma.criterio.create({
        data: {
          name: `Organização ${trilha.name}`,
          tipo: "comportamental",
          peso: 5.0,
          description: `Organização para trilha ${trilha.name}`,
          idCiclo: ciclo.id,
          trilhaId: trilha.id,
        },
      })
    )
  );
  console.log(`✅ Critérios criados: ${criterios.length}`);

  // 6. Referências
  await prisma.referencia.create({
    data: {
      idReferenciador: users[1].id, // Alice Cadete
      idReferenciado: users[2].id, // Arthur Lins
      idCiclo: ciclo.id,
      justificativa: "Ótimo desempenho e colaboração.",
    },
  });
  console.log("✅ Referência criada");

  // Após a criação dos usuários e critérios, criar autoavaliações, mentorias e avaliações 360 para o ciclo finalizado
  // Todos os usuários devem ter autoavaliação
  for (let i = 0; i < users.length; i++) {
    await prisma.autoavaliacao.create({
      data: {
        idUser: users[i].id,
        idCiclo: cicloFinalizado.id,
        nota: 4 + (i % 2) * 0.5, // alterna entre 4.0 e 4.5
        justificativa: `Autoavaliação do usuário ${users[i].name} no ciclo finalizado`,
        criterioId: criterios[i % criterios.length].id,
        notaGestor: 4.5 + (i % 2) * 0.2, // alterna entre 4.5 e 4.7
        justificativaGestor: `Avaliação do gestor para ${users[i].name} no ciclo finalizado`,
      },
    });
  }
  // // Mentorias: cada usuário recebe mentoria do próximo (circular)
  // for (let i = 0; i < users.length; i++) {
  //   await prisma.mentoring.create({
  //     data: {
  //       idMentor: users[(i + 1) % users.length].id,
  //       idMentorado: users[i].id,
  //       idCiclo: cicloFinalizado.id,
  //       nota: 4.0 + (i % 3) * 0.3, // 4.0, 4.3, 4.6
  //       justificativa: `Mentoria de ${
  //         users[(i + 1) % users.length].name
  //       } para ${users[i].name} no ciclo finalizado`,
  //     },
  //   });
  // }
  // Avaliações 360: cada usuário avalia o anterior (circular)
  for (let i = 0; i < users.length; i++) {
    await prisma.avaliacao360.create({
      data: {
        idAvaliador: users[(i + users.length - 1) % users.length].id,
        idAvaliado: users[i].id,
        idCiclo: cicloFinalizado.id,
        nota: 4.2 + (i % 2) * 0.4, // 4.2, 4.6
        pontosFortes: `Pontos fortes de ${users[i].name} no ciclo finalizado`,
        pontosMelhora: `Pontos de melhoria de ${users[i].name} no ciclo finalizado`,
        nomeProjeto: `Projeto do ciclo finalizado para ${users[i].name}`,
        periodoMeses: 6,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
    });
  }

  // 9. Mentoring
  await prisma.mentoring.create({
    data: {
      idMentor: users[6].id,
      idMentorado: users[2].id,
      idCiclo: ciclo.id,
      nota: 4.6,
      justificativa: "Mentoria produtiva e com bons resultados.",
    },
  });
  console.log("✅ Mentoring criado");

  // 10. Equalização
  await prisma.equalizacao.create({
    data: {
      idAvaliador: users[1].id, // Alice Cadete
      idAvaliado: users[2].id, // Arthur Lins
      mediaAutoavaliacao: 4.5,
      mediaAvaliacaoGestor: 4.7,
      mediaAvaliacao360: 4.8,
      notaFinal: 4.7,
      justificativa: "Desempenho consistente em todas as avaliações.",
      status: StatusEqualizacao.FINALIZADO,
    },
  });
  console.log("✅ Equalização criada");

  // 11. Resumo IA
  await prisma.resumoIA.create({
    data: {
      userId: users[2].id,
      idCiclo: ciclo.id,
      resumo: "Usuário apresentou ótimo desempenho geral.",
    },
  });
  console.log("✅ Resumo IA criado");

  // Resumo final
  const summary = {
    trilhas: await prisma.trilha.count(),
    ciclos: await prisma.ciclo.count(),
    users: await prisma.user.count(),
    criterios: await prisma.criterio.count(),
    referencias: await prisma.referencia.count(),
    autoavaliacoes: await prisma.autoavaliacao.count(),
    avaliacoes360: await prisma.avaliacao360.count(),
    mentorings: await prisma.mentoring.count(),
    equalizacoes: await prisma.equalizacao.count(),
    resumosIA: await prisma.resumoIA.count(),
  };
  console.log("\n📊 Resumo do banco:");
  console.log(summary);
  console.log("\n🎉 Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
