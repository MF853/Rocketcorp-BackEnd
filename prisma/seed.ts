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
  const [devTrilha, dadosTrilha, infraTrilha, gestaoTrilha] =
    await Promise.all([
      prisma.trilha.create({ data: { name: "Desenvolvimento" } }),
      prisma.trilha.create({ data: { name: "Análise de Dados" } }),
      prisma.trilha.create({ data: { name: "Infraestrutura" } }),
      prisma.trilha.create({ data: { name: "Gestão" } }),
    ]);
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
        dataAberturaAvaliacao: new Date("2025-01-15T00:00:00Z"),
        dataFechamentoAvaliacao: new Date("2025-02-15T23:59:59Z"),
        dataAberturaRevisaoGestor: new Date("2025-02-16T00:00:00Z"),
        dataFechamentoRevisaoGestor: new Date("2025-02-28T23:59:59Z"),
        dataAberturaRevisaoComite: new Date("2025-03-01T00:00:00Z"),
        dataFechamentoRevisaoComite: new Date("2025-03-10T23:59:59Z"),
        dataFinalizacao: new Date("2025-03-15T23:59:59Z"),
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
    { name: "Raylandson Cesário", email: "raylandson.cesario@rocketcorp.com", password: await hashPassword("password123"), role: ["admin"], cargo: "Desenvolvimento", unidade: "Recife", trilhaId: devTrilha.id },
    { name: "Alice Cadete", email: "alice.cadete@rocketcorp.com", password: await hashPassword("password123"), role: ["manager"], cargo: "Desenvolvimento", unidade: "Recife", trilhaId: devTrilha.id },
    { name: "Arthur Lins", email: "arthur.lins@rocketcorp.com", password: await hashPassword("password123"), role: ["user"], cargo: "Análise de Dados", unidade: "São Paulo", trilhaId: dadosTrilha.id },
    { name: "Erico Chen", email: "erico.chen@rocketcorp.com", password: await hashPassword("password123"), role: ["user"], cargo: "Infraestrutura", unidade: "Belo Horizonte", trilhaId: infraTrilha.id },
    { name: "Luan Bezerra", email: "luan.bezerra@rocketcorp.com", password: await hashPassword("password123"), role: ["user"], cargo: "Desenvolvimento", unidade: "Recife", trilhaId: devTrilha.id },
    { name: "José Mário", email: "jose.mario@rocketcorp.com", password: await hashPassword("password123"), role: ["manager"], cargo: "Gestão", unidade: "Rio de Janeiro", trilhaId: gestaoTrilha.id },
    { name: "Maria Santos", email: "maria.santos@rocketcorp.com", password: await hashPassword("password123"), role: ["user"], cargo: "Desenvolvimento", unidade: "São Paulo", trilhaId: devTrilha.id },
    { name: "Pedro Costa", email: "pedro.costa@rocketcorp.com", password: await hashPassword("password123"), role: ["user"], cargo: "Análise de Dados", unidade: "Porto Alegre", trilhaId: dadosTrilha.id },
    { name: "Ana Oliveira", email: "ana.oliveira@rocketcorp.com", password: await hashPassword("password123"), role: ["user"], cargo: "Infraestrutura", unidade: "Curitiba", trilhaId: infraTrilha.id },
    { name: "Carlos Silva", email: "carlos.silva@rocketcorp.com", password: await hashPassword("password123"), role: ["manager"], cargo: "Gestão", unidade: "Rio de Janeiro", trilhaId: gestaoTrilha.id },
  ];
  const users: User[] = await prisma.$transaction(
    usersData.map((user) => prisma.user.create({ data: user }))
  );
  console.log(`✅ Criados ${users.length} usuários.`);

  // 6. Define as relações de mentoria
  console.log("🤝 Configurando relações de mentoria...");
  await prisma.user.update({ where: { id: users[4].id }, data: { mentorId: users[1].id } }); // Alice -> Luan
  await prisma.user.update({ where: { id: users[6].id }, data: { mentorId: users[1].id } }); // Alice -> Maria
  await prisma.user.update({ where: { id: users[7].id }, data: { mentorId: users[2].id } }); // Arthur -> Pedro
  console.log("✅ Relações de mentoria estabelecidas.");

  // 7. Cria os Critérios de avaliação
  console.log("📋 Criando critérios...");
  const baseCriterios = [
      { name: "Organização", tipo: "comportamental", peso: 5.0, description: "Ser organizado e contribuir para a organização do grupo." },
      { name: "Imagem", tipo: "comportamental", peso: 5.0, description: "Passar uma imagem pessoal positiva e profissional." },
      { name: "Iniciativa", tipo: "comportamental", peso: 5.0, description: "Ser proativo, buscar assumir responsabilidades." },
      { name: "Comprometimento", tipo: "comportamental", peso: 5.0, description: "Se dedicar para atingimento dos resultados desejados." },
      { name: "Relacionamento Interpessoal", tipo: "comportamental", peso: 5.0, description: "Relacionar-se positivamente com a equipe." },
      { name: "Aprendizagem Contínua", tipo: "comportamental", peso: 5.0, description: "Buscar sempre aprender e dividir o conhecimento." },
      { name: "Flexibilidade", tipo: "comportamental", peso: 5.0, description: "Capacidade de se adaptar a situações diversas." },
      { name: "Trabalho em Equipe", tipo: "comportamental", peso: 5.0, description: "Pensar sempre no ótimo global para o grupo." },
      { name: "Produtividade", tipo: "tecnico", peso: 5.0, description: "Otimizar a execução das atividades." },
      { name: "Qualidade", tipo: "tecnico", peso: 5.0, description: "Entregar resultados que atendam ou superem as expectativas." },
      { name: "Foco no Cliente", tipo: "comportamental", peso: 5.0, description: "Entender a real necessidade do cliente." },
      { name: "Criatividade e Inovação", tipo: "comportamental", peso: 5.0, description: "Gerar soluções inovadoras." },
      { name: "Gestão de Pessoas", tipo: "gestao", peso: 5.0, description: "Gerenciar grupos, capacitando e motivando." },
      { name: "Gestão de Projetos", tipo: "gestao", peso: 5.0, description: "Gerenciar projetos, alocando recursos e controlando a execução." },
      { name: "Gestão Organizacional", tipo: "gestao", peso: 5.0, description: "Contribuir para a eficiência e eficácia da gestão da empresa." },
      { name: "Novos Clientes", tipo: "negocios", peso: 5.0, description: "Gerar novos contatos e alavancar novos clientes." },
      { name: "Novos Projetos", tipo: "negocios", peso: 5.0, description: "Gerar novos projetos em clientes já existentes." },
      { name: "Novos Produtos ou Serviços", tipo: "negocios", peso: 5.0, description: "Gerar novos produtos e/ou serviços com potencial de mercado." },
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
  console.log(`✅ Criados ${allCriterios.length} critérios para ${trilhas.length} trilhas.`);

  // 8. Cria as Referências
  console.log("📝 Criando referências...");
  await prisma.referencia.createMany({
    data: [
      { idReferenciador: users[1].id, idReferenciado: users[4].id, idCiclo: cicloQ1_2025.id, justificativa: "Luan demonstrou excelente crescimento técnico e é muito colaborativo." },
      { idReferenciador: users[0].id, idReferenciado: users[6].id, idCiclo: cicloQ1_2025.id, justificativa: "Maria é uma desenvolvedora excepcional com forte capacidade de resolver problemas complexos." },
      { idReferenciador: users[2].id, idReferenciado: users[7].id, idCiclo: cicloQ1_2025.id, justificativa: "Pedro possui conhecimento sólido em análise de dados e grande potencial." },
      { idReferenciador: users[5].id, idReferenciado: users[3].id, idCiclo: cicloQ1_2025.id, justificativa: "Erico tem mostrado excelente trabalho em DevOps e infraestrutura." },
    ]
  });
  console.log("✅ Referências criadas.");

  // 9. Cria as Autoavaliações
  console.log("📊 Criando autoavaliações...");
  const devCriterios = allCriterios.filter(c => c.trilhaId === devTrilha.id);
  const dadosCriterios = allCriterios.filter(c => c.trilhaId === dadosTrilha.id);

  await prisma.autoavaliacao.createMany({
    data: [
      { idUser: users[4].id, idCiclo: cicloQ1_2025.id, criterioId: devCriterios.find(c => c.name === 'Qualidade')?.id, nota: 4.0, justificativa: "Tenho me esforçado para escrever código limpo e bem documentado.", notaGestor: 4.5, justificativaGestor: "Código muito bem estruturado." },
      { idUser: users[6].id, idCiclo: cicloQ1_2025.id, criterioId: devCriterios.find(c => c.name === 'Iniciativa')?.id, nota: 4.5, justificativa: "Sempre busco antecipar problemas e propor soluções.", notaGestor: 4.8, justificativaGestor: "Proatividade excepcional." },
      { idUser: users[7].id, idCiclo: cicloQ1_2025.id, criterioId: dadosCriterios.find(c => c.name === 'Produtividade')?.id, nota: 4.0, justificativa: "Tenho boa capacidade analítica, mas ainda estou aprendendo técnicas mais avançadas.", notaGestor: 4.4, justificativaGestor: "Excelente capacidade analítica." },
    ]
  });
  console.log("✅ Autoavaliações criadas.");
  
  // 10. Cria as Avaliações 360
  console.log("🔄 Criando avaliações 360...");
  await prisma.avaliacao360.createMany({
    data: [
      { idAvaliador: users[4].id, idAvaliado: users[1].id, idCiclo: cicloQ1_2025.id, nota: 4.8, pontosFortes: "Excelente liderança técnica, sempre disponível para mentoria.", pontosMelhora: "Poderia delegar mais tarefas.", nomeProjeto: "Sistema de Gestão", periodoMeses: 6, trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE },
      { idAvaliador: users[6].id, idAvaliado: users[0].id, idCiclo: cicloQ1_2025.id, nota: 4.9, pontosFortes: "Visão estratégica excepcional, capacidade de resolver problemas complexos.", pontosMelhora: "Poderia focar mais na visão macro.", nomeProjeto: "Plataforma de Avaliação", periodoMeses: 8, trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE },
      { idAvaliador: users[1].id, idAvaliado: users[4].id, idCiclo: cicloQ1_2025.id, nota: 4.2, pontosFortes: "Muito dedicado, aprende rapidamente, código bem estruturado.", pontosMelhora: "Precisa ganhar mais confiança para propor soluções.", nomeProjeto: "Sistema de Avaliação", periodoMeses: 6, trabalhariaNovamente: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE },
    ]
  });
  console.log("✅ Avaliações 360 criadas.");

  // 11. Cria Resumos de IA
  console.log("🤖 Gerando resumos de IA...");
  await prisma.resumoIA.createMany({
    data: [
      { userId: users[4].id, idCiclo: cicloQ1_2025.id, resumo: "Luan Bezerra é um desenvolvedor em ascensão com fortes habilidades em colaboração e qualidade de código. As avaliações indicam uma necessidade de desenvolvimento em proatividade e testes automatizados para atingir o próximo nível." },
      { userId: users[6].id, idCiclo: cicloQ1_2025.id, resumo: "Maria Santos é uma desenvolvedora sênior exemplar, destacando-se pela qualidade técnica e proatividade. O feedback sugere que ela pode ampliar seu impacto compartilhando mais seu conhecimento com a equipe." },
    ]
  });
  console.log("✅ Resumos de IA gerados.");

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
  .finally(async () => {
    // Garante que a conexão com o banco de dados seja fechada
    await prisma.$disconnect();
  });
