import type { DimensionId } from '../types/instrument'
import type { DevelopmentPlan, DimensionInterpretation, ScoreBandId, TeachingImplication } from '../types/result'

export const generalBandInterpretations: Record<ScoreBandId, string> = {
  initiation: 'Seu resultado sugere que critérios e repertórios digitais ainda estão sendo construídos. Pequenos experimentos, acompanhados de observação e revisão, podem ajudar a transformar intenção em prática segura.',
  exploration: 'Seu resultado sugere experiências digitais já presentes, embora ainda dependentes do contexto. O próximo avanço pode estar em tornar explícitos os critérios usados para escolher, acompanhar e revisar essas práticas.',
  integration: 'Seu resultado sugere uso intencional de recursos digitais e IA em diferentes momentos da docência. Há indícios de consistência; o próximo avanço pode estar em conectar melhor decisões, evidências e revisão pedagógica.',
  transformation: 'Seu resultado sugere práticas digitais sistemáticas, críticas e autorais. O próximo avanço pode estar em sustentar essa qualidade em contextos diversos e compartilhar os critérios que tornam essas experiências significativas.',
}

const interpretation = (
  evaluates: string,
  suggests: string,
  inPractice: string,
  impact: string,
  practiceToMaintain: string,
  actionToAdvance: string,
): DimensionInterpretation => ({ evaluates, suggests, inPractice, impact, practiceToMaintain, actionToAdvance })

export const dimensionInterpretations: Record<DimensionId, Record<ScoreBandId, DimensionInterpretation>> = {
  planning_curation: {
    initiation: interpretation(
      'Como objetivos, fontes, contexto e acessibilidade orientam a escolha de recursos.',
      'Os critérios de seleção podem estar em fase inicial de explicitação.',
      'Isso pode aparecer na escolha de um recurso pela disponibilidade ou aparência, antes de comparar sua contribuição ao objetivo.',
      'Tornar os critérios visíveis pode reduzir dispersões e aproximar o recurso da aprendizagem pretendida.',
      'A disposição para buscar recursos adequados à atividade.',
      'Antes da próxima escolha, registre o objetivo e confira autoria, atualidade e acessibilidade.',
    ),
    exploration: interpretation(
      'Como objetivos, fontes, contexto e acessibilidade orientam a escolha de recursos.',
      'Há indícios de comparação e adaptação, ainda de forma variável.',
      'Você pode verificar fontes em algumas atividades, mas recorrer a decisões mais rápidas quando há pouco tempo.',
      'Uma rotina curta de curadoria tende a aumentar coerência e confiança no material utilizado.',
      'A comparação de alternativas quando a situação permite.',
      'Use uma lista de três critérios para comparar dois recursos antes de decidir.',
    ),
    integration: interpretation(
      'Como objetivos, fontes, contexto e acessibilidade orientam a escolha de recursos.',
      'Objetivos e critérios tendem a orientar escolhas com consistência.',
      'Isso pode aparecer em materiais adaptados ao contexto e revisados antes de chegar aos estudantes.',
      'A intencionalidade pode melhorar o foco da atividade e reduzir barreiras de participação.',
      'A revisão pedagógica e contextual dos recursos selecionados.',
      'Registre por que o recurso escolhido acrescenta valor e qual alternativa foi descartada.',
    ),
    transformation: interpretation(
      'Como objetivos, fontes, contexto e acessibilidade orientam a escolha de recursos.',
      'A curadoria tende a ser crítica, sistemática e sensível ao contexto.',
      'Isso pode aparecer em repertórios comparados, adaptados, acessíveis e revistos com base em evidências.',
      'Critérios compartilhados podem ampliar autonomia docente e discente nas escolhas digitais.',
      'A articulação entre qualidade da fonte, propósito e inclusão.',
      'Convide os estudantes a aplicar e justificar os mesmos critérios de curadoria.',
    ),
  },
  experience_creation: {
    initiation: interpretation(
      'Como a tecnologia apoia investigação, decisão, produção e diferentes formas de participação.',
      'O uso pode estar mais concentrado em apresentar ou distribuir conteúdos.',
      'Isso pode aparecer em atividades digitais nas quais os estudantes recebem informações, mas tomam poucas decisões.',
      'Abrir uma escolha significativa pode aumentar participação e tornar o pensamento mais observável.',
      'O uso de recursos digitais para ampliar o acesso ao conteúdo.',
      'Transforme uma etapa de consumo em uma pequena produção ou decisão justificada.',
    ),
    exploration: interpretation(
      'Como a tecnologia apoia investigação, decisão, produção e diferentes formas de participação.',
      'Há experimentos ativos, mas sua frequência e desenho podem variar.',
      'Algumas propostas podem envolver produção, enquanto outras ainda reproduzem formatos expositivos.',
      'Explicitar o que o estudante fará com a tecnologia tende a fortalecer protagonismo e compreensão.',
      'As experiências em que os estudantes já produzem ou investigam.',
      'Adapte uma atividade para oferecer duas formas de participação ou expressão.',
    ),
    integration: interpretation(
      'Como a tecnologia apoia investigação, decisão, produção e diferentes formas de participação.',
      'A tecnologia tende a apoiar experiências ativas e alinhadas aos objetivos.',
      'Isso pode aparecer em atividades de investigação, criação e justificativa com alternativas de participação.',
      'A variedade de ações pode ampliar autoria e tornar a aprendizagem mais significativa.',
      'O desenho de experiências em que estudantes fazem escolhas.',
      'Teste antecipadamente uma barreira possível e prepare uma via alternativa de participação.',
    ),
    transformation: interpretation(
      'Como a tecnologia apoia investigação, decisão, produção e diferentes formas de participação.',
      'As experiências tendem a ser autorais, inclusivas e continuamente aprimoradas.',
      'Isso pode aparecer em percursos flexíveis nos quais estudantes investigam, criam, revisam e justificam decisões.',
      'Esse desenho pode favorecer agência, colaboração e transferência da aprendizagem.',
      'A combinação entre desafio cognitivo, autoria e acessibilidade.',
      'Inclua os estudantes na revisão dos critérios e do desenho da experiência.',
    ),
  },
  mediation_collaboration: {
    initiation: interpretation(
      'Como interações digitais são orientadas, acompanhadas e transformadas em aprendizagem.',
      'A mediação pode acontecer sobretudo quando uma dificuldade já se tornou visível.',
      'Isso pode aparecer em orientações gerais, com pouca definição de papéis ou momentos de acompanhamento.',
      'Combinar expectativas e pontos de checagem pode ampliar participação e reduzir concentração de decisões.',
      'A disponibilidade para intervir quando surgem dúvidas.',
      'Defina papéis e um momento breve de acompanhamento na próxima colaboração.',
    ),
    exploration: interpretation(
      'Como interações digitais são orientadas, acompanhadas e transformadas em aprendizagem.',
      'Há acompanhamento e acordos, embora ainda possam variar entre atividades.',
      'Você pode redistribuir tarefas quando percebe desequilíbrio, mas sem critérios estáveis de colaboração.',
      'Critérios simples tendem a tornar contribuições mais visíveis e o apoio mais oportuno.',
      'A atenção a estudantes ou grupos que precisam de apoio.',
      'Combine dois critérios de colaboração e faça uma checagem no meio da atividade.',
    ),
    integration: interpretation(
      'Como interações digitais são orientadas, acompanhadas e transformadas em aprendizagem.',
      'A mediação tende a articular papéis, critérios e evidências de participação.',
      'Isso pode aparecer em intervenções durante o processo e em oportunidades estruturadas de revisão entre pares.',
      'O acompanhamento pode melhorar qualidade das trocas, pertencimento e responsabilidade compartilhada.',
      'O uso de evidências qualitativas para orientar intervenções.',
      'Peça a cada grupo uma evidência de decisão coletiva e use-a para orientar feedback.',
    ),
    transformation: interpretation(
      'Como interações digitais são orientadas, acompanhadas e transformadas em aprendizagem.',
      'A colaboração tende a ser desenhada como objeto e meio de aprendizagem.',
      'Isso pode aparecer em acordos construídos com a turma, múltiplas formas de contribuição e autorregulação dos grupos.',
      'A participação pode se tornar mais equitativa, consciente e transferível para novos contextos.',
      'A mediação responsiva e a construção compartilhada de critérios.',
      'Convide os grupos a analisar o próprio processo e propor um ajuste para a próxima colaboração.',
    ),
  },
  assessment_feedback: {
    initiation: interpretation(
      'Como evidências digitais apoiam avaliação, feedback e ajustes no ensino.',
      'A leitura da aprendizagem pode estar mais apoiada em respostas finais ou notas.',
      'Isso pode aparecer em correções que informam o resultado, mas oferecem pouca orientação sobre o próximo passo.',
      'Reunir outra evidência e formular um encaminhamento pode tornar o feedback mais acionável.',
      'O registro digital das produções e resultados dos estudantes.',
      'Escolha uma produção e indique conquista, revisão necessária e próximo passo.',
    ),
    exploration: interpretation(
      'Como evidências digitais apoiam avaliação, feedback e ajustes no ensino.',
      'Há uso de evidências e devolutivas, ainda com consistência variável.',
      'Alguns feedbacks podem orientar revisão, enquanto outros permanecem concentrados em correção.',
      'Uma estrutura estável pode ajudar estudantes a compreender e utilizar a devolutiva.',
      'As situações em que o feedback já indica caminhos de melhoria.',
      'Compare duas evidências antes de ajustar uma explicação ou atividade.',
    ),
    integration: interpretation(
      'Como evidências digitais apoiam avaliação, feedback e ajustes no ensino.',
      'Evidências diversas tendem a orientar feedbacks e decisões pedagógicas.',
      'Isso pode aparecer em devolutivas revisadas, contextualizadas e conectadas à trajetória do estudante.',
      'O ciclo entre evidência, feedback e ajuste pode favorecer autorregulação e progressão.',
      'A supervisão docente sobre feedbacks apoiados por tecnologia ou IA.',
      'Peça ao estudante que use o feedback para registrar uma revisão concreta.',
    ),
    transformation: interpretation(
      'Como evidências digitais apoiam avaliação, feedback e ajustes no ensino.',
      'A avaliação tende a funcionar como ciclo contínuo, transparente e participativo.',
      'Isso pode aparecer em múltiplas evidências, critérios compartilhados e possibilidade de revisão ou contestação.',
      'Esse processo pode fortalecer agência, justiça avaliativa e decisões pedagógicas mais responsivas.',
      'A integração entre evidências, devolutiva, revisão e replanejamento.',
      'Inclua os estudantes na análise da utilidade do feedback e refine o processo com eles.',
    ),
  },
  ai_pedagogical_integration: {
    initiation: interpretation(
      'Como objetivos e supervisão pedagógica orientam quando e como utilizar IA.',
      'O repertório para decidir sobre IA pode estar em construção.',
      'Isso pode aparecer em testes de ferramentas antes de explicitar o objetivo ou verificar seus resultados.',
      'Começar pelo propósito pode evitar uso decorativo e preservar decisões pedagógicas importantes.',
      'A curiosidade para conhecer possibilidades e limites da IA.',
      'Escolha uma tarefa e registre primeiro por que a IA ajudaria — ou por que não deveria entrar.',
    ),
    exploration: interpretation(
      'Como objetivos e supervisão pedagógica orientam quando e como utilizar IA.',
      'Há experimentação e verificação, ainda dependentes da situação.',
      'Você pode refinar comandos e revisar respostas em algumas tarefas, mas aceitar atalhos em outras.',
      'Uma rotina de propósito, comparação e verificação tende a aumentar qualidade e intencionalidade.',
      'A revisão de respostas antes de utilizá-las pedagogicamente.',
      'Compare duas respostas de IA usando três critérios definidos antes da consulta.',
    ),
    integration: interpretation(
      'Como objetivos e supervisão pedagógica orientam quando e como utilizar IA.',
      'O uso tende a ser intencional, verificado e subordinado à aprendizagem.',
      'Isso pode aparecer em decisões conscientes de usar ou não usar IA e em registros das alterações realizadas.',
      'A supervisão pode preservar autoria, qualidade e coerência com os objetivos.',
      'A definição do propósito antes da escolha da ferramenta.',
      'Torne visíveis para os estudantes os critérios usados para aceitar, alterar ou rejeitar uma resposta.',
    ),
    transformation: interpretation(
      'Como objetivos e supervisão pedagógica orientam quando e como utilizar IA.',
      'A integração tende a ser crítica, autoral e transparente.',
      'Isso pode aparecer em tarefas que problematizam limites, vieses e escolhas, preservando etapas de autoria humana.',
      'A IA pode se tornar objeto de aprendizagem crítica, não apenas instrumento de produtividade.',
      'A combinação entre propósito, verificação, autoria e decisão de não usar.',
      'Desenhe com a turma um protocolo de uso responsável para uma atividade real.',
    ),
  },
  ethics_safety_authorship: {
    initiation: interpretation(
      'Como privacidade, vieses, transparência, autoria e supervisão humana orientam decisões.',
      'Critérios de proteção e autoria podem precisar de maior explicitação.',
      'Isso pode aparecer no envio de dados identificáveis ou em regras pouco claras sobre participação da IA.',
      'Uma pausa para revisar dados, riscos e autoria pode proteger pessoas e tornar expectativas mais justas.',
      'A preocupação em utilizar recursos úteis para apoiar a aprendizagem.',
      'Remova dados desnecessários e explicite a regra de autoria antes da próxima atividade.',
    ),
    exploration: interpretation(
      'Como privacidade, vieses, transparência, autoria e supervisão humana orientam decisões.',
      'Há cuidados presentes, embora possam variar conforme a ferramenta ou urgência.',
      'Você pode anonimizar materiais, mas ainda não verificar finalidade, retenção ou vieses de forma sistemática.',
      'Um protocolo curto tende a tornar proteção, transparência e autoria mais consistentes.',
      'A atenção inicial a nomes, dados sensíveis e atribuição.',
      'Revise política de dados, necessidade da coleta e como o uso de IA será comunicado.',
    ),
    integration: interpretation(
      'Como privacidade, vieses, transparência, autoria e supervisão humana orientam decisões.',
      'Critérios éticos tendem a orientar escolhas e comunicação com consistência.',
      'Isso pode aparecer em dados minimizados, resultados revisados e regras claras de citação e autoria.',
      'Essas práticas podem ampliar confiança, segurança e responsabilidade no ambiente educativo.',
      'A supervisão humana e a transparência sobre participação da IA.',
      'Inclua uma verificação explícita de vieses e uma forma de revisão ou contestação.',
    ),
    transformation: interpretation(
      'Como privacidade, vieses, transparência, autoria e supervisão humana orientam decisões.',
      'A ética tende a integrar desenho, escolha, comunicação e revisão das práticas.',
      'Isso pode aparecer na preferência por menor coleta, avaliação de riscos e discussão crítica com os estudantes.',
      'A abordagem pode fortalecer cidadania digital, confiança e autoria consciente.',
      'A antecipação de riscos combinada à participação informada dos envolvidos.',
      'Construa com a turma critérios transferíveis para avaliar uma nova ferramenta ou situação.',
    ),
  },
}

export const teachingImplications: Record<DimensionId, TeachingImplication> = {
  planning_curation: { title: 'Escolhas com propósito', manifestation: 'Seu resultado sugere que a seleção de recursos pode refletir o grau de explicitação dos objetivos e critérios.', impact: 'Quando essa conexão fica visível, a atividade tende a ganhar foco e reduzir barreiras.' },
  experience_creation: { title: 'Participação e autoria', manifestation: 'Isso pode aparecer no espaço oferecido para investigar, decidir, produzir e justificar escolhas.', impact: 'Experiências mais ativas podem ampliar engajamento cognitivo e tornar o pensamento observável.' },
  mediation_collaboration: { title: 'Interações acompanhadas', manifestation: 'Seu resultado pode se manifestar nos acordos, papéis e intervenções durante atividades colaborativas.', impact: 'Mediação oportuna tende a favorecer participação mais equitativa e trocas de melhor qualidade.' },
  assessment_feedback: { title: 'Evidências que orientam', manifestation: 'Isso pode aparecer na variedade de evidências reunidas e na clareza do próximo passo indicado pelo feedback.', impact: 'Devolutivas acionáveis podem apoiar revisão, autorregulação e replanejamento docente.' },
  ai_pedagogical_integration: { title: 'IA subordinada à aprendizagem', manifestation: 'Seu resultado sugere diferentes graus de intenção, verificação e decisão consciente de usar ou não usar IA.', impact: 'Critérios pedagógicos podem preservar autoria e evitar que a ferramenta substitua decisões essenciais.' },
  ethics_safety_authorship: { title: 'Confiança e responsabilidade', manifestation: 'Isso pode aparecer no cuidado com dados, transparência, vieses, citação e supervisão humana.', impact: 'Critérios éticos consistentes podem tornar o ambiente mais seguro, justo e confiável.' },
}

export const developmentPlans: Record<DimensionId, Omit<DevelopmentPlan, 'dimensionId' | 'whyPrioritized'>> = {
  planning_curation: { objective: 'Aproximar cada escolha digital do objetivo e do contexto da turma.', nextActivityAction: 'Compare dois recursos antes da próxima atividade e registre por que escolheu um deles.', criteria: ['contribui diretamente para o objetivo', 'tem fonte e atualização verificáveis', 'é acessível ao contexto dos estudantes'], observableEvidence: 'Uma justificativa curta da escolha e uma adaptação feita no recurso.', preparationTime: '15–20 minutos', reflection: 'O recurso ampliou a aprendizagem ou apenas substituiu uma estratégia que já funcionava?' },
  experience_creation: { objective: 'Ampliar decisão, produção e participação dos estudantes.', nextActivityAction: 'Transforme uma etapa de consumo em uma pequena produção ou escolha justificada.', criteria: ['a ação está ligada ao objetivo', 'há mais de uma forma possível de participar', 'o produto torna o raciocínio observável'], observableEvidence: 'Produções ou justificativas que revelem escolhas dos estudantes.', preparationTime: '20–30 minutos', reflection: 'Que decisão dos estudantes produziu a evidência de aprendizagem mais útil?' },
  mediation_collaboration: { objective: 'Tornar participação e acompanhamento mais intencionais.', nextActivityAction: 'Defina papéis, dois critérios de colaboração e um ponto de checagem intermediário.', criteria: ['cada pessoa tem uma contribuição possível', 'os critérios são compreensíveis', 'a checagem permite ajustar o processo'], observableEvidence: 'Registro de uma decisão coletiva e de um ajuste feito durante a atividade.', preparationTime: '15–20 minutos', reflection: 'Quem conseguiu participar melhor e que barreira ainda permaneceu?' },
  assessment_feedback: { objective: 'Transformar evidências em devolutivas que orientem ação.', nextActivityAction: 'Use duas evidências para oferecer um feedback com conquista, revisão e próximo passo.', criteria: ['o feedback se apoia em evidências', 'a orientação é específica', 'o estudante pode agir a partir dela'], observableEvidence: 'Uma revisão realizada pelo estudante com base na devolutiva.', preparationTime: '20–30 minutos', reflection: 'Qual parte do feedback realmente ajudou o estudante a revisar sua produção?' },
  ai_pedagogical_integration: { objective: 'Usar IA somente quando houver contribuição pedagógica verificável.', nextActivityAction: 'Escolha uma tarefa e registre objetivo, papel da IA e critérios para revisar sua resposta.', criteria: ['o objetivo vem antes da ferramenta', 'a saída será verificada', 'a autoria e a decisão final permanecem humanas'], observableEvidence: 'Registro do que foi aceito, alterado ou rejeitado na resposta da IA.', preparationTime: '15–25 minutos', reflection: 'O que a IA tornou possível — e o que precisou continuar sob decisão humana?' },
  ethics_safety_authorship: { objective: 'Fortalecer proteção, transparência e autoria antes de ampliar o uso.', nextActivityAction: 'Faça uma revisão prévia de dados, riscos e regras de autoria da próxima atividade digital.', criteria: ['nenhum dado desnecessário será enviado', 'o uso de IA será comunicado', 'há supervisão e possibilidade de revisão'], observableEvidence: 'Um protocolo curto compartilhado com a turma antes da atividade.', preparationTime: '15–20 minutos', reflection: 'Que risco foi reduzido e qual decisão ficou mais transparente para os envolvidos?' },
}

export const reflectionQuestions: Record<DimensionId, string> = {
  planning_curation: 'Em quais momentos a tecnologia amplia efetivamente a aprendizagem — e em quais apenas substitui uma atividade que você já realizava?',
  experience_creation: 'Que escolha ou produção permitiria aos estudantes tornar visível um pensamento que hoje permanece oculto?',
  mediation_collaboration: 'Que evidência ajudaria você a perceber, durante a atividade, quem participa, quem decide e quem ainda precisa de apoio?',
  assessment_feedback: 'O que o estudante conseguirá fazer de diferente depois de receber sua devolutiva?',
  ai_pedagogical_integration: 'Qual decisão pedagógica precisa continuar sendo humana, mesmo quando a IA participa do processo?',
  ethics_safety_authorship: 'Que dados, autoria ou riscos precisam ser explicados antes que esta experiência digital seja considerada responsável?',
}
