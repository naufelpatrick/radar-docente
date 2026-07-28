export const privacyConfig = {
  projectName: 'PráxIA',
  controllerName: null,
  controllerDocument: null,
  controllerAddress: null,
  privacyEmail: 'praxia@radarpraxia.com',
  effectiveDate: '28 de julho de 2026',
  lastUpdated: '28 de julho de 2026',
  retentionPeriods: {
    contact: null,
    mentoring: null,
    institutional: null,
    securityLogs: null,
  },
  serviceProviders: [
    {
      name: 'Supabase',
      purpose: 'Banco de dados dos formulários e controle de acesso aos registros',
      data: 'Dados enviados nos formulários de contato, mentoria e proposta institucional',
      privacyUrl: 'https://supabase.com/privacy',
      internationalProcessing: true,
    },
    {
      name: 'Vercel',
      purpose: 'Hospedagem e entrega da aplicação',
      data: 'Dados técnicos de acesso que podem constar em logs de infraestrutura',
      privacyUrl: 'https://vercel.com/legal/privacy-policy',
      internationalProcessing: true,
    },
    {
      name: 'Google Analytics',
      purpose: 'Medição opcional de uso e desempenho do site',
      data: 'Eventos de navegação e parâmetros comerciais não identificadores, somente após autorização',
      privacyUrl: 'https://policies.google.com/privacy',
      internationalProcessing: true,
    },
    {
      name: 'ASAAS',
      purpose: 'Processamento do pagamento do e-book e confirmação da compra',
      data: 'Dados de identificação, contato e pagamento informados no checkout',
      privacyUrl: 'https://www.asaas.com/privacidade',
      internationalProcessing: false,
    },
  ],
} as const

export const privacyPublicationStatus = {
  definitive: false,
  pending: [
    'definição formal do controlador e seus dados de identificação',
    'aprovação dos períodos de retenção dos leads e logs',
    'revisão jurídica do texto e das bases legais',
  ],
} as const
