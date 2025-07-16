import {
  PrismaClient,
  MotivacaoTrabalhoNovamente,
  User,
  Trilha,
  Ciclo,
  Criterio,
} from "@prisma/client";
import * as argon from "argon2";
import { execSync } from "child_process";
import { CryptoService } from "../src/crypto/crypto.service";
import { Role } from "../src/enums/roles.enum";

// Inicializa o cliente do Prisma
const prisma = new PrismaClient();
const cryptoService = new CryptoService();

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

  // 4. Cria os Ciclos de avaliação
  console.log("🔄 Criando ciclos...");
  const [cicloQ1_2025, cicloQ2_2025, cicloQ4_2024] = await Promise.all([
    prisma.ciclo.create({
      data: {
        name: "Q1 2025",
        year: 2025,
        period: 1,
        status: "aberto",
        dataAberturaAvaliacao: new Date("2025-06-15T00:00:00Z"),
        dataFechamentoAvaliacao: new Date("2025-07-05T23:59:59Z"),
        dataAberturaRevisaoGestor: new Date("2025-07-06T00:00:00Z"),
        dataFechamentoRevisaoGestor: new Date("2025-07-12T23:59:59Z"),
        dataAberturaRevisaoComite: new Date("2025-07-13T00:00:00Z"),
        dataFechamentoRevisaoComite: new Date("2025-07-20T23:59:59Z"),
        dataFinalizacao: new Date("2025-07-25T23:59:59Z"),
      },
    }),
    prisma.ciclo.create({
      data: {
        name: "Q2 2025",
        year: 2025,
        period: 2,
        status: "planejamento",
        dataAberturaAvaliacao: new Date("2025-04-15T00:00:00Z"),
        dataFechamentoAvaliacao: new Date("2025-05-15T23:59:59Z"),
        dataAberturaRevisaoGestor: new Date("2025-05-16T00:00:00Z"),
        dataFechamentoRevisaoGestor: new Date("2025-05-30T23:59:59Z"),
        dataAberturaRevisaoComite: new Date("2025-06-01T00:00:00Z"),
        dataFechamentoRevisaoComite: new Date("2025-06-10T23:59:59Z"),
        dataFinalizacao: new Date("2025-06-15T23:59:59Z"),
      },
    }),
    prisma.ciclo.create({
      data: {
        name: "Q4 2024",
        year: 2024,
        period: 4,
        status: "finalizado",
        dataAberturaAvaliacao: new Date("2024-10-15T00:00:00Z"),
        dataFechamentoAvaliacao: new Date("2024-11-15T23:59:59Z"),
        dataAberturaRevisaoGestor: new Date("2024-11-16T00:00:00Z"),
        dataFechamentoRevisaoGestor: new Date("2024-11-30T23:59:59Z"),
        dataAberturaRevisaoComite: new Date("2024-12-01T00:00:00Z"),
        dataFechamentoRevisaoComite: new Date("2024-12-10T23:59:59Z"),
        dataFinalizacao: new Date("2024-12-15T23:59:59Z"),
      },
    }),
  ]);
  const ciclos: Ciclo[] = [cicloQ1_2025, cicloQ2_2025, cicloQ4_2024];
  console.log(`✅ Criados ${ciclos.length} ciclos.`);

  // 5. Cria os Usuários
  console.log("👥 Criando usuários...");
  const usersData = [
    {
      name: "Raylandson Cesário",
      email: "raylandson.cesario@rocketcorp.com",
      password: await hashPassword("password123"),
      role: [Role.Admin],
      cargo: "Desenvolvimento",
      unidade: "Recife",
      trilhaId: devTrilha.id,
      gestorId: null,
    },
    {
      name: "Alice Cadete",
      email: "alice.cadete@rocketcorp.com",
      password: await hashPassword("password123"),
      role: [Role.Gestor],
      cargo: "Desenvolvimento",
      unidade: "Recife",
      trilhaId: devTrilha.id,
      gestorId: null,
    },
    {
      name: "Arthur Lins",
      email: "arthur.lins@rocketcorp.com",
      password: await hashPassword("password123"),
      role: [Role.Colaborador],
      cargo: "Análise de Dados",
      unidade: "São Paulo",
      trilhaId: dadosTrilha.id,
      gestorId: 2, // Alice as gestor
    },
    {
      name: "Erico Chen",
      email: "erico.chen@rocketcorp.com",
      password: await hashPassword("password123"),
      role: [Role.Colaborador],
      cargo: "Infraestrutura",
      unidade: "Belo Horizonte",
      trilhaId: infraTrilha.id,
      gestorId: 2, // Alice as gestor
    },
    {
      name: "Luan Bezerra",
      email: "luan.bezerra@rocketcorp.com",
      password: await hashPassword("password123"),
      role: [Role.Colaborador],
      cargo: "Desenvolvimento",
      unidade: "Recife",
      trilhaId: devTrilha.id,
      gestorId: 2, // Alice as gestor
    },
    {
      name: "José Mário",
      email: "jose.mario@rocketcorp.com",
      password: await hashPassword("password123"),
      role: [Role.Gestor],
      cargo: "Gestão",
      unidade: "Rio de Janeiro",
      trilhaId: gestaoTrilha.id,
      gestorId: null,
    },
    {
      name: "Maria Santos",
      email: "maria.santos@rocketcorp.com",
      password: await hashPassword("password123"),
      role: [Role.Colaborador],
      cargo: "Desenvolvimento",
      unidade: "São Paulo",
      trilhaId: devTrilha.id,
      gestorId: 2, // Alice as gestor
    },
    {
      name: "Pedro Costa",
      email: "pedro.costa@rocketcorp.com",
      password: await hashPassword("password123"),
      role: [Role.Colaborador],
      cargo: "Análise de Dados",
      unidade: "Porto Alegre",
      trilhaId: dadosTrilha.id,
      gestorId: 2, // Alice as gestor
    },
    {
      name: "Ana Oliveira",
      email: "ana.oliveira@rocketcorp.com",
      password: await hashPassword("password123"),
      role: [Role.Colaborador],
      cargo: "Infraestrutura",
      unidade: "Curitiba",
      trilhaId: infraTrilha.id,
      gestorId: 2, // Alice as gestor
    },
    {
      name: "Carlos Silva",
      email: "carlos.silva@rocketcorp.com",
      password: await hashPassword("password123"),
      role: [Role.Gestor],
      cargo: "Gestão",
      unidade: "Rio de Janeiro",
      trilhaId: gestaoTrilha.id,
      gestorId: null,
    },
  ];
  const users: User[] = await prisma.$transaction(
    usersData.map((user) => prisma.user.create({ data: user }))
  );
  console.log(`✅ Criados ${users.length} usuários.`);

  // 6. Define as relações de mentoria
  console.log("🤝 Configurando relações de mentoria...");
  await prisma.user.update({
    where: { id: users[4].id },
    data: { mentorId: users[1].id },
  }); // Alice -> Luan
  await prisma.user.update({
    where: { id: users[6].id },
    data: { mentorId: users[1].id },
  }); // Alice -> Maria
  await prisma.user.update({
    where: { id: users[7].id },
    data: { mentorId: users[2].id },
  }); // Arthur -> Pedro
  console.log("✅ Relações de mentoria estabelecidas.");

  // 7. Cria os Critérios de avaliação
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
          idCiclo: cicloQ1_2025.id, // Associando ao ciclo principal
        },
      });
      allCriterios.push(createdCriterio);
    }
  }
  console.log(
    `✅ Criados ${allCriterios.length} critérios para ${trilhas.length} trilhas.`
  );

  // 8. Cria as Referências
  console.log("📝 Criando referências...");
  await prisma.referencia.create({
    data: {
      idReferenciador: users[1].id,
      idReferenciado: users[4].id,
      idCiclo: cicloQ1_2025.id,
      justificativa: await cryptoService.encrypt(
        "Luan demonstrou excelente crescimento técnico e é muito colaborativo."
      ),
    },
  });
  await prisma.referencia.create({
    data: {
      idReferenciador: users[0].id,
      idReferenciado: users[6].id,
      idCiclo: cicloQ1_2025.id,
      justificativa: await cryptoService.encrypt(
        "Maria é uma desenvolvedora excepcional com forte capacidade de resolver problemas complexos."
      ),
    },
  });
  await prisma.referencia.create({
    data: {
      idReferenciador: users[2].id,
      idReferenciado: users[7].id,
      idCiclo: cicloQ1_2025.id,
      justificativa: await cryptoService.encrypt(
        "Pedro possui conhecimento sólido em análise de dados e grande potencial."
      ),
    },
  });
  await prisma.referencia.create({
    data: {
      idReferenciador: users[5].id,
      idReferenciado: users[3].id,
      idCiclo: cicloQ1_2025.id,
      justificativa: await cryptoService.encrypt(
        "Erico tem mostrado excelente trabalho em DevOps e infraestrutura."
      ),
    },
  });
  console.log("✅ Referências criadas.");

  // 9. Cria as Autoavaliações
  console.log("📊 Criando autoavaliações...");
  const devCriterios = allCriterios.filter((c) => c.trilhaId === devTrilha.id);
  const dadosCriterios = allCriterios.filter(
    (c) => c.trilhaId === dadosTrilha.id
  );

  // Luan Bezerra (users[4]) - Desenvolvimento
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[4].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: devCriterios.find((c) => c.name === "Qualidade")?.id,
      nota: 4.0,
      justificativa: await cryptoService.encrypt(
        "Tenho me esforçado para escrever código limpo e bem documentado."
      ),
      notaGestor: 4.5,
      justificativaGestor: await cryptoService.encrypt(
        "Código muito bem estruturado."
      ),
    },
  });
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[4].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: devCriterios.find((c) => c.name === "Trabalho em Equipe")?.id,
      nota: 4.5,
      justificativa: await cryptoService.encrypt(
        "Colaboro ativamente com a equipe e compartilho conhecimento."
      ),
      notaGestor: 4.3,
      justificativaGestor: await cryptoService.encrypt(
        "Muito colaborativo, sempre disposto a ajudar."
      ),
    },
  });
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[4].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: devCriterios.find((c) => c.name === "Aprendizagem Contínua")
        ?.id,
      nota: 4.8,
      justificativa: await cryptoService.encrypt(
        "Estou sempre estudando novas tecnologias e práticas."
      ),
      notaGestor: 4.7,
      justificativaGestor: await cryptoService.encrypt(
        "Demonstra curiosidade e vontade de aprender."
      ),
    },
  });

  // Maria Santos (users[6]) - Desenvolvimento
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[6].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: devCriterios.find((c) => c.name === "Iniciativa")?.id,
      nota: 4.5,
      justificativa: await cryptoService.encrypt(
        "Sempre busco antecipar problemas e propor soluções."
      ),
      notaGestor: 4.8,
      justificativaGestor: await cryptoService.encrypt(
        "Proatividade excepcional."
      ),
    },
  });
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[6].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: devCriterios.find((c) => c.name === "Produtividade")?.id,
      nota: 4.2,
      justificativa: await cryptoService.encrypt(
        "Mantenho um ritmo consistente de entrega."
      ),
      notaGestor: 4.4,
      justificativaGestor: await cryptoService.encrypt(
        "Entrega sempre dentro do prazo com qualidade."
      ),
    },
  });
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[6].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: devCriterios.find((c) => c.name === "Criatividade e Inovação")
        ?.id,
      nota: 4.6,
      justificativa: await cryptoService.encrypt(
        "Gosto de pensar em soluções criativas para problemas complexos."
      ),
      notaGestor: 4.5,
      justificativaGestor: await cryptoService.encrypt(
        "Sempre traz ideias inovadoras para o projeto."
      ),
    },
  });

  // Pedro Costa (users[7]) - Análise de Dados
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[7].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: dadosCriterios.find((c) => c.name === "Produtividade")?.id,
      nota: 4.0,
      justificativa: await cryptoService.encrypt(
        "Tenho boa capacidade analítica, mas ainda estou aprendendo técnicas mais avançadas."
      ),
      notaGestor: 2.5,
      justificativaGestor: await cryptoService.encrypt(
        "Produtividade abaixo do esperado, precisa melhorar o ritmo de entrega."
      ),
    },
  });
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[7].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: dadosCriterios.find((c) => c.name === "Qualidade")?.id,
      nota: 4.3,
      justificativa: await cryptoService.encrypt(
        "Busco sempre validar meus resultados e entregar análises precisas."
      ),
      notaGestor: 2.8,
      justificativaGestor: await cryptoService.encrypt(
        "Qualidade das análises inconsistente, muitos erros básicos detectados."
      ),
    },
  });
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[7].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: dadosCriterios.find((c) => c.name === "Foco no Cliente")?.id,
      nota: 4.1,
      justificativa: await cryptoService.encrypt(
        "Procuro entender as necessidades do negócio antes de começar as análises."
      ),
      notaGestor: 2.2,
      justificativaGestor: await cryptoService.encrypt(
        "Dificuldade em compreender requisitos do cliente, entrega não atende as expectativas."
      ),
    },
  });

  // Alice Cadete (users[1]) - Desenvolvimento (Manager)
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[1].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: devCriterios.find((c) => c.name === "Gestão de Pessoas")?.id,
      nota: 4.5,
      justificativa: await cryptoService.encrypt(
        "Procuro desenvolver minha equipe e criar um ambiente colaborativo."
      ),
      notaGestor: 4.7,
      justificativaGestor: await cryptoService.encrypt(
        "Liderança exemplar, equipe muito motivada."
      ),
    },
  });
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[1].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: devCriterios.find((c) => c.name === "Gestão de Projetos")?.id,
      nota: 4.3,
      justificativa: await cryptoService.encrypt(
        "Mantenho os projetos organizados e dentro do cronograma."
      ),
      notaGestor: 4.6,
      justificativaGestor: await cryptoService.encrypt(
        "Excelente controle de projetos e prazos."
      ),
    },
  });

  // Raylandson Cesário (users[0]) - Desenvolvimento (Admin)
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[0].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: devCriterios.find((c) => c.name === "Gestão Organizacional")
        ?.id,
      nota: 4.4,
      justificativa: await cryptoService.encrypt(
        "Contribuo para a melhoria contínua dos processos organizacionais."
      ),
      notaGestor: 4.8,
      justificativaGestor: await cryptoService.encrypt(
        "Visão estratégica excepcional para melhorias organizacionais."
      ),
    },
  });
  await prisma.autoavaliacao.create({
    data: {
      idUser: users[0].id,
      idCiclo: cicloQ1_2025.id,
      criterioId: devCriterios.find((c) => c.name === "Qualidade")?.id,
      nota: 4.7,
      justificativa: await cryptoService.encrypt(
        "Busco sempre entregar soluções robustas e escaláveis."
      ),
      notaGestor: 4.9,
      justificativaGestor: await cryptoService.encrypt(
        "Qualidade técnica excepcional em todas as entregas."
      ),
    },
  });
  console.log("✅ Autoavaliações criadas.");

  // 10. Cria as Avaliações 360
  console.log("🔄 Criando avaliações 360...");
  await prisma.avaliacao360.create({
    data: {
      idAvaliador: users[4].id,
      idAvaliado: users[1].id,
      idCiclo: cicloQ1_2025.id,
      nota: 4.8,
      pontosFortes: await cryptoService.encrypt(
        "Excelente liderança técnica, sempre disponível para mentoria."
      ),
      pontosMelhora: await cryptoService.encrypt(
        "Poderia delegar mais tarefas."
      ),
      nomeProjeto: "Sistema de Gestão",
      periodoMeses: 6,
      trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
    },
  });
  await prisma.avaliacao360.create({
    data: {
      idAvaliador: users[6].id,
      idAvaliado: users[0].id,
      idCiclo: cicloQ1_2025.id,
      nota: 4.9,
      pontosFortes: await cryptoService.encrypt(
        "Visão estratégica excepcional, capacidade de resolver problemas complexos."
      ),
      pontosMelhora: await cryptoService.encrypt(
        "Poderia focar mais na visão macro."
      ),
      nomeProjeto: "Plataforma de Avaliação",
      periodoMeses: 8,
      trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
    },
  });
  await prisma.avaliacao360.create({
    data: {
      idAvaliador: users[1].id,
      idAvaliado: users[4].id,
      idCiclo: cicloQ1_2025.id,
      nota: 4.2,
      pontosFortes: await cryptoService.encrypt(
        "Muito dedicado, aprende rapidamente, código bem estruturado."
      ),
      pontosMelhora: await cryptoService.encrypt(
        "Precisa ganhar mais confiança para propor soluções."
      ),
      nomeProjeto: "Sistema de Avaliação",
      periodoMeses: 6,
      trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
    },
  });
  await prisma.avaliacao360.create({
    data: {
      idAvaliador: users[2].id, // Arthur Lins
      idAvaliado: users[7].id, // Pedro Costa
      idCiclo: cicloQ1_2025.id,
      nota: 2.3,
      pontosFortes: await cryptoService.encrypt(
        "Tem conhecimento básico em análise de dados e é educado."
      ),
      pontosMelhora: await cryptoService.encrypt(
        "Precisa melhorar drasticamente a qualidade das entregas, atenção aos detalhes e comunicação. Frequentemente não consegue atender prazos e requisitos."
      ),
      nomeProjeto: "Análise de Vendas Q1",
      periodoMeses: 4,
      trabalhariaNovamente: MotivacaoTrabalhoNovamente.DISCORDO_PARCIALMENTE,
    },
  });
  console.log("✅ Avaliações 360 criadas.");

  // 11. Cria as Avaliações de Mentoring
  console.log("🤝 Criando avaliações de mentoring...");
  await prisma.mentoring.create({
    data: {
      idMentor: users[1].id, // Alice Cadete
      idMentorado: users[4].id, // Luan Bezerra
      idCiclo: cicloQ1_2025.id,
      nota: 4.6,
      justificativa: await cryptoService.encrypt(
        "Luan tem demonstrado excelente evolução técnica e está mais confiante em suas decisões. Precisa trabalhar um pouco mais a comunicação com stakeholders."
      ),
    },
  });
  await prisma.mentoring.create({
    data: {
      idMentor: users[1].id, // Alice Cadete
      idMentorado: users[6].id, // Maria Santos
      idCiclo: cicloQ1_2025.id,
      nota: 4.8,
      justificativa: await cryptoService.encrypt(
        "Maria é uma mentorada excepcional, sempre proativa e com grande capacidade de aprendizado. Tem potencial para assumir posições de liderança."
      ),
    },
  });
  await prisma.mentoring.create({
    data: {
      idMentor: users[2].id, // Arthur Lins
      idMentorado: users[7].id, // Pedro Costa
      idCiclo: cicloQ1_2025.id,
      nota: 2.8,
      justificativa: await cryptoService.encrypt(
        "Pedro tem enfrentado dificuldades significativas em análise de dados. Precisa melhorar a atenção aos detalhes e desenvolver maior autonomia. Tem potencial, mas precisa de muito mais dedicação e foco."
      ),
    },
  });
  console.log("✅ Avaliações de mentoring criadas.");

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
