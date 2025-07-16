import {
  PrismaClient,
  MotivacaoTrabalhoNovamente,
  StatusEqualizacao,
  User,
  Trilha,
  Ciclo,
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

  // Ciclo Aberto (hoje está entre dataAberturaAvaliacao e dataFechamentoAvaliacao)
  const cicloAberto = await prisma.ciclo.create({
    data: {
      name: "2025.2",
      year: 2025,
      period: 2,
      status: "aberto",
      dataAberturaAvaliacao: new Date("2025-07-10T00:00:00-03:00"),
      dataFechamentoAvaliacao: new Date("2025-07-20T23:59:59-03:00"),
      dataAberturaRevisaoGestor: new Date("2025-07-21T00:00:00-03:00"),
      dataFechamentoRevisaoGestor: new Date("2025-07-25T23:59:59-03:00"),
      dataAberturaRevisaoComite: new Date("2025-07-26T00:00:00-03:00"),
      dataFechamentoRevisaoComite: new Date("2025-07-30T23:59:59-03:00"),
      dataFinalizacao: new Date("2025-07-31T23:59:59-03:00"),
    },
  });

  // Ciclo Revisão Gestor (hoje está entre dataAberturaRevisaoGestor e dataFechamentoRevisaoGestor)
  const cicloRevisaoGestor = await prisma.ciclo.create({
    data: {
      name: "2025.1",
      year: 2025,
      period: 1,
      status: "revisao_gestor",
      dataAberturaAvaliacao: new Date("2025-06-10T00:00:00-03:00"),
      dataFechamentoAvaliacao: new Date("2025-06-20T23:59:59-03:00"),
      dataAberturaRevisaoGestor: new Date("2025-07-01T00:00:00-03:00"),
      dataFechamentoRevisaoGestor: new Date("2025-07-16T23:59:59-03:00"),
      dataAberturaRevisaoComite: new Date("2025-07-17T00:00:00-03:00"),
      dataFechamentoRevisaoComite: new Date("2025-07-20T23:59:59-03:00"),
      dataFinalizacao: new Date("2025-07-21T23:59:59-03:00"),
    },
  });

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
        role: ["user", "admin"],
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
        role: ["manager"],
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
        role: ["user"],
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
        role: ["user"],
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
        role: ["user"],
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
        role: ["comite"],
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

  const nonMentorUsers = users.filter((user) => !user.role.includes("mentor")); // Todos menos o mentor

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
          idCiclo: cicloAberto.id, // Associando ao ciclo principal para reuso nos exemplos
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

  // ESTÁGIO 1: CICLO ABERTO (2025.2) - Avaliações (Autoavaliação, 360, Mentoring, Referências Opcionais)
  console.log("\n--- Populando dados para o Ciclo Aberto (2025.2) ---");

  // 8. Cria as Referências (Opcional)
  console.log("📝 Criando referências para ciclo aberto...");
  await prisma.referencia.createMany({
    data: [
      {
        idReferenciador: managerUser.id,
        idReferenciado: luanUser.id,
        idCiclo: cicloAberto.id,
        justificativa:
          "Luan demonstrou excelente crescimento técnico e é muito colaborativo.",
      },
      {
        idReferenciador: adminUser.id,
        idReferenciado: arthurUser.id,
        idCiclo: cicloAberto.id,
        justificativa:
          "Arthur é um desenvolvedor front-end muito dedicado e proativo.",
      },
      {
        idReferenciador: comiteUser.id,
        idReferenciado: managerUser.id,
        idCiclo: cicloAberto.id,
        justificativa:
          "Alice tem uma excelente capacidade de gestão e liderança.",
      },
    ],
  });
  console.log("✅ Referências criadas para ciclo aberto.");

  // 9. Cria as Autoavaliações (Obrigatório para não-mentores)
  console.log("📊 Criando autoavaliações para ciclo aberto...");
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
          idCiclo: cicloAberto.id,
          criterioId: criterioParaAvaliar.id,
          nota: 4.0,
          justificativa: `Autoavaliação de ${user.name} para o critério ${criterioParaAvaliar.name}.`,
          notaGestor: null, // Ainda não avaliado pelo gestor
          justificativaGestor: null,
        },
      });
    } else {
      console.warn(
        `⚠️ Critério não encontrado para a trilha do usuário ${user.name}.`
      );
    }
  }
  console.log("✅ Autoavaliações criadas para ciclo aberto.");

  // 10. Cria as Avaliações 360 (Obrigatório para não-mentores)
  console.log("🔄 Criando avaliações 360 para ciclo aberto...");
  await prisma.avaliacao360.createMany({
    data: [
      // Luan avalia Alice (gestor)
      {
        idAvaliador: luanUser.id,
        idAvaliado: managerUser.id,
        idCiclo: cicloAberto.id,
        nota: 4.8,
        pontosFortes: "Excelente liderança e suporte.",
        pontosMelhora: "Nenhum ponto de melhoria significativo.",
        nomeProjeto: "Projeto X",
        periodoMeses: 6,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },

      // Arthur avalia Erico
      {
        idAvaliador: arthurUser.id,
        idAvaliado: ericoUser.id,
        idCiclo: cicloAberto.id,
        nota: 4.0,
        pontosFortes: "Conhecimento técnico sólido em infra.",
        pontosMelhora: "Melhorar comunicação em equipe.",
        nomeProjeto: "Infraestrutura Cloud",
        periodoMeses: 5,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
      // Erico avalia Arthur
      {
        idAvaliador: ericoUser.id,
        idAvaliado: arthurUser.id,
        idCiclo: cicloAberto.id,
        nota: 4.3,
        pontosFortes: "Ótimo em front-end, muito criativo.",
        pontosMelhora: "Organização de tarefas.",
        nomeProjeto: "Portal Web",
        periodoMeses: 5,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
      {
        idAvaliador: ericoUser.id,
        idAvaliado: comiteUser.id,
        idCiclo: cicloAberto.id,
        nota: 4.3,
        pontosFortes: "Ótimo em front-end, muito criativo.",
        pontosMelhora: "Organização de tarefas.",
        nomeProjeto: "Portal Web",
        periodoMeses: 5,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
      // Raylandson (admin) avalia Fernanda (comitê)
      {
        idAvaliador: adminUser.id,
        idAvaliado: comiteUser.id,
        idCiclo: cicloAberto.id,
        nota: 4.9,
        pontosFortes: "Visão estratégica e tomada de decisão excelentes.",
        pontosMelhora: "Nenhum.",
        nomeProjeto: "Planejamento Estratégico",
        periodoMeses: 12,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
    ],
  });
  console.log("✅ Avaliações 360 criadas para ciclo aberto.");

  // 11. Cria Mentoring (Obrigatório para não-mentores no estágio 1)
  console.log("👨‍🏫 Criando registros de mentoring para ciclo aberto...");
  for (const user of nonMentorUsers) {
    await prisma.mentoring.create({
      data: {
        idMentorado: user.id,
        idMentor: mentorUser.id,
        idCiclo: cicloAberto.id,
        nota: 4.5,
        justificativa: `Sessão de mentoria inicial para ${user.name} sobre objetivos de carreira e desenvolvimento. Bruno forneceu feedback construtivo.`,
      },
    });
  }
  console.log("✅ Registros de mentoring criados para ciclo aberto.");

  // 12. Cria Resumos de IA (para ciclo aberto)
  console.log("🤖 Gerando resumos de IA para ciclo aberto...");
  await prisma.resumoIA.createMany({
    data: [
      {
        userId: luanUser.id,
        idCiclo: cicloAberto.id,
        resumo:
          "Luan Bezerra é um desenvolvedor em ascensão com fortes habilidades em colaboração e qualidade de código.",
      },
      {
        userId: arthurUser.id,
        idCiclo: cicloAberto.id,
        resumo:
          "Arthur Lins demonstra grande criatividade e habilidade no desenvolvimento front-end.",
      },
      {
        userId: ericoUser.id,
        idCiclo: cicloAberto.id,
        resumo:
          "Erico Chen é um especialista em infraestrutura com grande potencial de crescimento.",
      },
    ],
  });
  console.log("✅ Resumos de IA gerados para ciclo aberto.");

  // ESTÁGIO 2: CICLO REVISÃO GESTOR (2025.1) - Gestores avaliam subordinados
  console.log("\n--- Populando dados para o Ciclo Revisão Gestor (2025.1) ---");

  // Replicar dados do Estágio 1 para o Ciclo Revisão Gestor (assumindo que já passaram pelo Estágio 1)
  console.log("📝 Criando referências para ciclo revisão gestor...");
  await prisma.referencia.createMany({
    data: [
      {
        idReferenciador: managerUser.id,
        idReferenciado: luanUser.id,
        idCiclo: cicloRevisaoGestor.id,
        justificativa:
          "Luan demonstrou excelente crescimento técnico e é muito colaborativo no ciclo anterior.",
      },
      {
        idReferenciador: adminUser.id,
        idReferenciado: arthurUser.id,
        idCiclo: cicloRevisaoGestor.id,
        justificativa:
          "Arthur foi um desenvolvedor front-end muito dedicado e proativo no ciclo anterior.",
      },
    ],
  });
  console.log("✅ Referências criadas para ciclo revisão gestor.");

  console.log("📊 Criando autoavaliações para ciclo revisão gestor...");
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
          idCiclo: cicloRevisaoGestor.id,
          criterioId: criterioParaAvaliar.id,
          nota: 4.0,
          justificativa: `Autoavaliação de ${user.name} para o ciclo de revisão gestor.`,
          notaGestor: null, // Ainda não avaliado pelo gestor neste ciclo
          justificativaGestor: null,
        },
      });
    }
  }
  console.log("✅ Autoavaliações criadas para ciclo revisão gestor.");

  console.log("🔄 Criando avaliações 360 para ciclo revisão gestor...");
  await prisma.avaliacao360.createMany({
    data: [
      // Luan avalia Alice (gestor)
      {
        idAvaliador: luanUser.id,
        idAvaliado: managerUser.id,
        idCiclo: cicloRevisaoGestor.id,
        nota: 4.7,
        pontosFortes: "Liderança exemplar.",
        pontosMelhora: "Nenhum.",
        nomeProjeto: "Projeto Y",
        periodoMeses: 6,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
      // Arthur avalia Erico
      {
        idAvaliador: arthurUser.id,
        idAvaliado: ericoUser.id,
        idCiclo: cicloRevisaoGestor.id,
        nota: 4.1,
        pontosFortes: "Sólido conhecimento técnico.",
        pontosMelhora: "Comunicação.",
        nomeProjeto: "Infraestrutura Cloud",
        periodoMeses: 5,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
    ],
  });
  console.log("✅ Avaliações 360 criadas para ciclo revisão gestor.");

  // Avaliações do Gestor para seus subordinados (Obrigatório)
  console.log("👨‍💼 Gerando avaliações de gestor para ciclo revisão gestor...");
  // Assumindo que Alice (managerUser) é gestora de Arthur, Erico e Luan
  const gestaoCriterio = gestaoCriterios.find(
    (c) => c.name === "Gestão de Pessoas"
  );
  if (gestaoCriterio) {
    await prisma.autoavaliacao.updateMany({
      // Atualiza as autoavaliações com a nota do gestor
      where: {
        idCiclo: cicloRevisaoGestor.id,
        idUser: { in: [arthurUser.id, ericoUser.id, luanUser.id] },
      },
      data: {
        notaGestor: 4.5,
        justificativaGestor: "Avaliação do gestor para o ciclo de revisão.",
      },
    });

    // Criação de avaliações 360 adicionais onde o gestor avalia
    await prisma.avaliacao360.createMany({
      data: [
        {
          idAvaliador: managerUser.id,
          idAvaliado: arthurUser.id,
          idCiclo: cicloRevisaoGestor.id,
          nota: 4.5,
          pontosFortes:
            "Arthur é muito criativo e entrega interfaces de alta qualidade.",
          pontosMelhora: "Poderia melhorar a documentação de componentes.",
          nomeProjeto: "Portal do Cliente",
          periodoMeses: 4,
          trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
        },
        {
          idAvaliador: managerUser.id,
          idAvaliado: ericoUser.id,
          idCiclo: cicloRevisaoGestor.id,
          nota: 4.4,
          pontosFortes:
            "Erico tem mostrado excelente trabalho em DevOps e infraestrutura.",
          pontosMelhora: "Melhorar a comunicação proativa.",
          nomeProjeto: "Automação de Infra",
          periodoMeses: 7,
          trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
        },
        {
          idAvaliador: managerUser.id,
          idAvaliado: luanUser.id,
          idCiclo: cicloRevisaoGestor.id,
          nota: 4.6,
          pontosFortes:
            "Luan é um desenvolvedor muito dedicado e com rápido aprendizado.",
          pontosMelhora: "Buscar mais autonomia em decisões técnicas.",
          nomeProjeto: "Refatoração de API",
          periodoMeses: 8,
          trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
        },
      ],
    });
  }
  console.log("✅ Avaliações de gestor criadas para ciclo revisão gestor.");

  // Mentoring para ciclo revisão gestor (assumindo que já foi feito no estágio 1)
  console.log("👨‍🏫 Criando registros de mentoring para ciclo revisão gestor...");
  for (const user of nonMentorUsers) {
    await prisma.mentoring.create({
      data: {
        idMentorado: user.id,
        idMentor: mentorUser.id,
        idCiclo: cicloRevisaoGestor.id,
        nota: 4.0,
        justificativa: `Sessão de mentoria de acompanhamento para ${user.name} no ciclo de revisão gestor.`,
      },
    });
  }
  console.log("✅ Registros de mentoring criados para ciclo revisão gestor.");

  console.log("🤖 Gerando resumos de IA para ciclo revisão gestor...");
  await prisma.resumoIA.createMany({
    data: [
      {
        userId: luanUser.id,
        idCiclo: cicloRevisaoGestor.id,
        resumo:
          "Luan Bezerra demonstrou grande evolução e é um recurso valioso para a equipe. O gestor recomenda foco em autonomia.",
      },
      {
        userId: arthurUser.id,
        idCiclo: cicloRevisaoGestor.id,
        resumo:
          "Arthur Lins continua a impressionar com sua criatividade no front-end, com sugestão de aprimorar documentação.",
      },
      {
        userId: ericoUser.id,
        idCiclo: cicloRevisaoGestor.id,
        resumo:
          "Erico Chen é um pilar na infraestrutura, com potencial para se destacar ainda mais na comunicação.",
      },
    ],
  });
  console.log("✅ Resumos de IA gerados para ciclo revisão gestor.");

  // ESTÁGIO 3: CICLO REVISÃO COMITÊ (2024.2) - Comitê faz equalizações
  console.log("\n--- Populando dados para o Ciclo Revisão Comitê (2024.2) ---");

  // Replicar dados dos Estágios 1 e 2 para o Ciclo Revisão Comitê
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
          notaGestor: 4.5, // Assumindo que o gestor já avaliou
          justificativaGestor: "Avaliação do gestor já realizada neste ciclo.",
        },
      });
    }
  }
  console.log("✅ Autoavaliações criadas para ciclo revisão comitê.");

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
