// Estrutura de dados que dirige TODO o questionário.
// Para adicionar, remover ou reordenar perguntas, edite apenas este arquivo —
// a interface (barra de progresso, resumo lateral, revisão final) se ajusta sozinha.
//
// campo: "alteracoes" | "exclusoes" | "inclusoes" | "comentarios"

export const CAMPOS = {
  alteracoes: { label: "Alterações", cor: "bg-amber-100 text-amber-900 border-amber-300" },
  exclusoes: { label: "Exclusões", cor: "bg-rose-100 text-rose-900 border-rose-300" },
  inclusoes: { label: "Inclusões", cor: "bg-emerald-100 text-emerald-900 border-emerald-300" },
  comentarios: { label: "Comentários gerais", cor: "bg-sky-100 text-sky-900 border-sky-300" },
};

export const EIXOS = [
  {
    id: "legal",
    numero: "3.1",
    titulo: "Fundamentação legal (Considerandos)",
    resumo:
      "A minuta se ampara na Constituição Federal (art. 206 e art. 30, VI), na LDB (art. 32), na Lei nº 15.247/2025 (Compromisso Nacional Criança Alfabetizada), na Lei nº 15.388/2026 (PNE 2026–2036), na BNCC, no Plano Municipal de Educação (Lei nº 2.713/2015), nas Orientações Curriculares da Rede e nas Portarias SME nº 016/2026 (COMPASSO) e nº 160/2026 (reorganização do ciclo de alfabetização).",
    perguntas: [
      {
        id: "q1",
        texto:
          "Há alguma base legal, norma ou orientação relevante para a alfabetização (incluindo legislação de Educação Especial/inclusão) que está ausente e deveria ser incluída entre os \"considerandos\"?",
        campo: "inclusoes",
      },
      {
        id: "q2",
        texto:
          "Algum dos fundamentos legais citados está desatualizado, é redundante ou deveria ser removido/substituído?",
        campo: "exclusoes",
      },
    ],
  },
  {
    id: "conceito",
    numero: "3.2",
    titulo: "Art. 1º e 2º — Objeto e conceito de alfabetização",
    resumo:
      "A política é instituída para assegurar o direito de todas as crianças à leitura, escrita e oralidade, definindo alfabetização como apropriação do sistema de escrita alfabética articulada às práticas sociais de leitura, escrita e oralidade.",
    perguntas: [
      {
        id: "q3",
        texto:
          "A redação do conceito de alfabetização (Art. 2º) contempla adequadamente sua prática pedagógica e a realidade dos estudantes atendidos por esta unidade? Sugira ajustes de redação, se houver.",
        campo: "alteracoes",
      },
    ],
  },
  {
    id: "recomposicao",
    numero: "3.3",
    titulo: "Art. 3º — Recomposição das Aprendizagens",
    resumo:
      "A Recomposição das Aprendizagens é definida como estratégia permanente da Política, por meio de ações pedagógicas planejadas, sistemáticas e contextualizadas, em articulação com o Programa COMPASSO.",
    perguntas: [
      {
        id: "q4",
        texto:
          "A articulação entre a Recomposição das Aprendizagens e o COMPASSO está clara e suficiente para orientar o trabalho da unidade? O que precisaria ser detalhado ou incluído?",
        campo: "inclusoes",
      },
    ],
  },
  {
    id: "concepcoes",
    numero: "3.4",
    titulo: "Art. 4º (I a VII) — Concepções teórico-metodológicas",
    resumo:
      "São listadas sete concepções: mediação pedagógica no desenvolvimento humano; linguagem como prática social e histórica; interrelação entre conhecimentos conceituais, procedimentais e atitudinais; alfabetização como direito; currículo como espaço de produção de conhecimentos e culturas; respeito aos diferentes ritmos e percursos de aprendizagem, valorizando a inclusão; e respeito à diversidade humana e enfrentamento à discriminação.",
    perguntas: [
      {
        id: "q5",
        texto:
          "Dentre as sete concepções (incisos I a VII), quais você considera essenciais e bem redigidas? Quais merecem alteração de redação para maior clareza ou coerência com a prática?",
        campo: "alteracoes",
      },
      {
        id: "q6",
        texto:
          "Falta alguma concepção teórico-metodológica importante para o trabalho de alfabetização com turmas de Educação Especial, AEE ou estudantes público-alvo da educação inclusiva?",
        campo: "inclusoes",
      },
    ],
  },
  {
    id: "gestao-democratica",
    numero: "3.5",
    titulo: "\"Art. 4º\" (duplicado) — Gestão democrática",
    resumo:
      "A minuta apresenta dois artigos numerados como \"Art. 4º\" — o segundo trata da gestão democrática, com participação de profissionais, famílias, estudantes e comunidade na construção e no acompanhamento das ações.",
    perguntas: [
      {
        id: "q7",
        texto:
          "Foi identificada duplicidade na numeração dos artigos (\"Art. 4º\" aparece duas vezes). Registre esta e outras inconsistências de redação, numeração ou formatação observadas na leitura.",
        campo: "exclusoes",
      },
    ],
  },
  {
    id: "atribuicoes-sme",
    numero: "3.6",
    titulo: "Art. 5º — Atribuições da Secretaria Municipal de Educação",
    resumo:
      "A SME se compromete a promover ações integradas de formação, certificação, acompanhamento pedagógico, avaliação, produção de materiais e monitoramento, garantindo as condições necessárias à efetivação da Política.",
    perguntas: [
      {
        id: "q8",
        texto:
          "Considerando a realidade desta unidade (Centro de Referência em Educação Inclusiva, com 7 turmas de Educação Especial e 5 salas de AEE), que apoio específico da SME deveria estar explicitamente previsto neste artigo e ainda não está?",
        campo: "inclusoes",
      },
    ],
  },
  {
    id: "planos-anuais",
    numero: "3.7",
    titulo: "Art. 6º — Planos anuais das unidades escolares",
    resumo:
      "As unidades devem elaborar, de forma colaborativa entre professores e equipe diretiva, planos anuais de alfabetização e recomposição das aprendizagens com base em diagnóstico inicial, indicadores educacionais e especificidades do contexto escolar.",
    perguntas: [
      {
        id: "q9",
        texto:
          "A redação deste artigo dá conta das especificidades de planejamento para turmas de Educação Especial e para o AEE, ou seria necessário um ajuste de texto para contemplar esse público de forma explícita?",
        campo: "alteracoes",
      },
    ],
  },
  {
    id: "indicadores",
    numero: "3.8",
    titulo: "Art. 7º — Indicadores da Política (I a X)",
    resumo:
      "São dez indicadores, entre eles: percentual de estudantes alfabetizados ao final do 2º ano (INCA), evolução das aprendizagens, resultados de avaliações, formação continuada, frequência/permanência, planos de recomposição, projetos de leitura, materiais didáticos, participação das famílias e acompanhamento pedagógico das equipes.",
    perguntas: [
      {
        id: "q10",
        texto:
          "Os dez indicadores listados são suficientes para retratar a realidade da escola? Falta algum indicador voltado à inclusão, à Educação Especial ou às terminalidades específicas dos estudantes atendidos?",
        campo: "inclusoes",
      },
      {
        id: "q11",
        texto:
          "Algum indicador, na forma como está redigido, é inaplicável ou pouco relevante para a realidade desta unidade e deveria ser retirado ou substituído?",
        campo: "exclusoes",
      },
    ],
  },
  {
    id: "monitoramento",
    numero: "3.9",
    titulo: "Art. 8º e 9º — Monitoramento e vigência",
    resumo:
      "Os indicadores devem ser analisados periodicamente pela SME e pelas unidades escolares, para revisão de estratégias; a normativa entra em vigor na data de publicação.",
    perguntas: [
      {
        id: "q12",
        texto:
          "A periodicidade e a forma de análise dos indicadores (Art. 8º) estão claras? Que mecanismo de retorno (devolutiva) à escola deveria ser incluído neste trecho?",
        campo: "inclusoes",
      },
    ],
  },
  {
    id: "territorio",
    numero: "4",
    titulo: "Pergunta norteadora e especificidades do território",
    resumo:
      "Questão oficial do roteiro da SME para o Planejamento Integrado, respondida de forma consolidada por toda a equipe.",
    perguntas: [
      {
        id: "norteadora",
        texto:
          "Quais aspectos são necessários para que a política de alfabetização de Duque de Caxias contribua com o trabalho docente e considere as especificidades do território?",
        campo: "comentarios",
        destaque: true,
      },
      {
        id: "q13",
        texto:
          "Especificamente sobre o território desta unidade — referência em educação inclusiva no município —, que especificidade você considera que a minuta ainda não reconhece de forma adequada?",
        campo: "comentarios",
      },
    ],
  },
];

export const TOTAL_PERGUNTAS = EIXOS.reduce((acc, e) => acc + e.perguntas.length, 0);
