import { PrismaClient, MotivacaoTrabalhoNovamente } from "@prisma/client";
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
        name: "Desenvolvimento Full Stack",
      },
    }),
    prisma.trilha.create({
      data: {
        name: "Data Science & Analytics",
      },
    }),
    prisma.trilha.create({
      data: {
        name: "DevOps & Cloud",
      },
    }),
    prisma.trilha.create({
      data: {
        name: "Gestão de Projetos",
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
        trilhaId: trilhas[0].id, // Full Stack
      },
    }),
    prisma.user.create({
      data: {
        name: "Alice Cadete",
        email: "alice.cadete@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "manager",
        unidade: "Desenvolvimento",
        trilhaId: trilhas[0].id, // Full Stack
      },
    }),
    prisma.user.create({
      data: {
        name: "Arthur Lins",
        email: "arthur.lins@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Dados",
        trilhaId: trilhas[1].id, // Data Science
      },
    }),
    prisma.user.create({
      data: {
        name: "Erico Chen",
        email: "erico.chen@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Infraestrutura",
        trilhaId: trilhas[2].id, // DevOps
      },
    }),
    prisma.user.create({
      data: {
        name: "Luan Bezerra",
        email: "luan.bezerra@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Desenvolvimento",
        trilhaId: trilhas[0].id, // Full Stack
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
        trilhaId: trilhas[0].id, // Full Stack
      },
    }),
    prisma.user.create({
      data: {
        name: "Pedro Costa",
        email: "pedro.costa@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Dados",
        trilhaId: trilhas[1].id, // Data Science
      },
    }),
    prisma.user.create({
      data: {
        name: "Ana Oliveira",
        email: "ana.oliveira@rocketcorp.com",
        password: await hashPassword("password123"),
        role: "user",
        unidade: "Infraestrutura",
        trilhaId: trilhas[2].id, // DevOps
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

  // Criterios for Full Stack Track
  const fullStackCriterios = await Promise.all([
    prisma.criterio.create({
      data: {
        name: "Conhecimento Técnico",
        tipo: "tecnico",
        peso: 30.0,
        description: "Domínio de tecnologias front-end e back-end",
        trilhaId: trilhas[0].id,
        idCiclo: ciclos[0].id,
      },
    }),
    prisma.criterio.create({
      data: {
        name: "Qualidade do Código",
        tipo: "tecnico",
        peso: 25.0,
        description: "Boas práticas, clean code e testes",
        trilhaId: trilhas[0].id,
        idCiclo: ciclos[0].id,
      },
    }),
    prisma.criterio.create({
      data: {
        name: "Trabalho em Equipe",
        tipo: "comportamental",
        peso: 20.0,
        description: "Colaboração e comunicação efetiva",
        trilhaId: trilhas[0].id,
        idCiclo: ciclos[0].id,
      },
    }),
    prisma.criterio.create({
      data: {
        name: "Proatividade",
        tipo: "comportamental",
        peso: 25.0,
        description: "Iniciativa e busca por soluções",
        trilhaId: trilhas[0].id,
        idCiclo: ciclos[0].id,
      },
    }),
  ]);

  // Criterios for Data Science Track
  const dataScienceCriterios = await Promise.all([
    prisma.criterio.create({
      data: {
        name: "Análise de Dados",
        tipo: "tecnico",
        peso: 35.0,
        description: "Capacidade de análise e interpretação de dados",
        trilhaId: trilhas[1].id,
        idCiclo: ciclos[0].id,
      },
    }),
    prisma.criterio.create({
      data: {
        name: "Machine Learning",
        tipo: "tecnico",
        peso: 30.0,
        description: "Conhecimento em algoritmos de ML",
        trilhaId: trilhas[1].id,
        idCiclo: ciclos[0].id,
      },
    }),
    prisma.criterio.create({
      data: {
        name: "Comunicação de Resultados",
        tipo: "comportamental",
        peso: 35.0,
        description: "Habilidade de apresentar insights de forma clara",
        trilhaId: trilhas[1].id,
        idCiclo: ciclos[0].id,
      },
    }),
  ]);

  const allCriterios = [...fullStackCriterios, ...dataScienceCriterios];
  console.log(`✅ Created ${allCriterios.length} criterios`);

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
    // Avaliação do Luan por Alice
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[1].id, // Alice
        idAvaliado: users[4].id, // Luan
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 8.5,
        justificativa:
          "Luan mostrou excelente progresso em React e Node.js. Precisa trabalhar um pouco mais em testes automatizados.",
        criterioId: fullStackCriterios[0].id, // Conhecimento Técnico
      },
    }),
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[1].id, // Alice
        idAvaliado: users[4].id, // Luan
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 9.0,
        justificativa:
          "Código muito bem estruturado e seguindo boas práticas. Excelente uso de clean code.",
        criterioId: fullStackCriterios[1].id, // Qualidade do Código
      },
    }),
    // Avaliação da Maria por Raylandson
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[0].id, // Raylandson
        idAvaliado: users[6].id, // Maria
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 9.2,
        justificativa:
          "Maria demonstra domínio excepcional tanto em frontend quanto backend. Sempre atualizada com as últimas tecnologias.",
        criterioId: fullStackCriterios[0].id, // Conhecimento Técnico
      },
    }),
    // Avaliação do Pedro por Arthur
    prisma.avaliacao.create({
      data: {
        idAvaliador: users[2].id, // Arthur
        idAvaliado: users[7].id, // Pedro
        idCiclo: ciclos[0].id, // Q1 2025
        nota: 8.8,
        justificativa:
          "Pedro tem excelente capacidade analítica e consegue extrair insights valiosos dos dados.",
        criterioId: dataScienceCriterios[0].id, // Análise de Dados
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
        nota: 9.5,
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
        nota: 9.8,
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
        nota: 8.7,
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
    prisma.$disconnect();
  });
