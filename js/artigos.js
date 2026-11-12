/* ==========================================================
   Equilibra — conteúdos da Biblioteca do bem-estar
   Cada item aponta para a página oficial da instituição de origem.
   Os resumos são escritos pelo próprio projeto; o texto completo
   está sempre na fonte.

   Links conferidos em 11/11/2026. Páginas oficiais mudam de endereço
   com o tempo: se algum link deixar de abrir, atualize aqui.

   Para adicionar um conteúdo, copie um item e preencha:
     id          texto único, sem espaços (letras, números e hífen)
     titulo      título da página na fonte
     categorias  uma ou mais ids de EQUILIBRA_CATEGORIAS
     resumo      uma ou duas frases, com suas próprias palavras
     fonte       instituição responsável
     idioma      'Português' ou 'Inglês'
     tipo        'Página', 'Guia', 'Notícia'...
     url         endereço oficial completo (https://...)
   ========================================================== */

window.EQUILIBRA_CATEGORIAS = [
  { id: 'saude-mental',          label: 'Saúde mental e emocional' },
  { id: 'ansiedade-estresse',    label: 'Ansiedade e estresse' },
  { id: 'sono',                  label: 'Sono e descanso' },
  { id: 'alimentacao-atividade', label: 'Alimentação e atividade física' },
  { id: 'rotina',                label: 'Organização da rotina' },
  { id: 'relacionamentos',       label: 'Relacionamentos e convivência' }
];

window.EQUILIBRA_ARTIGOS = [
  {
    id: 'ms-saude-mental',
    titulo: 'Saúde Mental',
    categorias: ['saude-mental'],
    resumo: 'Página do Ministério da Saúde com informações gerais sobre saúde mental.',
    fonte: 'Ministério da Saúde',
    idioma: 'Português',
    tipo: 'Página',
    url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental'
  },
  {
    id: 'ms-sus-saude-mental',
    titulo: 'SUS e a Saúde Mental',
    categorias: ['saude-mental'],
    resumo: 'Apresenta como o cuidado em saúde mental é oferecido pelo Sistema Único de Saúde.',
    fonte: 'Ministério da Saúde',
    idioma: 'Português',
    tipo: 'Página',
    url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental/sus-e-a-saude-mental'
  },
  {
    id: 'opas-transtornos-mentais',
    titulo: 'Transtornos mentais',
    categorias: ['saude-mental'],
    resumo: 'Página da OPAS/OMS dedicada ao tema dos transtornos mentais, com informações em português.',
    fonte: 'OPAS/OMS',
    idioma: 'Português',
    tipo: 'Página',
    url: 'https://www.paho.org/pt/topicos/transtornos-mentais'
  },
  {
    id: 'ms-linhas-ansiedade',
    titulo: 'Transtornos de Ansiedade no adulto (Sou paciente)',
    categorias: ['ansiedade-estresse', 'rotina'],
    resumo: 'Explica, em linguagem acessível, o que são os transtornos de ansiedade, quais sinais merecem atenção e quais hábitos de vida saudável ajudam no cuidado.',
    fonte: 'Ministério da Saúde · Linhas de Cuidado',
    idioma: 'Português',
    tipo: 'Página',
    url: 'https://linhasdecuidado.saude.gov.br/portal/ansiedade/sou-paciente'
  },
  {
    id: 'oms-ansiedade',
    titulo: 'Anxiety disorders',
    categorias: ['ansiedade-estresse'],
    resumo: 'Ficha informativa da Organização Mundial da Saúde sobre os transtornos de ansiedade.',
    fonte: 'OMS',
    idioma: 'Inglês',
    tipo: 'Ficha informativa',
    url: 'https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders'
  },
  {
    id: 'oms-estresse',
    titulo: 'Doing What Matters in Times of Stress',
    categorias: ['ansiedade-estresse'],
    resumo: 'Guia ilustrado de autoajuda da OMS com técnicas simples para lidar com o estresse no dia a dia.',
    fonte: 'OMS',
    idioma: 'Inglês',
    tipo: 'Guia',
    url: 'https://www.who.int/publications/i/item/9789240003927'
  },
  {
    id: 'bvs-sono-essencial',
    titulo: 'O sono é essencial para a saúde',
    categorias: ['sono', 'rotina'],
    resumo: 'Matéria do Dia Mundial do Sono sobre a importância de dormir bem, com orientações práticas como manter horários regulares e cuidar do ambiente e das refeições da noite.',
    fonte: 'Biblioteca Virtual em Saúde · Ministério da Saúde',
    idioma: 'Português',
    tipo: 'Notícia',
    url: 'https://bvsms.saude.gov.br/o-sono-e-essencial-para-a-saude-17-3-dia-mundial-do-sono/'
  },
  {
    id: 'bvs-disturbios-sono',
    titulo: 'Distúrbios do sono',
    categorias: ['sono'],
    resumo: 'Conteúdo da Biblioteca Virtual em Saúde sobre os distúrbios do sono.',
    fonte: 'Biblioteca Virtual em Saúde · Ministério da Saúde',
    idioma: 'Português',
    tipo: 'Página',
    url: 'https://bvsms.saude.gov.br/disturbios-do-sono/'
  },
  {
    id: 'ms-guias-alimentares',
    titulo: 'Guias Alimentares',
    categorias: ['alimentacao-atividade'],
    resumo: 'Reúne os guias alimentares do Ministério da Saúde, entre eles o Guia Alimentar para a População Brasileira.',
    fonte: 'Ministério da Saúde',
    idioma: 'Português',
    tipo: 'Guia',
    url: 'https://www.gov.br/saude/pt-br/composicao/saps/promocao-da-saude/guias-alimentares'
  },
  {
    id: 'ms-guia-atividade-fisica',
    titulo: 'Guia de Atividade Física para a População Brasileira',
    categorias: ['alimentacao-atividade'],
    resumo: 'Guia oficial com recomendações sobre atividade física para a população brasileira.',
    fonte: 'Ministério da Saúde',
    idioma: 'Português',
    tipo: 'Guia',
    url: 'https://www.gov.br/saude/pt-br/composicao/saps/publicacoes/livro/guia-de-atividade-fisica-para-a-populacao-brasileira-recomendacoes-para-gestores-e-profissionais-de-saude'
  },
  {
    id: 'opas-diretrizes-atividade-fisica',
    titulo: 'OMS lança novas diretrizes sobre atividade física e comportamento sedentário',
    categorias: ['alimentacao-atividade'],
    resumo: 'Notícia da OPAS sobre as diretrizes da OMS para atividade física e comportamento sedentário.',
    fonte: 'OPAS/OMS',
    idioma: 'Português',
    tipo: 'Notícia',
    url: 'https://www.paho.org/pt/noticias/26-11-2020-oms-lanca-novas-diretrizes-sobre-atividade-fisica-e-comportamento-sedentario'
  },
  {
    id: 'fiocruz-cuidar-de-si',
    titulo: 'Cuidar de si para cuidar do outro',
    categorias: ['rotina', 'relacionamentos'],
    resumo: 'Matéria da Fiocruz Brasília (2020) sobre autocuidado, com sugestões como reservar momentos breves do dia para si, escrever um diário e demonstrar afeto. O contexto é o da pandemia, mas as ideias valem para o dia a dia.',
    fonte: 'Fiocruz Brasília',
    idioma: 'Português',
    tipo: 'Notícia',
    url: 'https://www.fiocruzbrasilia.fiocruz.br/cuidar-de-si-para-cuidar-do-outro/'
  },
  {
    id: 'opas-conexao-social',
    titulo: 'Conexão social é associada à melhoria da saúde e redução do risco de morte prematura',
    categorias: ['relacionamentos'],
    resumo: 'Notícia da OPAS/OMS sobre a ligação entre vínculos sociais e saúde.',
    fonte: 'OPAS/OMS',
    idioma: 'Português',
    tipo: 'Notícia',
    url: 'https://www.paho.org/pt/noticias/30-6-2025-conexao-social-e-associada-melhoria-da-saude-e-reducao-do-risco-morte-prematura'
  },
  {
    id: 'mdh-familia-saude-mental',
    titulo: 'O Papel da Família na promoção da saúde mental',
    categorias: ['relacionamentos', 'saude-mental'],
    resumo: 'Publicação de 2020 que orienta famílias sobre como promover a saúde mental, destacando o papel dos vínculos afetivos, das regras claras e do apoio mútuo.',
    fonte: 'Ministério dos Direitos Humanos · Observatório Nacional da Família',
    idioma: 'Português',
    tipo: 'Publicação (PDF)',
    url: 'https://www.gov.br/mdh/pt-br/navegue-por-temas/observatorio-nacional-da-familia/producoessnf/diagramacaoSNFfamiliaesaudementaldigital2.pdf'
  }
];
