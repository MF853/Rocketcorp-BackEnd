import {
  PrismaClient,
  StatusEqualizacao,
  User,
  Trilha,
  Ciclo,
  Criterio,
  Role,
} from "@prisma/client";
import * as argon from "argon2";
import { execSync } from "child_process";
import { CryptoService } from "../src/crypto/crypto.service"; // Garanta que este caminho está correto
import { MotivacaoTrabalhoNovamente } from "../src/avaliacao/dto/create-avaliacao.dto"; // Importação correta para MotivacaoTrabalhoNovamente

// Inicializa o cliente do Prisma
const prisma = new PrismaClient();
const cryptoService = new CryptoService(); // Inicializa CryptoService aqui

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
    console.log("✅ Migrações concluída com sucesso.");
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
  await prisma.equipe.deleteMany(); // Limpa equipes também
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

  // 4. Cria os Ciclos de avaliação com datas coerentes com a data de hoje (18/07/2025)
  console.log("🔄 Criando ciclos...");

  // Ciclo Finalizado (hoje é após dataFinalizacao)
  const cicloFinalizado = await prisma.ciclo.create({
    data: {
      name: "2024.1",
      year: 2024,
      period: 1,
      status: "finalizado", // Status: finalizado
      dataAberturaAvaliacao: new Date("2024-05-01T00:00:00-03:00"),
      dataFechamentoAvaliacao: new Date("2024-05-10T23:59:59-03:00"),
      dataAberturaRevisaoGestor: new Date("2024-05-11T00:00:00-03:00"),
      dataFechamentoRevisaoGestor: new Date("2024-05-20T23:59:59-03:00"),
      dataAberturaRevisaoComite: new Date("2024-06-15T00:00:00-03:00"),
      dataFechamentoRevisaoComite: new Date("2024-06-25T23:59:59-03:00"),
      dataFinalizacao: new Date("2024-07-01T23:59:59-03:00"), // Terminou antes de hoje
    },
  });

  // Ciclo em Revisão de Comitê (hoje está entre dataAberturaRevisaoComite e dataFechamentoRevisaoComite)
  const cicloRevisaoComite = await prisma.ciclo.create({
    data: {
      name: "2025.2",
      year: 2025,
      period: 2,
      status: "revisao_comite", // Status: revisão de comitê
      dataAberturaAvaliacao: new Date("2025-06-01T00:00:00-03:00"),
      dataFechamentoAvaliacao: new Date("2025-06-10T23:59:59-03:00"),
      dataAberturaRevisaoGestor: new Date("2025-06-11T00:00:00-03:00"),
      dataFechamentoRevisaoGestor: new Date("2025-06-20T23:59:59-03:00"),
      dataAberturaRevisaoComite: new Date("2025-07-15T00:00:00-03:00"),
      dataFechamentoRevisaoComite: new Date("2025-07-25T23:59:59-03:00"),
      dataFinalizacao: new Date("2025-08-01T23:59:59-03:00"),
    },
  });

  const ciclos: Ciclo[] = [cicloFinalizado, cicloRevisaoComite];
  console.log(`✅ Criados ${ciclos.length} ciclos.`);

  // 5. Cria os Usuários
  console.log("👥 Criando usuários...");
  const usersData = [
    {
      name: "Raylandson Cesário",
      email: "raylandson.cesario@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["admin" as Role, "colaborador" as Role], // 'user' -> 'colaborador'
      cargo: "fullstack",
      unidade: "sao paulo",
      trilhaId: devTrilha.id,
      gestorId: null, // Será definido dinamicamente abaixo
    },
    {
      name: "Alice Cadete",
      email: "alice.cadete@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["gestor" as Role], // 'manager' -> 'gestor'
      cargo: "Gestão",
      unidade: "recife",
      trilhaId: devTrilha.id,
      gestorId: null,
    },
    {
      name: "Arthur Lins",
      email: "arthur.lins@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["colaborador" as Role],
      cargo: "front",
      unidade: "recife",
      trilhaId: dadosTrilha.id,
      gestorId: null, // Será definido dinamicamente abaixo
    },
    {
      name: "Erico Chen",
      email: "erico.chen@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["colaborador" as Role],
      cargo: "Back",
      unidade: "recife",
      trilhaId: infraTrilha.id,
      gestorId: null, // Será definido dinamicamente abaixo
    },
    {
      name: "Luan Bezerra",
      email: "luan.bezerra@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["colaborador" as Role],
      cargo: "Dados",
      unidade: "rio de janeiro",
      trilhaId: devTrilha.id,
      gestorId: null, // Será definido dinamicamente abaixo
    },
    {
      name: "Fernanda Lima",
      email: "fernanda.lima@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["comite" as Role, "rh" as Role],
      cargo: "Gestão",
      unidade: "sao paulo",
      trilhaId: gestaoTrilha.id,
      gestorId: null,
    },
    {
      name: "Bruno Souza",
      email: "bruno.souza@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["mentor" as Role],
      cargo: "Mentor",
      unidade: "recife",
      trilhaId: devTrilha.id,
      gestorId: null,
    },
    {
      name: "Maria Santos",
      email: "maria.santos@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["colaborador" as Role],
      cargo: "Desenvolvimento",
      unidade: "São Paulo",
      trilhaId: devTrilha.id,
      gestorId: null, // Será definido dinamicamente abaixo
    },
    {
      name: "Pedro Costa",
      email: "pedro.costa@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["colaborador" as Role],
      cargo: "Análise de Dados",
      unidade: "Porto Alegre",
      trilhaId: dadosTrilha.id,
      gestorId: null, // Será definido dinamicamente abaixo
    },
    {
      name: "Ana Oliveira",
      email: "ana.oliveira@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["colaborador" as Role],
      cargo: "Infraestrutura",
      unidade: "Curitiba",
      trilhaId: infraTrilha.id,
      gestorId: null, // Será definido dinamicamente abaixo
    },
    {
      name: "José Mário",
      email: "jose.mario@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["gestor" as Role],
      cargo: "Gestão",
      unidade: "Rio de Janeiro",
      trilhaId: gestaoTrilha.id,
      gestorId: null,
    },
    {
      name: "Carlos Silva",
      email: "carlos.silva@rocketcorp.com",
      password: await hashPassword("password123"),
      role: ["gestor" as Role],
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

  // Mapeamento de usuários para facilitar o acesso
  const adminUser = users.find(
    (u) => u.email === "raylandson.cesario@rocketcorp.com"
  )!;
  const managerUser = users.find(
    (u) => u.email === "alice.cadete@rocketcorp.com"
  )!;
  const arthurUser = users.find(
    (u) => u.email === "arthur.lins@rocketcorp.com"
  )!;
  const ericoUser = users.find((u) => u.email === "erico.chen@rocketcorp.com")!;
  const luanUser = users.find(
    (u) => u.email === "luan.bezerra@rocketcorp.com"
  )!;
  const fernandaUser = users.find(
    (u) => u.email === "fernanda.lima@rocketcorp.com"
  )!;
  const brunoUser = users.find(
    (u) => u.email === "bruno.souza@rocketcorp.com"
  )!;
  const mariaUser = users.find(
    (u) => u.email === "maria.santos@rocketcorp.com"
  )!;
  const pedroUser = users.find(
    (u) => u.email === "pedro.costa@rocketcorp.com"
  )!;
  const anaUser = users.find((u) => u.email === "ana.oliveira@rocketcorp.com")!;
  const joseMarioUser = users.find(
    (u) => u.email === "jose.mario@rocketcorp.com"
  )!;
  const carlosSilvaUser = users.find(
    (u) => u.email === "carlos.silva@rocketcorp.com"
  )!;

  // 6. Criação de Equipes
  console.log("🏢 Criando equipes...");
  const equipeDev = await prisma.equipe.create({
    data: {
      nome: "Equipe Alpha Dev",
      descricao: "Equipe de desenvolvimento principal",
      idGestor: managerUser.id,
    },
  });
  const equipeDados = await prisma.equipe.create({
    data: {
      nome: "Equipe Beta Dados",
      descricao: "Equipe de análise de dados",
      idGestor: joseMarioUser.id,
    },
  });
  console.log("✅ Equipes criadas.");

  // 7. Define as relações de mentoria e gestão (CORRIGIDO PARA O PADRÃO ANTIGO)
  console.log("🤝 Configurando relações de mentoria e gestão...");

  // Bruno (mentorUser) é mentor de TODOS os outros usuários, exceto ele mesmo.
  for (const user of users) {
    if (user.id !== brunoUser.id) {
      // Garante que o mentor não seja mentor de si mesmo
      await prisma.user.update({
        where: { id: user.id },
        data: { mentorId: brunoUser.id },
      });
    }
  }

  // Alice (managerUser) é gestora de Raylandson, Arthur, Erico, Luan, Maria, Ana
  await prisma.user.update({
    where: { id: adminUser.id },
    data: { gestorId: managerUser.id, idEquipe: equipeDev.id },
  });
  await prisma.user.update({
    where: { id: arthurUser.id },
    data: { gestorId: managerUser.id, idEquipe: equipeDev.id },
  });
  await prisma.user.update({
    where: { id: ericoUser.id },
    data: { gestorId: managerUser.id, idEquipe: equipeDev.id },
  });
  await prisma.user.update({
    where: { id: luanUser.id },
    data: { gestorId: managerUser.id, idEquipe: equipeDev.id },
  });
  await prisma.user.update({
    where: { id: mariaUser.id },
    data: { gestorId: managerUser.id, idEquipe: equipeDev.id },
  });
  await prisma.user.update({
    where: { id: anaUser.id },
    data: { gestorId: managerUser.id, idEquipe: equipeDev.id },
  });

  // José Mário (joseMarioUser) é gestor de Pedro Costa
  await prisma.user.update({
    where: { id: pedroUser.id },
    data: { gestorId: joseMarioUser.id, idEquipe: equipeDados.id },
  });

  console.log("✅ Relações de mentoria e gestão estabelecidas.");

  // Colaboradores que participarão das avaliações (todos com role 'colaborador' e que não sejam o Bruno)
  const colaboradoresAvaliadores = users.filter(
    (user) =>
      user.role.includes("colaborador" as Role) && user.id !== brunoUser.id
  );
  console.log(
    "👥 Colaboradores identificados para realizar avaliações:",
    colaboradoresAvaliadores.map((u) => u.name)
  );
  // Lista de todos os usuários (exceto Bruno) para serem avaliados ou referenciados
  const allUsersExceptBruno = users.filter((user) => user.id !== brunoUser.id);

  // 8. Cria os Critérios de avaliação (associados ao ciclo em revisão de comitê para simplificação, podem ser reutilizados)
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
      // Criar critérios para o ciclo finalizado
      const createdCriterioFinalizado = await prisma.criterio.create({
        data: {
          ...criterio,
          trilhaId: trilha.id,
          idCiclo: cicloFinalizado.id,
        },
      });
      allCriterios.push(createdCriterioFinalizado);

      // Criar critérios para o ciclo em revisão de comitê
      const createdCriterioRevisao = await prisma.criterio.create({
        data: {
          ...criterio,
          trilhaId: trilha.id,
          idCiclo: cicloRevisaoComite.id,
        },
      });
      allCriterios.push(createdCriterioRevisao);
    }
  }
  console.log(
    `✅ Criados ${allCriterios.length} critérios para ${trilhas.length} trilhas e ${ciclos.length} ciclos.`
  );

  // Filtra os critérios de acordo com as trilhas para uso nas avaliações
  const devCriteriosFinalizado = allCriterios.filter(
    (c) => c.trilhaId === devTrilha.id && c.idCiclo === cicloFinalizado.id
  );
  const dadosCriteriosFinalizado = allCriterios.filter(
    (c) => c.trilhaId === dadosTrilha.id && c.idCiclo === cicloFinalizado.id
  );
  const infraCriteriosFinalizado = allCriterios.filter(
    (c) => c.trilhaId === infraTrilha.id && c.idCiclo === cicloFinalizado.id
  );
  const gestaoCriteriosFinalizado = allCriterios.filter(
    (c) => c.trilhaId === gestaoTrilha.id && c.idCiclo === cicloFinalizado.id
  );

  const devCriteriosRevisaoComite = allCriterios.filter(
    (c) => c.trilhaId === devTrilha.id && c.idCiclo === cicloRevisaoComite.id
  );
  const dadosCriteriosRevisaoComite = allCriterios.filter(
    (c) => c.trilhaId === dadosTrilha.id && c.idCiclo === cicloRevisaoComite.id
  );
  const infraCriteriosRevisaoComite = allCriterios.filter(
    (c) => c.trilhaId === infraTrilha.id && c.idCiclo === cicloRevisaoComite.id
  );
  const gestaoCriteriosRevisaoComite = allCriterios.filter(
    (c) => c.trilhaId === gestaoTrilha.id && c.idCiclo === cicloRevisaoComite.id
  );

  // --- DADOS PARA CADA ESTÁGIO DE CICLO ---

  // Funções auxiliares para gerar dados de avaliação
  const generateAutoAvaliacao = async (
    user: User,
    ciclo: Ciclo,
    criterios: Criterio[]
  ) => {
    // Mentor não faz autoavaliação
    if (user.id === brunoUser.id) return;

    // Garante que haja um critério para cada trilha
    const selectedCriterio =
      criterios.find((c) => c.name === "Produtividade") || criterios[0];

    // Verifica se selectedCriterio é undefined antes de prosseguir
    if (!selectedCriterio) {
      console.warn(
        `⚠️ Nenhum critério encontrado para o usuário ${user.name} na trilha ${user.trilhaId} no ciclo ${ciclo.name}. Pulando autoavaliação.`
      );
      return;
    }

    try {
      await prisma.autoavaliacao.create({
        data: {
          idUser: user.id,
          idCiclo: ciclo.id,
          criterioId: selectedCriterio.id,
          nota: await cryptoService.encrypt("4.0"),
          justificativa: await cryptoService.encrypt(
            `Autoavaliação de ${user.name} para o ciclo ${ciclo.name}.`
          ),
          notaGestor: await cryptoService.encrypt("4.2"),
          justificativaGestor: await cryptoService.encrypt(
            `Avaliação do gestor para ${user.name} no ciclo ${ciclo.name}.`
          ),
        },
      });
      console.log(
        `   -> Autoavaliação criada para ${user.name} no ciclo ${ciclo.name}`
      );
    } catch (error) {
      console.error(
        `❌ Erro ao criar Autoavaliação para ${user.name} no ciclo ${ciclo.name}:`,
        error
      );
    }
  };

  const generateAvaliacao360 = async (
    avaliador: User,
    avaliado: User,
    ciclo: Ciclo
  ) => {
    // Mentor não faz 360
    if (avaliador.id === brunoUser.id) return;

    try {
      // Prevenção de autoavaliação 360 e avaliação de mentor por si mesmo
      if (avaliador.id === avaliado.id) {
        console.log(
          `   🚫 Pulando Avaliação 360: ${avaliador.name} não pode avaliar a si mesmo.`
        );
        return;
      }
      if (avaliado.id === brunoUser.id) {
        console.log(
          `   🚫 Pulando Avaliação 360: ${avaliador.name} não avalia o mentor Bruno aqui.`
        );
        return;
      }

      console.log(
        `   Attempting to create Avaliação 360: ${avaliador.name} (Avaliador) -> ${avaliado.name} (Avaliado) in cycle ${ciclo.name}`
      );
      await prisma.avaliacao360.create({
        data: {
          idAvaliador: avaliador.id,
          idAvaliado: avaliado.id,
          idCiclo: ciclo.id,
          nota: await cryptoService.encrypt("4.5"),
          pontosFortes: await cryptoService.encrypt(
            `Pontos fortes de ${avaliado.name} por ${avaliador.name} no ciclo ${ciclo.name}.`
          ),
          pontosMelhora: await cryptoService.encrypt(
            `Pontos de melhoria de ${avaliado.name} por ${avaliador.name} no ciclo ${ciclo.name}.`
          ),
          nomeProjeto: "Projeto Integrado",
          periodoMeses: 6,
          trabalhariaNovamente: await cryptoService.encrypt(
            MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE
          ),
        },
      });
      console.log(
        `   ✅ Avaliação 360 criada: ${avaliador.name} avaliou ${avaliado.name} no ciclo ${ciclo.name}`
      );
    } catch (error) {
      console.error(
        `❌ Erro ao criar Avaliação 360 de ${avaliador.name} para ${avaliado.name} no ciclo ${ciclo.name}:`,
        error
      );
    }
  };

  const generateMentoring = async (mentorado: User, ciclo: Ciclo) => {
    // Mentor não recebe mentoring de si
    if (mentorado.id === brunoUser.id) return;
    try {
      await prisma.mentoring.create({
        data: {
          idMentorado: mentorado.id,
          idMentor: brunoUser.id,
          idCiclo: ciclo.id,
          nota: await cryptoService.encrypt("4.5"),
          justificativa: await cryptoService.encrypt(
            `Sessão de mentoria de Bruno para ${mentorado.name} no ciclo ${ciclo.name}.`
          ),
        },
      });
      console.log(
        `   -> Mentoring criado para ${mentorado.name} por Bruno no ciclo ${ciclo.name}`
      );
    } catch (error) {
      console.error(
        `❌ Erro ao criar Mentoring para ${mentorado.name} no ciclo ${ciclo.name}:`,
        error
      );
    }
  };

  const generateEqualizacao = async (
    avaliado: User,
    ciclo: Ciclo,
    status: StatusEqualizacao
  ) => {
    // Mentor não tem equalização
    if (avaliado.id === brunoUser.id) return;
    try {
      await prisma.equalizacao.create({
        data: {
          idAvaliador: fernandaUser.id,
          idAvaliado: avaliado.id,
          idCiclo: ciclo.id,
          mediaAutoavaliacao: await cryptoService.encrypt("4.0"),
          mediaAvaliacaoGestor: await cryptoService.encrypt("4.2"),
          mediaAvaliacao360: await cryptoService.encrypt("4.1"),
          notaFinal: await cryptoService.encrypt("4.3"),
          justificativa: await cryptoService.encrypt(
            `Equalização de ${avaliado.name} para o ciclo ${ciclo.name} por Fernanda.`
          ),
          status: status,
        },
      });
      console.log(
        `   -> Equalização criada para ${avaliado.name} no ciclo ${ciclo.name} (Status: ${status})`
      );
    } catch (error) {
      console.error(
        `❌ Erro ao criar Equalização para ${avaliado.name} no ciclo ${ciclo.name}:`,
        error
      );
    }
  };

  const generateReferencia = async (
    referenciador: User,
    referenciado: User,
    ciclo: Ciclo
  ) => {
    // Ninguém pode se referenciar
    if (referenciador.id === referenciado.id) {
      console.log(
        `   🚫 Pulando Referência: ${referenciador.name} não pode referenciar a si mesmo.`
      );
      return;
    }
    try {
      console.log(
        `   Attempting to create Referencia: ${referenciador.name} (Referenciador) -> ${referenciado.name} (Referenciado) in cycle ${ciclo.name}`
      );
      await prisma.referencia.create({
        data: {
          idReferenciador: referenciador.id,
          idReferenciado: referenciado.id,
          idCiclo: ciclo.id,
          justificativa: await cryptoService.encrypt(
            `Referência de ${referenciador.name} sobre ${referenciado.name} no ciclo ${ciclo.name}.`
          ),
        },
      });
      console.log(
        `   ✅ Referência criada: ${referenciador.name} referenciou ${referenciado.name} no ciclo ${ciclo.name}`
      );
    } catch (error) {
      console.error(
        `❌ Erro ao criar Referência de ${referenciador.name} para ${referenciado.name} no ciclo ${ciclo.name}:`,
        error
      );
    }
  };

  // --- Popula dados para o Ciclo Finalizado (2024.1) ---
  console.log("\n--- Populando dados para o Ciclo Finalizado (2024.1) ---");

  // Referências para ciclo finalizado
  console.log("📝 Criando referências para ciclo finalizado...");
  // Cada usuário (exceto Bruno) referencia outro aleatório (exceto Bruno e ele mesmo)
  for (const referenciador of allUsersExceptBruno) {
    const possibleReferenced = allUsersExceptBruno.filter(
      (u) => u.id !== referenciador.id
    );
    if (possibleReferenced.length > 0) {
      const referenciado =
        possibleReferenced[
          Math.floor(Math.random() * possibleReferenced.length)
        ];
      await generateReferencia(referenciador, referenciado, cicloFinalizado);
    } else {
      console.log(
        `   🚫 Não há outros usuários para ${referenciador.name} referenciar no ciclo ${cicloFinalizado.name}.`
      );
    }
  }
  console.log("✅ Referências criadas para ciclo finalizado.");

  // Autoavaliação para todos (exceto Bruno)
  console.log("📊 Criando autoavaliações para ciclo finalizado...");
  for (const user of colaboradoresAvaliadores) {
    let criteriosParaUsuario: Criterio[];
    if (user.trilhaId === devTrilha.id) {
      criteriosParaUsuario = devCriteriosFinalizado;
    } else if (user.trilhaId === dadosTrilha.id) {
      criteriosParaUsuario = dadosCriteriosFinalizado;
    } else if (user.trilhaId === infraTrilha.id) {
      criteriosParaUsuario = infraCriteriosFinalizado;
    } else {
      criteriosParaUsuario = gestaoCriteriosFinalizado;
    }
    await generateAutoAvaliacao(user, cicloFinalizado, criteriosParaUsuario);
  }
  console.log("✅ Autoavaliações criadas para ciclo finalizado.");

  // Avaliações 360 para todos os colaboradores (exceto Bruno)
  console.log("🔄 Criando avaliações 360 para ciclo finalizado...");
  for (const avaliador of colaboradoresAvaliadores) {
    // Avaliar o gestor direto
    if (avaliador.gestorId) {
      const gestor = users.find((u) => u.id === avaliador.gestorId);
      if (gestor) {
        await generateAvaliacao360(avaliador, gestor, cicloFinalizado);
      } else {
        console.warn(
          `   ⚠️ Gestor não encontrado para ${avaliador.name} (ID: ${avaliador.gestorId}).`
        );
      }
    } else {
      console.log(
        `   ${avaliador.name} não possui gestor definido. Pulando avaliação do gestor.`
      );
    }

    // Avaliar um colega aleatório (exceto ele mesmo e Bruno)
    const possibleColleagues = colaboradoresAvaliadores.filter(
      (u) => u.id !== avaliador.id && u.id !== brunoUser.id
    );
    if (possibleColleagues.length > 0) {
      const colega =
        possibleColleagues[
          Math.floor(Math.random() * possibleColleagues.length)
        ];
      await generateAvaliacao360(avaliador, colega, cicloFinalizado);
    } else {
      console.log(
        `   🚫 Não há colegas disponíveis para ${avaliador.name} avaliar no ciclo ${cicloFinalizado.name}.`
      );
    }
  }
  console.log("✅ Avaliações 360 criadas para ciclo finalizado.");

  // Mentoring de Bruno para todos (exceto Bruno)
  console.log("👨‍🏫 Criando registros de mentoring para ciclo finalizado...");
  for (const user of allUsersExceptBruno) {
    // Mentoring é para todos exceto o mentor
    await generateMentoring(user, cicloFinalizado);
  }
  console.log("✅ Registros de mentoring criados para ciclo finalizado.");

  // Equalizações de Fernanda para todos (exceto Bruno)
  console.log("⚖️ Criando equalizações para ciclo finalizado...");
  for (const user of allUsersExceptBruno) {
    // Equalização é para todos exceto o mentor
    await generateEqualizacao(
      user,
      cicloFinalizado,
      StatusEqualizacao.FINALIZADO
    );
  }
  console.log("✅ Equalizações criadas para ciclo finalizado.");

  // Geração de Resumos de IA (mantido como estava, pois não foi requisitado alteração)
  console.log("🤖 Gerando resumos de IA para ciclo finalizado...");
  await prisma.resumoIA.createMany({
    data: [
      {
        userId: luanUser.id,
        idCiclo: cicloFinalizado.id,
        resumo: await cryptoService.encrypt(
          "Luan Bezerra teve um ciclo de avaliação muito positivo, com grande evolução em suas habilidades."
        ),
      },
      {
        userId: pedroUser.id,
        idCiclo: cicloFinalizado.id,
        resumo: await cryptoService.encrypt(
          "Pedro Costa necessita de um plano de desenvolvimento focado em qualidade e cumprimento de prazos, conforme feedback do comitê."
        ),
      },
    ],
  });
  console.log("✅ Resumos de IA gerados para ciclo finalizado.");

  // --- Popula dados para o Ciclo em Revisão de Comitê (2025.2) ---
  console.log(
    "\n--- Populando dados para o Ciclo em Revisão de Comitê (2025.2) ---"
  );

  // Referências para ciclo em revisão de comitê
  console.log("📝 Criando referências para ciclo em revisão de comitê...");
  for (const referenciador of allUsersExceptBruno) {
    const possibleReferenced = allUsersExceptBruno.filter(
      (u) => u.id !== referenciador.id
    );
    if (possibleReferenced.length > 0) {
      const referenciado =
        possibleReferenced[
          Math.floor(Math.random() * possibleReferenced.length)
        ];
      await generateReferencia(referenciador, referenciado, cicloRevisaoComite);
    } else {
      console.log(
        `   🚫 Não há outros usuários para ${referenciador.name} referenciar no ciclo ${cicloRevisaoComite.name}.`
      );
    }
  }
  console.log("✅ Referências criadas para ciclo em revisão de comitê.");

  // Autoavaliação para todos (exceto Bruno)
  console.log("📊 Criando autoavaliações para ciclo em revisão de comitê...");
  for (const user of colaboradoresAvaliadores) {
    let criteriosParaUsuario: Criterio[];
    if (user.trilhaId === devTrilha.id) {
      criteriosParaUsuario = devCriteriosRevisaoComite;
    } else if (user.trilhaId === dadosTrilha.id) {
      criteriosParaUsuario = dadosCriteriosRevisaoComite;
    } else if (user.trilhaId === infraTrilha.id) {
      criteriosParaUsuario = infraCriteriosRevisaoComite;
    } else {
      criteriosParaUsuario = gestaoCriteriosRevisaoComite;
    }
    await generateAutoAvaliacao(user, cicloRevisaoComite, criteriosParaUsuario);
  }
  console.log("✅ Autoavaliações criadas para ciclo em revisão de comitê.");

  // Avaliações 360 para todos os colaboradores (exceto Bruno)
  console.log("🔄 Criando avaliações 360 para ciclo em revisão de comitê...");
  for (const avaliador of colaboradoresAvaliadores) {
    // Avaliar o gestor direto
    if (avaliador.gestorId) {
      const gestor = users.find((u) => u.id === avaliador.gestorId);
      if (gestor) {
        await generateAvaliacao360(avaliador, gestor, cicloRevisaoComite);
      } else {
        console.warn(
          `   ⚠️ Gestor não encontrado para ${avaliador.name} (ID: ${avaliador.gestorId}).`
        );
      }
    } else {
      console.log(
        `   ${avaliador.name} não possui gestor definido. Pulando avaliação do gestor.`
      );
    }

    // Avaliar um colega aleatório (exceto ele mesmo e Bruno)
    const possibleColleagues = colaboradoresAvaliadores.filter(
      (u) => u.id !== avaliador.id && u.id !== brunoUser.id
    );
    if (possibleColleagues.length > 0) {
      const colega =
        possibleColleagues[
          Math.floor(Math.random() * possibleColleagues.length)
        ];
      await generateAvaliacao360(avaliador, colega, cicloRevisaoComite);
    } else {
      console.log(
        `   🚫 Não há colegas disponíveis para ${avaliador.name} avaliar no ciclo ${cicloRevisaoComite.name}.`
      );
    }
  }
  console.log("✅ Avaliações 360 criadas para ciclo em revisão de comitê.");

  // Mentoring de Bruno para todos (exceto Bruno)
  console.log(
    "👨‍🏫 Criando registros de mentoring para ciclo em revisão de comitê..."
  );
  for (const user of allUsersExceptBruno) {
    // Mentoring é para todos exceto o mentor
    await generateMentoring(user, cicloRevisaoComite);
  }
  console.log(
    "✅ Registros de mentoring criados para ciclo em revisão de comitê."
  );

  // Equalizações de Fernanda para todos (exceto Bruno)
  console.log("⚖️ Criando equalizações para ciclo em revisão de comitê...");
  for (const user of allUsersExceptBruno) {
    // Equalização é para todos exceto o mentor
    await generateEqualizacao(
      user,
      cicloRevisaoComite,
      StatusEqualizacao.PENDENTE
    );
  }
  console.log("✅ Equalizações criadas para ciclo em revisão de comitê.");

  // Geração de Resumos de IA (mantido como estava, pois não foi requisitado alteração)
  console.log("🤖 Gerando resumos de IA para ciclo em revisão de comitê...");
  await prisma.resumoIA.createMany({
    data: [
      {
        userId: luanUser.id,
        idCiclo: cicloRevisaoComite.id,
        resumo: await cryptoService.encrypt(
          "Luan Bezerra é um desenvolvedor em ascensão com fortes habilidades em colaboração e qualidade de código."
        ),
      },
      {
        userId: arthurUser.id,
        idCiclo: cicloRevisaoComite.id,
        resumo: await cryptoService.encrypt(
          "Arthur Lins demonstra grande criatividade e habilidade no desenvolvimento front-end."
        ),
      },
      {
        userId: ericoUser.id,
        idCiclo: cicloRevisaoComite.id,
        resumo: await cryptoService.encrypt(
          "Erico Chen é um especialista em infraestrutura com grande potencial de crescimento."
        ),
      },
      {
        userId: mariaUser.id,
        idCiclo: cicloRevisaoComite.id,
        resumo: await cryptoService.encrypt(
          "Maria Santos é uma colaboradora dedicada com forte iniciativa e pensamento criativo, entregando resultados de alta qualidade."
        ),
      },
      {
        userId: pedroUser.id,
        idCiclo: cicloRevisaoComite.id,
        resumo: await cryptoService.encrypt(
          "Pedro Costa demonstra conhecimento básico em análise de dados, mas necessita de aprimoramento em produtividade e qualidade para atender às expectativas."
        ),
      },
      {
        userId: managerUser.id,
        idCiclo: cicloRevisaoComite.id,
        resumo: await cryptoService.encrypt(
          "Alice Cadete demonstra liderança exemplar e excelente controle de projetos, motivando sua equipe de forma eficaz."
        ),
      },
      {
        userId: adminUser.id,
        idCiclo: cicloRevisaoComite.id,
        resumo: await cryptoService.encrypt(
          "Raylandson Cesário possui visão estratégica e entrega soluções robustas e escaláveis, contribuindo significativamente para a organização."
        ),
      },
    ],
  });
  console.log("✅ Resumos de IA gerados para ciclo em revisão de comitê.");

  // --- Resumo Final ---
  console.log("\n🎉 Seeding concluído com sucesso!");
  const summary = {
    trilhas: await prisma.trilha.count(),
    ciclos: await prisma.ciclo.count(),
    equipes: await prisma.equipe.count(),
    users: await prisma.user.count(),
    criterios: await prisma.criterio.count(),
    referencias: await prisma.referencia.count(),
    autoavaliacoes: await prisma.autoavaliacao.count(),
    avaliacoes360: await prisma.avaliacao360.count(),
    mentoring: await prisma.mentoring.count(),
    equalizacoes: await prisma.equalizacao.count(),
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
