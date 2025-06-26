import {
  PrismaClient,
  MotivacaoTrabalhoNovamente,
  Criterio,
} from "@prisma/client";
import * as argon from "argon2";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await argon.hash(password);
}

async function main() {
  console.log("🌱 Starting comprehensive database seeding...");

  // Clear existing data in correct order (due to foreign keys)
  await prisma.avaliacao360.deleteMany();
  await prisma.avaliacao.deleteMany();
  await prisma.referencia.deleteMany();
  await prisma.criterio.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ciclo.deleteMany();
  await prisma.trilha.deleteMany();
  console.log("🧹 Cleared existing data");

  // 1. Create Trilhas (Tracks)
  console.log("🛤️ Creating trilhas...");
  const trilhas = await Promise.all([
    prisma.trilha.create({
      data: {
        name: "Desenvolvimento",
      },
    }),
    prisma.trilha.create({
      data: {
        name: "Análise de Dados",
      },
    }),
    prisma.trilha.create({
      data: {
        name: "Infraestrutura",
      },
    }),
    prisma.trilha.create({
      data: {
        name: "Gestão",
      },
    }),
  ]);
  console.log(`✅ Created ${trilhas.length} trilhas`);

  // 2. Create Ciclos (Cycles)
  console.log("🔄 Creating ciclos...");
  const ciclos = await Promise.all([
    prisma.ciclo.create({
      data: {
        name: "Q1 2025",
        year: 2025,
        period: 1,
        status: "aberto",
      },
    }),
    prisma.ciclo.create({
      data: {
        name: "Q2 2025",
        year: 2025,
        period: 2,
        status: "planejamento",
      },
    }),
    prisma.ciclo.create({
      data: {
        name: "Q4 2024",
        year: 2024,
        period: 4,
        status: "finalizado",
      },
    }),
  ]);
  console.log(`✅ Created ${ciclos.length} ciclos`);

  // 3. Create Users
  console.log("👥 Creating users...");
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Raylandson Cesário",
        email: "raylandson.cesario@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "admin",
        unidade: "Desenvolvimento",
        trilhaId: trilhas[0].id, // Desenvolvimento
      },
    }),
    prisma.user.create({
      data: {
        name: "Alice Cadete",
        email: "alice.cadete@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "manager",
        unidade: "Desenvolvimento",
        trilhaId: trilhas[0].id, // Desenvolvimento
      },
    }),
    prisma.user.create({
      data: {
        name: "Arthur Lins",
        email: "arthur.lins@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Dados",
        trilhaId: trilhas[1].id, // Análise de Dados
      },
    }),
    prisma.user.create({
      data: {
        name: "Erico Chen",
        email: "erico.chen@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Infraestrutura",
        trilhaId: trilhas[2].id, // Infraestrutura
      },
    }),
    prisma.user.create({
      data: {
        name: "Luan Bezerra",
        email: "luan.bezerra@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Desenvolvimento",
        trilhaId: trilhas[0].id, // Desenvolvimento
      },
    }),
    prisma.user.create({
      data: {
        name: "José Mário",
        email: "jose.mario@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "manager",
        unidade: "Gestão",
        trilhaId: trilhas[3].id, // Gestão
      },
    }),
    prisma.user.create({
      data: {
        name: "Maria Santos",
        email: "maria.santos@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Desenvolvimento",
        trilhaId: trilhas[0].id, // Desenvolvimento
      },
    }),
    prisma.user.create({
      data: {
        name: "Pedro Costa",
        email: "pedro.costa@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Dados",
        trilhaId: trilhas[1].id, // Análise de Dados
      },
    }),
    prisma.user.create({
      data: {
        name: "Ana Oliveira",
        email: "ana.oliveira@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Infraestrutura",
        trilhaId: trilhas[2].id, // Infraestrutura
      },
    }),
    prisma.user.create({
      data: {
        name: "Carlos Silva",
        email: "carlos.silva@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Gestão",
        trilhaId: trilhas[3].id, // Gestão
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // 4. Set up mentor relationships
  console.log("🤝 Setting up mentor relationships...");
  await prisma.user.update({
    where: { id: users[4].id }, // Luan
    data: { mentorId: users[1].id }, // Alice as mentor
  });
  await prisma.user.update({
    where: { id: users[6].id }, // Maria
    data: { mentorId: users[1].id }, // Alice as mentor
  });
  await prisma.user.update({
    where: { id: users[7].id }, // Pedro
    data: { mentorId: users[2].id }, // Arthur as mentor
  });
  console.log("✅ Mentor relationships established");

  // 5. Create Criterios
  console.log("📋 Creating criterios...");

  // Base criterios that will be created for each trilha
  const baseCriterios = [
    {
      name: "Organização",
      tipo: "comportamental",
      peso: 5.0,
      description:
        "Ser organizado e contribuir para a organização do grupo, compartilhando métodos e entregáveis",
    },
    {
      name: "Imagem",
      tipo: "comportamental",
      peso: 5.0,
      description:
        "Passar uma imagem pessoal positiva e profissional e fortalecer a imagem do grupo",
    },
    {
      name: "Iniciativa",
      tipo: "comportamental",
      peso: 5.0,
      description:
        "Ser pro-ativo, buscar assumir responsabilidades e aproveitar oportunidades",
    },
    {
      name: "Comprometimento",
      tipo: "comportamental",
      peso: 5.0,
      description:
        "Se dedicar o necessário para atingimento dos resultados desejados, considerando mudanças em prazo e escopo das atividades",
    },
    {
      name: "Relacionamento Inter-Pessoal",
      tipo: "comportamental",
      peso: 5.0,
      description:
        "Relacionar-se positivamente interna e externamente, sem comprometer o profissionalismo",
    },
    {
      name: "Aprendizagem Contínua",
      tipo: "comportamental",
      peso: 5.0,
      description:
        "Buscar sempre aprender as técnicas mais modernas e dividir o conhecimento com o grupo",
    },
    {
      name: "Flexibilidade",
      tipo: "comportamental",
      peso: 5.0,
      description:
        "Capacidade de se adaptar a situações diversas, lidar positivamente com críticas (sejam pessoais ou ao grupo) e superar obstáculos",
    },
    {
      name: "Trabalho em Equipe",
      tipo: "comportamental",
      peso: 5.0,
      description:
        "Pensar sempre no ótimo global para o grupo, tanto na divisão de tarefas e como no auxílio aos membros do mesmo, contribuindo para que a equipe alcance seus objetivos",
    },
    {
      name: "Produtividade",
      tipo: "tecnico",
      peso: 5.0,
      description:
        "Otimizar a execução das atividades de forma a entregar todos os resultados necessários no menor tempo possível",
    },
    {
      name: "Qualidade",
      tipo: "tecnico",
      peso: 5.0,
      description:
        "Ser perfeccionista, não gerando erros e retrabalho, entregando resultados que atendam ou superem as expectativas",
    },
    {
      name: "Foco no Cliente",
      tipo: "comportamental",
      peso: 5.0,
      description:
        "Entender a real necessidade do cliente a partir de suas solicitações e auxiliá-lo nesta visualização, estabelecendo uma relação de confiança com o mesmo",
    },
    {
      name: "Criatividade e Inovação",
      tipo: "comportamental",
      peso: 5.0,
      description:
        "Pensar criativamente, gerando soluções inovadoras, adequadas à realidade do projeto",
    },
    {
      name: "Gestão de Pessoas",
      tipo: "gestao",
      peso: 5.0,
      description:
        "Gerenciar grupos de pessoas, capacitando-as, motivando-as e aproveitando ao máximo as qualidades individuais",
    },
    {
      name: "Gestão de Projetos",
      tipo: "gestao",
      peso: 5.0,
      description:
        "Gerenciar projetos, conduzindo reuniões, definindo atividades, alocando recursos de forma ótima e controlando a execução",
    },
    {
      name: "Gestão Organizacional",
      tipo: "gestao",
      peso: 5.0,
      description:
        "Contribuir para a eficiência e eficácia da gestão da empresa, criando mecanismos que a tornem cada vez mais organizada, estruturada e independente",
    },
    {
      name: "Novos Clientes",
      tipo: "negocios",
      peso: 5.0,
      description:
        "Gerar novos contatos, alavancando novos clientes para a empresa",
    },
    {
      name: "Novos Projetos",
      tipo: "negocios",
      peso: 5.0,
      description:
        "Gerar novos projetos em clientes já existentes, com base na relação de confiança e atendimento de demandas com alto padrão de qualidade",
    },
    {
      name: "Novos Produtos ou Serviços",
      tipo: "negocios",
      peso: 5.0,
      description:
        "Gerar novos produtos e/ou serviços com grande potencial de mercado",
    },
  ];

  // Create criterios for each trilha
  const allCriterios: Criterio[] = [];
  for (let i = 0; i < trilhas.length; i++) {
    const trilha = trilhas[i];
    for (const criterio of baseCriterios) {
      const createdCriterio = await prisma.criterio.create({
        data: {
          name: criterio.name,
          tipo: criterio.tipo,
          peso: criterio.peso,
          description: criterio.description,
          trilhaId: trilha.id,
          idCiclo: ciclos[0].id,
        },
      });
      allCriterios.push(createdCriterio);
    }
  }

  console.log(
    `✅ Created ${allCriterios.length} criterios across ${trilhas.length} trilhas`
  );

  // 6. Create Referencias
  console.log("📝 Creating referencias...");
  const referencias = await Promise.all([
    prisma.referencia.create({
      data: {
        idReferenciador: users[1].id, // Alice
        idReferenciado: users[4].id, // Luan
        idCiclo: ciclos[0].id, // Q1 2025
        justificativa:
          "Luan demonstrou excelente crescimento técnico e é muito colaborativo. Sempre disposto a ajudar os colegas e busca constantemente aprender novas tecnologias.",
      },
    }),
    prisma.referencia.create({
      data: {
        idReferenciador: users[0].id, // Raylandson
        idReferenciado: users[6].id, // Maria
        idCiclo: ciclos[0].id, // Q1 2025
        justificativa:
          "Maria é uma desenvolvedora excepcional com forte capacidade de resolver problemas complexos. Sua dedicação e qualidade técnica são exemplares.",
      },
    }),
    prisma.referencia.create({
      data: {
        idReferenciador: users[2].id, // Arthur
        idReferenciado: users[7].id, // Pedro
        idCiclo: ciclos[0].id, // Q1 2025
        justificativa:
          "Pedro possui conhecimento sólido em análise de dados e demonstra grande potencial para crescimento na área de Data Science.",
      },
    }),
    prisma.referencia.create({
      data: {
        idReferenciador: users[5].id, // José Mário
        idReferenciado: users[3].id, // Erico
        idCiclo: ciclos[0].id, // Q1 2025
        justificativa:
          "Erico tem mostrado excelente trabalho em DevOps e infraestrutura. Sua expertise técnica e capacidade de automação são muito valiosas.",
      },
    }),
  ]);
  console.log(`✅ Created ${referencias.length} referencias`);

  // 7. Create Avaliacoes
  console.log("📊 Creating avaliacoes...");
  const avaliacoes = await Promise.all([
    // Auto-avaliações (mesmo idAvaliador e idAvaliado, COM criterioId)
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[0].id, // Raylandson
        idAvaliado: users[0].id, // Raylandson (auto-avaliação)
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 4,
        justificativa:
          "Tenho me dedicado bastante ao desenvolvimento da equipe e aos projetos. Acredito que posso melhorar na organização pessoal.",
        criterioId: allCriterios.find(
          (c) => c.name === "Organização" && c.trilhaId === trilhas[0].id
        )?.id,
      },
    }),
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[4].id, // Luan
        idAvaliado: users[4].id, // Luan (auto-avaliação)
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 4,
        justificativa:
          "Estou focado em melhorar minha produtividade e qualidade de entrega. Tenho buscado aprender novas tecnologias constantemente.",
        criterioId: allCriterios.find(
          (c) => c.name === "Produtividade" && c.trilhaId === trilhas[0].id
        )?.id,
      },
    }),
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[7].id, // Pedro
        idAvaliado: users[7].id, // Pedro (auto-avaliação)
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 4,
        justificativa:
          "Tenho me esforçado para ser mais criativo nas soluções analíticas e buscar sempre inovar nas abordagens de análise de dados.",
        criterioId: allCriterios.find(
          (c) =>
            c.name === "Criatividade e Inovação" && c.trilhaId === trilhas[1].id
        )?.id,
      },
    }),
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[3].id, // Erico
        idAvaliado: users[3].id, // Erico (auto-avaliação)
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 4,
        justificativa:
          "Tenho trabalhado para melhorar minha flexibilidade e adaptação a novas tecnologias de infraestrutura.",
        criterioId: allCriterios.find(
          (c) => c.name === "Flexibilidade" && c.trilhaId === trilhas[2].id
        )?.id,
      },
    }),
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[9].id, // Carlos
        idAvaliado: users[9].id, // Carlos (auto-avaliação)
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 4,
        justificativa:
          "Tenho focado em desenvolver minhas habilidades de gestão de pessoas e busco sempre motivar a equipe.",
        criterioId: allCriterios.find(
          (c) => c.name === "Gestão de Pessoas" && c.trilhaId === trilhas[3].id
        )?.id,
      },
    }),

    // Avaliações normais (diferentes idAvaliador e idAvaliado, SEM criterioId)
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[1].id, // Alice
        idAvaliado: users[4].id, // Luan
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 4,
        justificativa:
          "Luan mostrou excelente progresso técnico e sempre demonstra iniciativa para aprender novas tecnologias. Muito dedicado.",
        // criterioId: null (avaliação geral)
      },
    }),
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[0].id, // Raylandson
        idAvaliado: users[6].id, // Maria
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 5,
        justificativa:
          "Maria demonstra domínio técnico excepcional e excelente trabalho em equipe. Sempre colaborativa e proativa.",
        // criterioId: null (avaliação geral)
      },
    }),
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[2].id, // Arthur
        idAvaliado: users[7].id, // Pedro
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 4,
        justificativa:
          "Pedro tem excelente capacidade analítica e consegue extrair insights valiosos dos dados. Comunicação clara dos resultados.",
        // criterioId: null (avaliação geral)
      },
    }),
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[5].id, // José Mário
        idAvaliado: users[9].id, // Carlos
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 5,
        justificativa:
          "Carlos demonstra excelente capacidade de gestão e liderança. Sempre organizado e focado nos resultados.",
        // criterioId: null (avaliação geral)
      },
    }),
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[1].id, // Alice
        idAvaliado: users[6].id, // Maria
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 5,
        justificativa:
          "Maria é uma das melhores desenvolvedoras da equipe. Sempre disposta a ajudar e com excelente qualidade técnica.",
        // criterioId: null (avaliação geral)
      },
    }),
  ]);
  console.log(`✅ Created ${avaliacoes.length} avaliacoes`);

  // 8. Create Avaliacoes 360
  console.log("� Creating avaliacoes 360...");
  const avaliacoes360 = await Promise.all([
    prisma.avaliacao360.create({
      data: {
        idAvaliador: users[4].id, // Luan
        idAvaliado: users[1].id, // Alice
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 5,
        pontosFortes:
          "Excelente liderança técnica, sempre disponível para mentoria, comunicação clara e objetiva, conhecimento técnico muito sólido.",
        pontosMelhora:
          "Poderia delegar mais algumas tarefas para desenvolver a autonomia da equipe.",
        nomeProjeto: "Sistema de Gestão de Performance",
        periodoMeses: 6,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
    }),
    prisma.avaliacao360.create({
      data: {
        idAvaliador: users[6].id, // Maria
        idAvaliado: users[0].id, // Raylandson
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 5,
        pontosFortes:
          "Visão estratégica excepcional, capacidade de resolver problemas complexos, mentorship de qualidade, conhecimento técnico abrangente.",
        pontosMelhora:
          "Às vezes se envolve muito nos detalhes técnicos, poderia focar mais na visão macro.",
        nomeProjeto: "Plataforma de Avaliação 360",
        periodoMeses: 8,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
      },
    }),
    prisma.avaliacao360.create({
      data: {
        idAvaliador: users[7].id, // Pedro
        idAvaliado: users[2].id, // Arthur
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 4,
        pontosFortes:
          "Conhecimento profundo em análise de dados, boa capacidade de ensinar conceitos complexos, organizado e metódico.",
        pontosMelhora:
          "Poderia ser mais ágil na entrega de algumas análises exploratórias.",
        nomeProjeto: "Dashboard de Métricas de Negócio",
        periodoMeses: 4,
        trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_PARCIALMENTE,
      },
    }),
  ]);
  console.log(`✅ Created ${avaliacoes360.length} avaliacoes 360`);

  console.log("\n🎉 Seeding completed successfully!");

  // Display summary
  const summary = {
    trilhas: await prisma.trilha.count(),
    ciclos: await prisma.ciclo.count(),
    users: await prisma.user.count(),
    criterios: await prisma.criterio.count(),
    referencias: await prisma.referencia.count(),
    avaliacoes: await prisma.avaliacao.count(),
    avaliacoes360: await prisma.avaliacao360.count(),
  };

  console.log("\n📊 Database Summary:");
  console.log(`👥 Users: ${summary.users}`);
  console.log(`🛤️ Trilhas: ${summary.trilhas}`);
  console.log(`🔄 Ciclos: ${summary.ciclos}`);
  console.log(`📋 Criterios: ${summary.criterios}`);
  console.log(`📝 Referencias: ${summary.referencias}`);
  console.log(`📊 Avaliacoes: ${summary.avaliacoes}`);
  console.log(`🔄 Avaliacoes 360: ${summary.avaliacoes360}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
