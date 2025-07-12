import { TipoCriterio } from 'src/enums/tipocriterio.enum'; // ajuste o caminho conforme o enum

export function mapTipoCriterio(nome: string): TipoCriterio {
  const normalized = nome.trim().toLowerCase();

  if (
    [
      'organização',
      'iniciativa',
      'comprometimento',
      'flexibilidade',
      'aprendizagem contínua',
      'trabalho em equipe',
      'relacionamento inter-pessoal',
    ].includes(normalized)
  ) return TipoCriterio.POSTURA;

  if (
    [
      'produtividade',
      'qualidade',
      'foco no cliente',
      'criatividade e inovação',
      'imagem',
    ].includes(normalized)
  ) return TipoCriterio.EXECUCAO;

  if (
    [
      'gestão de pessoas*',
      'gestão de projetos*',
      'gestão organizacional*',
      'novos clientes**',
      'novos projetos**',
      'novos produtos ou serviços**',
    ].includes(normalized)
  ) return TipoCriterio.GENTE_E_GESTAO;

  return TipoCriterio.EXECUCAO; // fallback padrão
}
