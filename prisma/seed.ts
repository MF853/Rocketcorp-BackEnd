// import {
//   PrismaClient,
//   MotivacaoTrabalhoNovamente,
//   Criterio,
// } from "@prisma/client";
// import * as argon from "argon2";
// import { execSync } from "child_process";

// const prisma = new PrismaClient();

// async function hashPassword(password: string): Promise<string> {
//   return await argon.hash(password);
// }

// function runMigrations() {
//   console.log("🔄 Running Prisma migrations...");
//   try {
//     execSync("npx prisma migrate deploy", { stdio: "inherit" });
//     console.log("✅ Migrations completed successfully");
//   } catch (error) {
//     console.error("❌ Error running migrations:", error);
//     throw error;
//   }
// }

// async function main() {
//   console.log("🌱 Starting comprehensive database seeding...");

//   // Run migrations first
//   runMigrations();

//   // Clear existing data in correct order (due to foreign keys)
//   await prisma.avaliacao360.deleteMany();
//   await prisma.avaliacao.deleteMany();
//   await prisma.referencia.deleteMany();
//   await prisma.criterio.deleteMany();
//   await prisma.user.deleteMany();
//   await prisma.ciclo.deleteMany();
//   await prisma.trilha.deleteMany();
//   console.log("🧹 Cleared existing data");

//   // 1. Create Trilhas (Tracks)
//   console.log("🛤️ Creating trilhas...");
//   const trilhas = await Promise.all([
//     prisma.trilha.create({
//       data: {
//         name: "Desenvolvimento",
//       },
//     }),
//     prisma.trilha.create({
//       data: {
//         name: "Análise de Dados",
//       },
//     }),
//     prisma.trilha.create({
//       data: {
//         name: "Infraestrutura",
//       },
//     }),
//     prisma.trilha.create({
//       data: {
//         name: "Gestão",
//       },
//     }),
//   ]);
//   console.log(`✅ Created ${trilhas.length} trilhas`);

//   // 2. Create Ciclos (Cycles)
//   console.log("🔄 Creating ciclos...");
//   const ciclos = await Promise.all([
//     prisma.ciclo.create({
//       data: {
//         name: "Q1 2025",
//         year: 2025,
//         period: 1,
//         status: "aberto",
//       },
//     }),
//     prisma.ciclo.create({
//       data: {
//         name: "Q2 2025",
//         year: 2025,
//         period: 2,
//         status: "planejamento",
//       },
//     }),
//     prisma.ciclo.create({
//       data: {
//         name: "Q4 2024",
//         year: 2024,
//         period: 4,
//         status: "finalizado",
//       },
//     }),
//   ]);
//   console.log(`✅ Created ${ciclos.length} ciclos`);

//   // 3. Create Users
//   console.log("👥 Creating users...");
//   const users = await Promise.all([
//     prisma.user.create({
//       data: {
//         name: "Raylandson Cesário",
//         email: "raylandson.cesario@rocketcorp.com",
//         password: await hashPassword("password123"),
//         role: "admin",
//         unidade: "Desenvolvimento",
//         trilhaId: trilhas[0].id, // Desenvolvimento
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Alice Cadete",
//         email: "alice.cadete@rocketcorp.com",
//         password: await hashPassword("password123"),
//         role: "manager",
//         unidade: "Desenvolvimento",
//         trilhaId: trilhas[0].id, // Desenvolvimento
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Arthur Lins",
//         email: "arthur.lins@rocketcorp.com",
//         password: await hashPassword("password123"),
//         role: "user",
//         unidade: "Dados",
//         trilhaId: trilhas[1].id, // Análise de Dados
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Erico Chen",
//         email: "erico.chen@rocketcorp.com",
//         password: await hashPassword("password123"),
//         role: "user",
//         unidade: "Infraestrutura",
//         trilhaId: trilhas[2].id, // Infraestrutura
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Luan Bezerra",
//         email: "luan.bezerra@rocketcorp.com",
//         password: await hashPassword("password123"),
//         role: "user",
//         unidade: "Desenvolvimento",
//         trilhaId: trilhas[0].id, // Desenvolvimento
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "José Mário",
//         email: "jose.mario@rocketcorp.com",
//         password: await hashPassword("password123"),
//         role: "manager",
//         unidade: "Gestão",
//         trilhaId: trilhas[3].id, // Gestão
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Maria Santos",
//         email: "maria.santos@rocketcorp.com",
//         password: await hashPassword("password123"),
//         role: "user",
//         unidade: "Desenvolvimento",
//         trilhaId: trilhas[0].id, // Desenvolvimento
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Pedro Costa",
//         email: "pedro.costa@rocketcorp.com",
//         password: await hashPassword("password123"),
//         role: "user",
//         unidade: "Dados",
//         trilhaId: trilhas[1].id, // Análise de Dados
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Ana Oliveira",
//         email: "ana.oliveira@rocketcorp.com",
//         password: await hashPassword("password123"),
//         role: "user",
//         unidade: "Infraestrutura",
//         trilhaId: trilhas[2].id, // Infraestrutura
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Carlos Silva",
//         email: "carlos.silva@rocketcorp.com",
//         password: await hashPassword("password123"),
//         role: "user",
//         unidade: "Gestão",
//         trilhaId: trilhas[3].id, // Gestão
//       },
//     }),
//   ]);
//   console.log(`✅ Created ${users.length} users`);

//   // 4. Set up mentor relationships
//   console.log("🤝 Setting up mentor relationships...");
//   await prisma.user.update({
//     where: { id: users[4].id }, // Luan
//     data: { mentorId: users[1].id }, // Alice as mentor
//   });
//   await prisma.user.update({
//     where: { id: users[6].id }, // Maria
//     data: { mentorId: users[1].id }, // Alice as mentor
//   });
//   await prisma.user.update({
//     where: { id: users[7].id }, // Pedro
//     data: { mentorId: users[2].id }, // Arthur as mentor
//   });
//   console.log("✅ Mentor relationships established");

//   // 5. Create Criterios
//   console.log("📋 Creating criterios...");

//   // Base criterios that will be created for each trilha
//   const baseCriterios = [
//     {
//       name: "Organização",
//       tipo: "comportamental",
//       peso: 5.0,
//       description:
//         "Ser organizado e contribuir para a organização do grupo, compartilhando métodos e entregáveis",
//     },
//     {
//       name: "Imagem",
//       tipo: "comportamental",
//       peso: 5.0,
//       description:
//         "Passar uma imagem pessoal positiva e profissional e fortalecer a imagem do grupo",
//     },
//     {
//       name: "Iniciativa",
//       tipo: "comportamental",
//       peso: 5.0,
//       description:
//         "Ser pro-ativo, buscar assumir responsabilidades e aproveitar oportunidades",
//     },
//     {
//       name: "Comprometimento",
//       tipo: "comportamental",
//       peso: 5.0,
//       description:
//         "Se dedicar o necessário para atingimento dos resultados desejados, considerando mudanças em prazo e escopo das atividades",
//     },
//     {
//       name: "Relacionamento Inter-Pessoal",
//       tipo: "comportamental",
//       peso: 5.0,
//       description:
//         "Relacionar-se positivamente interna e externamente, sem comprometer o profissionalismo",
//     },
//     {
//       name: "Aprendizagem Contínua",
//       tipo: "comportamental",
//       peso: 5.0,
//       description:
//         "Buscar sempre aprender as técnicas mais modernas e dividir o conhecimento com o grupo",
//     },
//     {
//       name: "Flexibilidade",
//       tipo: "comportamental",
//       peso: 5.0,
//       description:
//         "Capacidade de se adaptar a situações diversas, lidar positivamente com críticas (sejam pessoais ou ao grupo) e superar obstáculos",
//     },
//     {
//       name: "Trabalho em Equipe",
//       tipo: "comportamental",
//       peso: 5.0,
//       description:
//         "Pensar sempre no ótimo global para o grupo, tanto na divisão de tarefas e como no auxílio aos membros do mesmo, contribuindo para que a equipe alcance seus objetivos",
//     },
//     {
//       name: "Produtividade",
//       tipo: "tecnico",
//       peso: 5.0,
//       description:
//         "Otimizar a execução das atividades de forma a entregar todos os resultados necessários no menor tempo possível",
//     },
//     {
//       name: "Qualidade",
//       tipo: "tecnico",
//       peso: 5.0,
//       description:
//         "Ser perfeccionista, não gerando erros e retrabalho, entregando resultados que atendam ou superem as expectativas",
//     },
//     {
//       name: "Foco no Cliente",
//       tipo: "comportamental",
//       peso: 5.0,
//       description:
//         "Entender a real necessidade do cliente a partir de suas solicitações e auxiliá-lo nesta visualização, estabelecendo uma relação de confiança com o mesmo",
//     },
//     {
//       name: "Criatividade e Inovação",
//       tipo: "comportamental",
//       peso: 5.0,
//       description:
//         "Pensar criativamente, gerando soluções inovadoras, adequadas à realidade do projeto",
//     },
//     {
//       name: "Gestão de Pessoas",
//       tipo: "gestao",
//       peso: 5.0,
//       description:
//         "Gerenciar grupos de pessoas, capacitando-as, motivando-as e aproveitando ao máximo as qualidades individuais",
//     },
//     {
//       name: "Gestão de Projetos",
//       tipo: "gestao",
//       peso: 5.0,
//       description:
//         "Gerenciar projetos, conduzindo reuniões, definindo atividades, alocando recursos de forma ótima e controlando a execução",
//     },
//     {
//       name: "Gestão Organizacional",
//       tipo: "gestao",
//       peso: 5.0,
//       description:
//         "Contribuir para a eficiência e eficácia da gestão da empresa, criando mecanismos que a tornem cada vez mais organizada, estruturada e independente",
//     },
//     {
//       name: "Novos Clientes",
//       tipo: "negocios",
//       peso: 5.0,
//       description:
//         "Gerar novos contatos, alavancando novos clientes para a empresa",
//     },
//     {
//       name: "Novos Projetos",
//       tipo: "negocios",
//       peso: 5.0,
//       description:
//         "Gerar novos projetos em clientes já existentes, com base na relação de confiança e atendimento de demandas com alto padrão de qualidade",
//     },
//     {
//       name: "Novos Produtos ou Serviços",
//       tipo: "negocios",
//       peso: 5.0,
//       description:
//         "Gerar novos produtos e/ou serviços com grande potencial de mercado",
//     },
//   ];

//   // Create criterios for each trilha
//   const allCriterios: Criterio[] = [];
//   for (let i = 0; i < trilhas.length; i++) {
//     const trilha = trilhas[i];
//     for (const criterio of baseCriterios) {
//       const createdCriterio = await prisma.criterio.create({
//         data: {
//           name: criterio.name,
//           tipo: criterio.tipo,
//           peso: criterio.peso,
//           description: criterio.description,
//           trilhaId: trilha.id,
//           idCiclo: ciclos[0].id,
//         },
//       });
//       allCriterios.push(createdCriterio);
//     }
//   }

//   console.log(
//     `✅ Created ${allCriterios.length} criterios across ${trilhas.length} trilhas`
//   );

//   // Helper function to get criterios by trilha and name
//   // const getCriterioByTrilhaAndName = (trilhaId: number, name: string) => {
//   //   return allCriterios.find((c) => c.trilhaId === trilhaId && c.name === name);
//   // };

//   // Create specific criterio shortcuts for easier access
//   const desenvolvimentoCriterios = allCriterios.filter(
//     (c) => c.trilhaId === trilhas[0].id
//   );
//   const dadosCriterios = allCriterios.filter(
//     (c) => c.trilhaId === trilhas[1].id
//   );
//   const infraCriterios = allCriterios.filter(
//     (c) => c.trilhaId === trilhas[2].id
//   );
//   const gestaoCriterios = allCriterios.filter(
//     (c) => c.trilhaId === trilhas[3].id
//   );

//   // 6. Create Referencias
//   console.log("📝 Creating referencias...");
//   const referencias = await Promise.all([
//     prisma.referencia.create({
//       data: {
//         idReferenciador: users[1].id, // Alice
//         idReferenciado: users[4].id, // Luan
//         idCiclo: ciclos[0].id, // Q1 2025
//         justificativa:
//           "Luan demonstrou excelente crescimento técnico e é muito colaborativo. Sempre disposto a ajudar os colegas e busca constantemente aprender novas tecnologias.",
//       },
//     }),
//     prisma.referencia.create({
//       data: {
//         idReferenciador: users[0].id, // Raylandson
//         idReferenciado: users[6].id, // Maria
//         idCiclo: ciclos[0].id, // Q1 2025
//         justificativa:
//           "Maria é uma desenvolvedora excepcional com forte capacidade de resolver problemas complexos. Sua dedicação e qualidade técnica são exemplares.",
//       },
//     }),
//     prisma.referencia.create({
//       data: {
//         idReferenciador: users[2].id, // Arthur
//         idReferenciado: users[7].id, // Pedro
//         idCiclo: ciclos[0].id, // Q1 2025
//         justificativa:
//           "Pedro possui conhecimento sólido em análise de dados e demonstra grande potencial para crescimento na área de Data Science.",
//       },
//     }),
//     prisma.referencia.create({
//       data: {
//         idReferenciador: users[5].id, // José Mário
//         idReferenciado: users[3].id, // Erico
//         idCiclo: ciclos[0].id, // Q1 2025
//         justificativa:
//           "Erico tem mostrado excelente trabalho em DevOps e infraestrutura. Sua expertise técnica e capacidade de automação são muito valiosas.",
//       },
//     }),
//   ]);
//   console.log(`✅ Created ${referencias.length} referencias`);

//   // 7. Create Avaliacoes (with both self-evaluations and manager evaluations)
//   console.log("📊 Creating avaliacoes...");
//   // Helper to avoid duplicate (idAvaliador, idAvaliado, idCiclo)
//   const uniqueAvaliacao: string[] = [];
//   function addAvaliacao(av: {
//     data: {
//       idAvaliador: number;
//       idAvaliado: number;
//       idCiclo: number;
//       criterioId: number;
//       nota: number;
//       justificativa: string;
//       notaGestor: number;
//       justificativaGestor: string;
//     };
//   }) {
//     const key = `${av.data.idAvaliador}_${av.data.idAvaliado}_${av.data.idCiclo}`;
//     if (!uniqueAvaliacao.includes(key)) {
//       uniqueAvaliacao.push(key);
//       return prisma.avaliacao.create(av);
//     }
//     return undefined;
//   }

//   const avaliacoes = await Promise.all(
//     [
//       // Raylandson (Desenvolvimento)
//       addAvaliacao({
//         data: {
//           idAvaliador: users[0].id,
//           idAvaliado: users[0].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.7,
//           justificativa:
//             "Tenho amplo conhecimento técnico e busco sempre me manter atualizado com as tecnologias mais recentes.",
//           criterioId: desenvolvimentoCriterios[0]?.id,
//           notaGestor: 4.9,
//           justificativaGestor:
//             "Conhecimento técnico excepcional, sempre na vanguarda das tecnologias.",
//         },
//       }),
//       // Luan (Desenvolvimento)
//       addAvaliacao({
//         data: {
//           idAvaliador: users[4].id,
//           idAvaliado: users[4].id,
//           idCiclo: ciclos[0].id,
//           nota: 3.5,
//           justificativa:
//             "Sinto que evolui muito em React e Node.js, mas ainda preciso melhorar em testes.",
//           criterioId: desenvolvimentoCriterios[0]?.id,
//           notaGestor: 4.2,
//           justificativaGestor:
//             "Luan mostrou excelente progresso técnico. Concordo que precisa focar mais em testes automatizados.",
//         },
//       }),
//       addAvaliacao({
//         data: {
//           idAvaliador: users[4].id,
//           idAvaliado: users[4].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.0,
//           justificativa:
//             "Tenho me esforçado para escrever código limpo e bem documentado.",
//           criterioId: desenvolvimentoCriterios[1]?.id,
//           notaGestor: 4.5,
//           justificativaGestor:
//             "Código muito bem estruturado e seguindo boas práticas. Excelente evolução.",
//         },
//       }),
//       addAvaliacao({
//         data: {
//           idAvaliador: users[4].id,
//           idAvaliado: users[4].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.2,
//           justificativa:
//             "Gosto de colaborar com a equipe e sempre ajudo quando posso.",
//           criterioId: desenvolvimentoCriterios[2]?.id,
//           notaGestor: 4.6,
//           justificativaGestor:
//             "Excelente colaborador, sempre disposto a ajudar os colegas.",
//         },
//       }),
//       // Maria (Desenvolvimento)
//       addAvaliacao({
//         data: {
//           idAvaliador: users[6].id,
//           idAvaliado: users[6].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.4,
//           justificativa:
//             "Tenho bom domínio de tecnologias full-stack e busco sempre me atualizar.",
//           criterioId: desenvolvimentoCriterios[0]?.id,
//           notaGestor: 4.6,
//           justificativaGestor:
//             "Maria demonstra domínio excepcional tanto em frontend quanto backend. Sempre atualizada.",
//         },
//       }),
//       addAvaliacao({
//         data: {
//           idAvaliador: users[6].id,
//           idAvaliado: users[6].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.2,
//           justificativa:
//             "Me preocupo muito com a qualidade e sempre faço code review cuidadoso.",
//           criterioId: desenvolvimentoCriterios[1]?.id,
//           notaGestor: 4.5,
//           justificativaGestor:
//             "Código de alta qualidade, bem testado e documentado.",
//         },
//       }),
//       addAvaliacao({
//         data: {
//           idAvaliador: users[6].id,
//           idAvaliado: users[6].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.5,
//           justificativa: "Sempre busco antecipar problemas e propor soluções.",
//           criterioId: desenvolvimentoCriterios[3]?.id,
//           notaGestor: 4.8,
//           justificativaGestor:
//             "Proatividade excepcional, sempre traz ideias inovadoras.",
//         },
//       }),
//       // Pedro (Dados)
//       addAvaliacao({
//         data: {
//           idAvaliador: users[7].id,
//           idAvaliado: users[7].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.0,
//           justificativa:
//             "Tenho boa capacidade analítica, mas ainda estou aprendendo técnicas mais avançadas.",
//           criterioId: dadosCriterios[0]?.id,
//           notaGestor: 4.4,
//           justificativaGestor:
//             "Pedro tem excelente capacidade analítica e consegue extrair insights valiosos.",
//         },
//       }),
//       addAvaliacao({
//         data: {
//           idAvaliador: users[7].id,
//           idAvaliado: users[7].id,
//           idCiclo: ciclos[0].id,
//           nota: 3.8,
//           justificativa:
//             "Estou estudando ML intensivamente, mas ainda preciso de mais prática.",
//           criterioId: dadosCriterios[1]?.id,
//           notaGestor: 4.0,
//           justificativaGestor:
//             "Boa evolução em ML, continue estudando e praticando.",
//         },
//       }),
//       // Arthur (Dados)
//       addAvaliacao({
//         data: {
//           idAvaliador: users[2].id,
//           idAvaliado: users[2].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.5,
//           justificativa:
//             "Tenho sólida experiência em análise de dados e uso de ferramentas estatísticas.",
//           criterioId: dadosCriterios[0]?.id,
//           notaGestor: 4.7,
//           justificativaGestor:
//             "Excelente domínio em análise de dados, referência para a equipe.",
//         },
//       }),
//       addAvaliacao({
//         data: {
//           idAvaliador: users[2].id,
//           idAvaliado: users[2].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.1,
//           justificativa:
//             "Consigo explicar resultados complexos de forma clara para diferentes audiências.",
//           criterioId: dadosCriterios[2]?.id,
//           notaGestor: 4.4,
//           justificativaGestor:
//             "Ótima capacidade de comunicar insights de dados de forma acessível.",
//         },
//       }),
//       // Erico (Infraestrutura)
//       addAvaliacao({
//         data: {
//           idAvaliador: users[3].id,
//           idAvaliado: users[3].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.3,
//           justificativa:
//             "Tenho forte conhecimento em DevOps e automação de infraestrutura.",
//           criterioId: infraCriterios[0]?.id,
//           notaGestor: 4.6,
//           justificativaGestor:
//             "Excelente expertise técnica em DevOps e infraestrutura.",
//         },
//       }),
//       // Ana (Infraestrutura)
//       addAvaliacao({
//         data: {
//           idAvaliador: users[8].id,
//           idAvaliado: users[8].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.1,
//           justificativa: "Estou evoluindo bem em infraestrutura e automação.",
//           criterioId: infraCriterios[0]?.id,
//           notaGestor: 4.3,
//           justificativaGestor:
//             "Boa evolução técnica, continue focando em automação.",
//         },
//       }),
//       // Carlos (Gestão)
//       addAvaliacao({
//         data: {
//           idAvaliador: users[9].id,
//           idAvaliado: users[9].id,
//           idCiclo: ciclos[0].id,
//           nota: 3.9,
//           justificativa:
//             "Tenho boa visão de gestão, mas preciso melhorar aspectos técnicos.",
//           criterioId: gestaoCriterios[0]?.id,
//           notaGestor: 4.2,
//           justificativaGestor: "Excelente liderança e gestão de equipe.",
//         },
//       }),
//       // Alice (Desenvolvimento)
//       addAvaliacao({
//         data: {
//           idAvaliador: users[1].id,
//           idAvaliado: users[1].id,
//           idCiclo: ciclos[0].id,
//           nota: 4.6,
//           justificativa:
//             "Procuro sempre liderar pelo exemplo e apoiar o crescimento da equipe.",
//           criterioId: desenvolvimentoCriterios[7]?.id,
//           notaGestor: 4.8,
//           justificativaGestor:
//             "Liderança exemplar, excelente capacidade de desenvolver pessoas.",
//         },
//       }),
//     ].filter(Boolean)
//   );
//   console.log(`✅ Created ${avaliacoes.length} avaliacoes`);

//   // 8. Create Avaliacoes 360 (Extended with more evaluations)
//   console.log("🔄 Creating avaliacoes 360...");
//   const avaliacoes360 = await Promise.all([
//     // Luan evaluating Alice (his mentor)
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[4].id, // Luan
//         idAvaliado: users[1].id, // Alice
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.8,
//         pontosFortes:
//           "Excelente liderança técnica, sempre disponível para mentoria, comunicação clara e objetiva, conhecimento técnico muito sólido.",
//         pontosMelhora:
//           "Poderia delegar mais algumas tarefas para desenvolver a autonomia da equipe.",
//         nomeProjeto: "Sistema de Gestão de Performance",
//         periodoMeses: 6,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
//       },
//     }),
//     // Maria evaluating Raylandson
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[6].id, // Maria
//         idAvaliado: users[0].id, // Raylandson
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.9,
//         pontosFortes:
//           "Visão estratégica excepcional, capacidade de resolver problemas complexos, mentorship de qualidade, conhecimento técnico abrangente.",
//         pontosMelhora:
//           "Às vezes se envolve muito nos detalhes técnicos, poderia focar mais na visão macro.",
//         nomeProjeto: "Plataforma de Avaliação 360",
//         periodoMeses: 8,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
//       },
//     }),
//     // Pedro evaluating Arthur (his mentor)
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[7].id, // Pedro
//         idAvaliado: users[2].id, // Arthur
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.3,
//         pontosFortes:
//           "Conhecimento profundo em análise de dados, boa capacidade de ensinar conceitos complexos, organizado e metódico.",
//         pontosMelhora:
//           "Poderia ser mais ágil na entrega de algumas análises exploratórias.",
//         nomeProjeto: "Dashboard de Métricas de Negócio",
//         periodoMeses: 4,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_PARCIALMENTE,
//       },
//     }),
//     // Alice evaluating Luan
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[1].id, // Alice
//         idAvaliado: users[4].id, // Luan
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.2,
//         pontosFortes:
//           "Muito dedicado, aprende rapidamente, sempre disposto a ajudar colegas, código bem estruturado.",
//         pontosMelhora:
//           "Precisa ganhar mais confiança para propor soluções arquiteturais e melhorar em testes automatizados.",
//         nomeProjeto: "Sistema de Avaliação de Performance",
//         periodoMeses: 6,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
//       },
//     }),
//     // Raylandson evaluating Maria
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[0].id, // Raylandson
//         idAvaliado: users[6].id, // Maria
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.6,
//         pontosFortes:
//           "Excelente qualidade técnica, proativa, ótima capacidade de resolver problemas complexos, trabalha bem em equipe.",
//         pontosMelhora:
//           "Poderia compartilhar mais conhecimento com a equipe através de apresentações técnicas.",
//         nomeProjeto: "API de Integração de Sistemas",
//         periodoMeses: 5,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
//       },
//     }),
//     // Arthur evaluating Pedro
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[2].id, // Arthur
//         idAvaliado: users[7].id, // Pedro
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.1,
//         pontosFortes:
//           "Boa capacidade analítica, curioso e sempre pergunta quando tem dúvidas, organizado com documentação.",
//         pontosMelhora:
//           "Precisa ganhar mais autonomia na escolha de ferramentas e técnicas de análise.",
//         nomeProjeto: "Análise de Comportamento do Cliente",
//         periodoMeses: 3,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_PARCIALMENTE,
//       },
//     }),
//     // Erico evaluating Ana (both DevOps)
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[3].id, // Erico
//         idAvaliado: users[8].id, // Ana
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.0,
//         pontosFortes:
//           "Boa compreensão de infraestrutura, meticulosa na documentação, sempre segue procedimentos de segurança.",
//         pontosMelhora:
//           "Poderia ser mais ágil na implementação de automações e ganhar mais confiança em ambientes de produção.",
//         nomeProjeto: "Migração para Cloud AWS",
//         periodoMeses: 4,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_PARCIALMENTE,
//       },
//     }),
//     // Ana evaluating Erico
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[8].id, // Ana
//         idAvaliado: users[3].id, // Erico
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.5,
//         pontosFortes:
//           "Expertise sólida em DevOps, ótimo conhecimento em containers e CI/CD, sempre disposto a ensinar.",
//         pontosMelhora:
//           "Às vezes pode ser muito perfeccionista, poderia acelerar algumas entregas não críticas.",
//         nomeProjeto: "Implementação de Pipeline CI/CD",
//         periodoMeses: 6,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
//       },
//     }),
//     // José Mário evaluating Carlos (both management)
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[5].id, // José Mário
//         idAvaliado: users[9].id, // Carlos
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.3,
//         pontosFortes:
//           "Excelente visão estratégica, boa capacidade de comunicação com stakeholders, organizado com prazos.",
//         pontosMelhora:
//           "Poderia se envolver mais nos aspectos técnicos dos projetos para melhor compreensão das complexidades.",
//         nomeProjeto: "Reestruturação de Processos Internos",
//         periodoMeses: 8,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
//       },
//     }),
//     // Carlos evaluating José Mário
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[9].id, // Carlos
//         idAvaliado: users[5].id, // José Mário
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.4,
//         pontosFortes:
//           "Liderança inspiradora, ótima capacidade de motivar equipes, visão clara dos objetivos organizacionais.",
//         pontosMelhora:
//           "Poderia ser mais flexível com mudanças de escopo e dar mais autonomia para as equipes técnicas.",
//         nomeProjeto: "Transformação Digital da Empresa",
//         periodoMeses: 12,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
//       },
//     }),
//     // Maria evaluating Luan (both full-stack)
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[6].id, // Maria
//         idAvaliado: users[4].id, // Luan
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.1,
//         pontosFortes:
//           "Código limpo e bem estruturado, aprende tecnologias novas rapidamente, bom trabalho em pair programming.",
//         pontosMelhora:
//           "Poderia participar mais ativamente das discussões de arquitetura e propor mais soluções inovadoras.",
//         nomeProjeto: "Refatoração do Sistema Legacy",
//         periodoMeses: 4,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
//       },
//     }),
//     // Luan evaluating Maria
//     prisma.avaliacao360.create({
//       data: {
//         idAvaliador: users[4].id, // Luan
//         idAvaliado: users[6].id, // Maria
//         idCiclo: ciclos[0].id, // Q1 2025
//         nota: 4.7,
//         pontosFortes:
//           "Conhecimento técnico impressionante, sempre ajuda quando tenho dúvidas, code reviews muito construtivos.",
//         pontosMelhora:
//           "Às vezes pode ser muito detalhista nos code reviews, poderia priorizar os pontos mais críticos.",
//         nomeProjeto: "Desenvolvimento de Nova Feature",
//         periodoMeses: 3,
//         trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
//       },
//     }),
//   ]);
//   console.log(`✅ Created ${avaliacoes360.length} avaliacoes 360`);

//   console.log("\n🎉 Seeding completed successfully!");

//   // Display summary
//   const summary = {
//     trilhas: await prisma.trilha.count(),
//     ciclos: await prisma.ciclo.count(),
//     users: await prisma.user.count(),
//     criterios: await prisma.criterio.count(),
//     referencias: await prisma.referencia.count(),
//     avaliacoes: await prisma.avaliacao.count(),
//     avaliacoes360: await prisma.avaliacao360.count(),
//   };

//   console.log("\n📊 Database Summary:");
//   console.log(`👥 Users: ${summary.users}`);
//   console.log(`🛤️ Trilhas: ${summary.trilhas}`);
//   console.log(`🔄 Ciclos: ${summary.ciclos}`);
//   console.log(`📋 Criterios: ${summary.criterios}`);
//   console.log(`📝 Referencias: ${summary.referencias}`);
//   console.log(`📊 Avaliacoes: ${summary.avaliacoes}`);
//   console.log(`🔄 Avaliacoes 360: ${summary.avaliacoes360}`);
// }

// main()
//   .catch((e) => {
//     console.error("❌ Error during seeding:", e);
//     process.exit(1);
//   })
//   .finally(() => {
//     void prisma.$disconnect();
//   });
