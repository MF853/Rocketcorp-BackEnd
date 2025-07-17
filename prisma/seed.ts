import {
  PrismaClient,
  MotivacaoTrabalhoNovamente,
  StatusEqualizacao,
  User,
  Trilha,
  Criterio,
} from "@prisma/client";
import * as argon from "argon2";
import { execSync } from "child_process";

// Inicializa o cliente do Prisma
const prisma = new PrismaClient();

/**
 * Gera o hash de uma senha usando argon2.
 * @param password A senha em texto plano.
 * @returns A senha com hash.
 */
async function hashPassword(password: string): Promise<string> {
  return await argon.hash(password);
}

/**
 * Executa as migrações do Prisma para garantir que o banco de dados esteja atualizado.
 */
function runMigrations() {
  console.log("🔄 Executando as migrações do Prisma...");
  try {
    // Usamos 'deploy' para aplicar migrações pendentes em ambientes de produção/staging
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("✅ Migrações concluídas com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao executar as migrações:", error);
    // Propaga o erro para interromper o script se as migrações falharem
    throw error;
  }
}

/**
 * Função principal para popular o banco de dados.
 */
async function main() {
  console.log("🌱 Iniciando o processo de seeding do banco de dados...");

  // 1. Garante que o schema do banco de dados está atualizado
  runMigrations();

  // 2. Limpa os dados existentes na ordem correta para evitar conflitos de chave estrangeira
  console.log("🧹 Limpando dados existentes...");
  await prisma.equalizacao.deleteMany();
  await prisma.mentoring.deleteMany();
  await prisma.resumoIA.deleteMany();
  await prisma.avaliacao360.deleteMany();
  await prisma.autoavaliacao.deleteMany();
  await prisma.referencia.deleteMany();
  await prisma.criterio.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ciclo.deleteMany();
  await prisma.trilha.deleteMany();
  console.log("✅ Dados existentes foram limpos.");

  // 3. Cria as Trilhas de desenvolvimento
  console.log("🛤️ Criando trilhas...");
  const [devTrilha, dadosTrilha, infraTrilha, gestaoTrilha] = await Promise.all(
    [
      prisma.trilha.create({ data: { name: "Desenvolvimento" } }),
      prisma.trilha.create({ data: { name: "Análise de Dados" } }),
      prisma.trilha.create({ data: { name: "Infraestrutura" } }),
      prisma.trilha.create({ data: { name: "Gestão" } }),
    ]
  );
  const trilhas: Trilha[] = [devTrilha, dadosTrilha, infraTrilha, gestaoTrilha];
  console.log(`✅ Criadas ${trilhas.length} trilhas.`);

  // 4. Cria os Ciclos de avaliação com datas coerentes com a data de hoje (15/07/2025)
  console.log("🔄 Criando ciclos...");

  // Ciclo Revisão Comitê (hoje está entre dataAberturaRevisaoComite e dataFechamentoRevisaoComite)
  const cicloRevisaoComite = await prisma.ciclo.create({
    data: {
      name: "2024.2",
      year: 2024,
      period: 2,
      status: "revisao_comite",
      dataAberturaAvaliacao: new Date("2025-06-01T00:00:00-03:00"),
      dataFechamentoAvaliacao: new Date("2025-06-10T23:59:59-03:00"),
      dataAberturaRevisaoGestor: new Date("2025-06-11T00:00:00-03:00"),
      dataFechamentoRevisaoGestor: new Date("2025-06-20T23:59:59-03:00"),
      dataAberturaRevisaoComite: new Date("2025-07-10T00:00:00-03:00"),
      dataFechamentoRevisaoComite: new Date("2025-07-15T23:59:59-03:00"),
      dataFinalizacao: new Date("2025-07-16T23:59:59-03:00"),
    },
  });

  // Ciclo Finalizado (hoje é após dataFinalizacao)
  const cicloFinalizado = await prisma.ciclo.create({
    data: {
      name: "2024.1",
      year: 2024,
      period: 1,
      status: "finalizado",
      dataAberturaAvaliacao: new Date("2025-05-01T00:00:00-03:00"),
      dataFechamentoAvaliacao: new Date("2025-05-10T23:59:59-03:00"),
      dataAberturaRevisaoGestor: new Date("2025-05-11T00:00:00-03:00"),
      dataFechamentoRevisaoGestor: new Date("2025-05-20T23:59:59-03:00"),
      dataAberturaRevisaoComite: new Date("2025-05-21T00:00:00-03:00"),
      dataFechamentoRevisaoComite: new Date("2025-05-25T23:59:59-03:00"),
      dataFinalizacao: new Date("2025-06-01T23:59:59-03:00"),
    },
  });

  // 5. Cria os Usuários
  console.log("👥 Criando usuários...");

  const users: User[] = await Promise.all([
    // Usuário admin (Raylandson Cesário)
    prisma.user.create({
      data: {
        name: "Raylandson Cesário",
        email: "raylandson.cesario@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["colaborador", "admin"],
        unidade: "sao paulo",
        cargo: "fullstack",
        trilhaId: devTrilha.id,
      },
    }),
    // Usuário gestor (Alice Cadete)
    prisma.user.create({
      data: {
        name: "Alice Cadete",
        email: "alice.cadete@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["gestor"],
        unidade: "recife",
        cargo: "Gestão",
        trilhaId: devTrilha.id,
      },
    }),
    // Usuários colaboradores (Arthur Lins)
    prisma.user.create({
      data: {
        name: "Arthur Lins",
        email: "arthur.lins@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["colaborador"],
        cargo: "front",
        unidade: "recife",
        trilhaId: dadosTrilha.id,
      },
    }),
    // Usuários colaboradores (Erico Chen)
    prisma.user.create({
      data: {
        name: "Erico Chen",
        email: "erico.chen@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["colaborador"],
        cargo: "Back",
        unidade: "recife",
        trilhaId: infraTrilha.id,
      },
    }),
    // Usuários colaboradores (Luan Bezerra)
    prisma.user.create({
      data: {
        name: "Luan Bezerra",
        email: "luan.bezerra@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["colaborador"],
        cargo: "Dados",
        unidade: "rio de janeiro",
        trilhaId: devTrilha.id,
      },
    }),
    // Usuário comitê (Fernanda Lima)
    prisma.user.create({
      data: {
        name: "Fernanda Lima",
        email: "fernanda.lima@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["rh", "comite"],
        cargo: "Gestão",
        unidade: "sao paulo",
        trilhaId: gestaoTrilha.id,
      },
    }),
    // Usuário mentor (Bruno Souza)
    prisma.user.create({
      data: {
        name: "Bruno Souza",
        email: "bruno.souza@rocketcorp.com",
        password: await hashPassword("password123"),
        role: ["mentor"],
        cargo: "Mentor",
        unidade: "recife",
        trilhaId: devTrilha.id,
      },
    }),
  ]);

  console.log(`✅ Criados ${users.length} usuários.`);

  // Mapeamento de usuários para facilitar o acesso
  const adminUser = users[0]; // Raylandson Cesário
  const managerUser = users[1]; // Alice Cadete
  const arthurUser = users[2]; // Arthur Lins
  const ericoUser = users[3]; // Erico Chen
  const luanUser = users[4]; // Luan Bezerra
  const comiteUser = users[5]; // Fernanda Lima
  const mentorUser = users[6]; // Bruno Souza

  const nonMentorUsers = users.filter((user) => user.id !== mentorUser.id); // Todos menos o mentor

  // 6. Define as relações de mentoria
  console.log("🤝 Configurando relações de mentoria...");
  // Bruno deve ser mentor de todos os outros usuários (não-mentores)
  for (const user of nonMentorUsers) {
    await prisma.user.update({
      where: { id: user.id },
      data: { mentorId: mentorUser.id },
    });
  }
  // Alice é gestora de Erico, Luan, Arthur e Raylandson
  await prisma.user.update({
    where: { id: ericoUser.id },
    data: { gestorId: managerUser.id },
  });
  await prisma.user.update({
    where: { id: luanUser.id },
    data: { gestorId: managerUser.id },
  });
  await prisma.user.update({
    where: { id: arthurUser.id },
    data: { gestorId: managerUser.id },
  });
  await prisma.user.update({
    where: { id: adminUser.id },
    data: { gestorId: managerUser.id },
  });
  console.log("✅ Relações de mentoria estabelecidas.");

  // 7. Cria os Critérios de avaliação (associados ao ciclo aberto para simplificação, podem ser reutilizados)
  console.log("📋 Criando critérios...");
  const baseCriterios = [
    {
      name: "Organização",
      tipo: "comportamental",
      peso: 5.0,
      description: "Ser organizado e contribuir para a organização do grupo.",
    },
    {
      name: "Imagem",
      tipo: "comportamental",
      peso: 5.0,
      description: "Passar uma imagem pessoal positiva e profissional.",
    },
    {
      name: "Iniciativa",
      tipo: "comportamental",
      peso: 5.0,
      description: "Ser proativo, buscar assumir responsabilidades.",
    },
    {
      name: "Comprometimento",
      tipo: "comportamental",
      peso: 5.0,
      description: "Se dedicar para atingimento dos resultados desejados.",
    },
    {
      name: "Relacionamento Interpessoal",
      tipo: "comportamental",
      peso: 5.0,
      description: "Relacionar-se positivamente com a equipe.",
    },
    {
      name: "Aprendizagem Contínua",
      tipo: "comportamental",
      peso: 5.0,
      description: "Buscar sempre aprender e dividir o conhecimento.",
    },
    {
      name: "Flexibilidade",
      tipo: "comportamental",
      peso: 5.0,
      description: "Capacidade de se adaptar a situações diversas.",
    },
    {
      name: "Trabalho em Equipe",
      tipo: "comportamental",
      peso: 5.0,
      description: "Pensar sempre no ótimo global para o grupo.",
    },
    {
      name: "Produtividade",
      tipo: "tecnico",
      peso: 5.0,
      description: "Otimizar a execução das atividades.",
    },
    {
      name: "Qualidade",
      tipo: "tecnico",
      peso: 5.0,
      description:
        "Entregar resultados que atendam ou superem as expectativas.",
    },
    {
      name: "Foco no Cliente",
      tipo: "comportamental",
      peso: 5.0,
      description: "Entender a real necessidade do cliente.",
    },
    {
      name: "Criatividade e Inovação",
      tipo: "comportamental",
      peso: 5.0,
      description: "Gerar soluções inovadoras.",
    },
    {
      name: "Gestão de Pessoas",
      tipo: "gestao",
      peso: 5.0,
      description: "Gerenciar grupos, capacitando e motivando.",
    },
    {
      name: "Gestão de Projetos",
      tipo: "gestao",
      peso: 5.0,
      description:
        "Gerenciar projetos, alocando recursos e controlando a execução.",
    },
    {
      name: "Gestão Organizacional",
      tipo: "gestao",
      peso: 5.0,
      description:
        "Contribuir para a eficiência e eficácia da gestão da empresa.",
    },
    {
      name: "Novos Clientes",
      tipo: "negocios",
      peso: 5.0,
      description: "Gerar novos contatos e alavancar novos clientes.",
    },
    {
      name: "Novos Projetos",
      tipo: "negocios",
      peso: 5.0,
      description: "Gerar novos projetos em clientes já existentes.",
    },
    {
      name: "Novos Produtos ou Serviços",
      tipo: "negocios",
      peso: 5.0,
      description:
        "Gerar novos produtos e/ou serviços com potencial de mercado.",
    },
  ];

  const allCriterios: Criterio[] = [];
  for (const trilha of trilhas) {
    for (const criterio of baseCriterios) {
      const createdCriterio = await prisma.criterio.create({
        data: {
          ...criterio,
          trilhaId: trilha.id,
          idCiclo: cicloRevisaoComite.id, // Associando ao ciclo principal para reuso nos exemplos
        },
      });
      allCriterios.push(createdCriterio);
    }
  }
  console.log(
    `✅ Criados ${allCriterios.length} critérios para ${trilhas.length} trilhas.`
  );

  // Filtra os critérios de acordo com as trilhas para uso nas avaliações
  const devCriterios = allCriterios.filter((c) => c.trilhaId === devTrilha.id);
  const dadosCriterios = allCriterios.filter(
    (c) => c.trilhaId === dadosTrilha.id
  );
  const infraCriterios = allCriterios.filter(
    (c) => c.trilhaId === infraTrilha.id
  );
  const gestaoCriterios = allCriterios.filter(
    (c) => c.trilhaId === gestaoTrilha.id
  );

  // --- DADOS PARA CADA ESTÁGIO DE CICLO ---

  // ESTÁGIO 1: CICLO REVISÃO COMITÊ (2024.2) - Comitê faz equalizações
  console.log("\n--- Populando dados para o Ciclo Revisão Comitê (2024.2) ---");

  // 8. Cria as Referências (Opcional)
  console.log("📝 Criando referências para ciclo revisão comitê...");
  await prisma.referencia.createMany({
    data: [
      {
        idReferenciador: managerUser.id,
        idReferenciado: luanUser.id,
        idCiclo: cicloRevisaoComite.id,
        justificativa:
          "Luan manteve seu excelente desempenho no ciclo de revisão comitê.",
      },
    ],
  });
  console.log("✅ Referências criadas para ciclo revisão comitê.");

  // 9. Cria as Autoavaliações (Obrigatório para não-mentores)
  console.log("📊 Criando autoavaliações para ciclo revisão comitê...");
  for (const user of nonMentorUsers) {
    let criterioParaAvaliar: Criterio | undefined;
    if (user.trilhaId === devTrilha.id) {
      criterioParaAvaliar = devCriterios.find((c) => c.name === "Qualidade");
    } else if (user.trilhaId === dadosTrilha.id) {
      criterioParaAvaliar = dadosCriterios.find(
        (c) => c.name === "Produtividade"
      );
    } else if (user.trilhaId === infraTrilha.id) {
      criterioParaAvaliar = infraCriterios.find(
        (c) => c.name === "Produtividade"
      );
    } else if (user.trilhaId === gestaoTrilha.id) {
      criterioParaAvaliar = gestaoCriterios.find(
        (c) => c.name === "Gestão de Pessoas"
      );
    }

    if (criterioParaAvaliar) {
      await prisma.autoavaliacao.create({
        data: {
          idUser: user.id,
          idCiclo: cicloRevisaoComite.id,
          criterioId: criterioParaAvaliar.id,
          nota: 4.0,
          justificativa: `Autoavaliação de ${user.name} para o ciclo de revisão comitê.`,
          notaGestor: null, // Ainda não avaliado pelo gestor neste ciclo
          justificativaGestor: null,
        },
      });
    }
  }
  console.log("✅ Autoavaliações criadas para ciclo revisão comitê.");

  // 10. Cria as Avaliações 360 (Obrigatório para não-mentores)
  console.log("🔄 Criando avaliações 360 para ciclo revisão comitê...");
  await prisma.avaliacao360.createMany({
    data: [
      {
        idAvaliador: luanUser.id,
        idAvaliado: managerUser.id,
        idCiclo: cicloRevisaoComite.id,
        nota: 4.7,
        pontosFortes: "Liderança exemplar.",
        pontosMelhora: "Nenhum.",
        nomeProjeto: "Projeto Z",
        periodoMeses: 6,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
      {
        idAvaliador: managerUser.id,
        idAvaliado: luanUser.id,
        idCiclo: cicloRevisaoComite.id,
        nota: 4.3,
        pontosFortes: "Crescimento notável.",
        pontosMelhora: "Melhorar proatividade.",
        nomeProjeto: "Sistema de Avaliação",
        periodoMeses: 6,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
    ],
  });
  console.log("✅ Avaliações 360 criadas para ciclo revisão comitê.");

  // Mentoring para ciclo revisão comitê (assumindo que já foi feito nos estágios anteriores)
  console.log("👨‍🏫 Criando registros de mentoring para ciclo revisão comitê...");
  for (const user of nonMentorUsers) {
    await prisma.mentoring.create({
      data: {
        idMentorado: user.id,
        idMentor: mentorUser.id,
        idCiclo: cicloRevisaoComite.id,
        nota: 4.2,
        justificativa: `Sessão de mentoria final para ${user.name} no ciclo de revisão comitê.`,
      },
    });
  }
  console.log("✅ Registros de mentoring criados para ciclo revisão comitê.");

  // 13. Cria Equalizações (Obrigatório para não-mentores, feito pelo comitê)
  console.log("⚖️ Gerando equalizações para ciclo revisão comitê...");
  for (const user of nonMentorUsers) {
    await prisma.equalizacao.create({
      data: {
        idAvaliador: comiteUser.id, // O comitê é o avaliador da equalização
        idAvaliado: user.id,
        mediaAutoavaliacao: 4.0, // Exemplo de média
        mediaAvaliacaoGestor: 4.5, // Exemplo de média
        mediaAvaliacao360: 4.3, // Exemplo de média
        notaFinal: 4.0, // Exemplo de nota final equalizada
        justificativa: `Equalização do comitê para ${user.name}: Desempenho alinhado com as expectativas.`,
        status: StatusEqualizacao.FINALIZADO, // Definindo o status
        idCiclo: cicloRevisaoComite.id, // Adicionado o idCiclo
      },
    });
  }
  console.log("✅ Equalizações criadas para ciclo revisão comitê.");

  console.log("🤖 Gerando resumos de IA para ciclo revisão comitê...");
  await prisma.resumoIA.createMany({
    data: [
      {
        userId: luanUser.id,
        idCiclo: cicloRevisaoComite.id,
        resumo:
          "Luan Bezerra teve seu desempenho validado pelo comitê, com excelente potencial de carreira.",
      },
      {
        userId: arthurUser.id,
        idCiclo: cicloRevisaoComite.id,
        resumo:
          "Arthur Lins foi equalizado com um forte reconhecimento de suas habilidades técnicas.",
      },
    ],
  });
  console.log("✅ Resumos de IA gerados para ciclo revisão comitê.");

  // ESTÁGIO 4: CICLO FINALIZADO (2024.1) - Todos os estágios anteriores finalizados
  console.log("\n--- Populando dados para o Ciclo Finalizado (2024.1) ---");

  // Replicar dados de todos os estágios anteriores para o Ciclo Finalizado
  console.log("📝 Criando referências para ciclo finalizado...");
  await prisma.referencia.createMany({
    data: [
      {
        idReferenciador: managerUser.id,
        idReferenciado: luanUser.id,
        idCiclo: cicloFinalizado.id,
        justificativa:
          "Luan teve um desempenho excepcional no ciclo finalizado.",
      },
    ],
  });
  console.log("✅ Referências criadas para ciclo finalizado.");

  console.log("📊 Criando autoavaliações para ciclo finalizado...");
  for (const user of nonMentorUsers) {
    let criterioParaAvaliar: Criterio | undefined;
    if (user.trilhaId === devTrilha.id) {
      criterioParaAvaliar = devCriterios.find((c) => c.name === "Qualidade");
    } else if (user.trilhaId === dadosTrilha.id) {
      criterioParaAvaliar = dadosCriterios.find(
        (c) => c.name === "Produtividade"
      );
    } else if (user.trilhaId === infraTrilha.id) {
      criterioParaAvaliar = infraCriterios.find(
        (c) => c.name === "Produtividade"
      );
    } else if (user.trilhaId === gestaoTrilha.id) {
      criterioParaAvaliar = gestaoCriterios.find(
        (c) => c.name === "Gestão de Pessoas"
      );
    }

    if (criterioParaAvaliar) {
      await prisma.autoavaliacao.create({
        data: {
          idUser: user.id,
          idCiclo: cicloFinalizado.id,
          criterioId: criterioParaAvaliar.id,
          nota: 4.0,
          justificativa: `Autoavaliação de ${user.name} para o ciclo finalizado.`,
          notaGestor: 4.5,
          justificativaGestor: "Avaliação do gestor finalizada neste ciclo.",
        },
      });
    }
  }
  console.log("✅ Autoavaliações criadas para ciclo finalizado.");

  console.log("🔄 Criando avaliações 360 para ciclo finalizado...");
  await prisma.avaliacao360.createMany({
    data: [
      {
        idAvaliador: luanUser.id,
        idAvaliado: managerUser.id,
        idCiclo: cicloFinalizado.id,
        nota: 4.9,
        pontosFortes: "Liderança e impacto excepcionais.",
        pontosMelhora: "Nenhum.",
        nomeProjeto: "Projeto W",
        periodoMeses: 6,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
      {
        idAvaliador: managerUser.id,
        idAvaliado: luanUser.id,
        idCiclo: cicloFinalizado.id,
        nota: 4.5,
        pontosFortes: "Desempenho consolidado e proativo.",
        pontosMelhora: "Nenhum.",
        nomeProjeto: "Sistema de Avaliação",
        periodoMeses: 6,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
    ],
  });
  console.log("✅ Avaliações 360 criadas para ciclo finalizado.");

  // Mentoring para ciclo finalizado (assumindo que já foi feito nos estágios anteriores)
  console.log("👨‍🏫 Criando registros de mentoring para ciclo finalizado...");
  for (const user of nonMentorUsers) {
    await prisma.mentoring.create({
      data: {
        idMentorado: user.id,
        idMentor: mentorUser.id,
        idCiclo: cicloFinalizado.id,
        nota: 4.7,
        justificativa: `Sessão de mentoria de encerramento para ${user.name} no ciclo finalizado.`,
      },
    });
  }
  console.log("✅ Registros de mentoring criados para ciclo finalizado.");

  console.log("⚖️ Gerando equalizações para ciclo finalizado...");
  for (const user of nonMentorUsers) {
    await prisma.equalizacao.create({
      data: {
        idAvaliador: comiteUser.id, // O comitê é o avaliador da equalização
        idAvaliado: user.id,
        mediaAutoavaliacao: 4.2, // Exemplo de média
        mediaAvaliacaoGestor: 4.6, // Exemplo de média
        mediaAvaliacao360: 4.4, // Exemplo de média
        notaFinal: 4.7, // Exemplo de nota final equalizada
        justificativa: `Equalização finalizada para ${user.name}: Desempenho excelente e consistente.`,
        status: StatusEqualizacao.FINALIZADO, // Definindo o status
        idCiclo: cicloFinalizado.id, // Adicionado o idCiclo
      },
    });
  }
  console.log("✅ Equalizações criadas para ciclo finalizado.");

  console.log("🤖 Gerando resumos de IA para ciclo finalizado...");
  await prisma.resumoIA.createMany({
    data: [
      {
        userId: luanUser.id,
        idCiclo: cicloFinalizado.id,
        resumo:
          "Luan Bezerra concluiu o ciclo com um desempenho excepcional, superando todas as expectativas.",
      },
      {
        userId: arthurUser.id,
        idCiclo: cicloFinalizado.id,
        resumo:
          "Arthur Lins teve um ciclo de sucesso, com todas as avaliações e equalizações finalizadas positivamente.",
      },
    ],
  });
  console.log("✅ Resumos de IA gerados para ciclo finalizado.");

  // --- Resumo Final ---
  console.log("\n🎉 Seeding concluído com sucesso!");
  const summary = {
    trilhas: await prisma.trilha.count(),
    ciclos: await prisma.ciclo.count(),
    users: await prisma.user.count(),
    criterios: await prisma.criterio.count(),
    referencias: await prisma.referencia.count(),
    autoavaliacoes: await prisma.autoavaliacao.count(),
    avaliacoes360: await prisma.avaliacao360.count(),
    resumosIA: await prisma.resumoIA.count(),
  };

  console.log("\n📊 Resumo do Banco de Dados:");
  console.table(summary);
}
// Executa a função principal e trata possíveis erros
main()
  .catch((e) => {
    console.error("❌ Erro durante o processo de seeding:", e);
    process.exit(1);
  })
  .finally(() => {
    // Garante que a conexão com o banco de dados seja fechada
    prisma
      .$disconnect()
      .then(() => {})
      .catch((e) => {
        console.error("Erro ao desconectar do banco de dados:", e);
      });
  });
