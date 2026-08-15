# Funil do Radar PraxIA no GA4

O rastreamento usa `src/services/radarFunnelAnalytics.ts`, respeita a preferência analítica da Política de Cookies e não envia dados pessoais, respostas individuais, identificadores do banco ou score numérico.

## Eventos

| Evento | Disparo | Parâmetros específicos |
| --- | --- | --- |
| `radar_landing_view` | Primeira visualização de `/radar` por tentativa | `page_path`, origem de tráfego quando disponível |
| `radar_start_click` | Clique em Continuar na introdução | `cta_id`, `cta_location` |
| `radar_consent_accepted` | Aceite da participação e avanço | nenhum dado do texto aceito |
| `radar_profile_started` | Primeira seleção do perfil | nenhum dado pessoal |
| `radar_profile_complete` | Perfil obrigatório validado | `education_level` |
| `radar_questionnaire_started` | Primeira questão exibida | `total_questions` |
| `radar_progress` | Questões 1, 10, 20 e 30 exibidas | `question_number`, `total_questions`, `progress_percent` |
| `radar_abandon` | Retomada após tentativa inativa por mais de 30 minutos | `last_step`, `last_question`, `progress_percent` |
| `radar_complete` | Lead salvo no Supabase e relatório montado | `total_questions`, `completion_time_seconds`, `score_range`, `source` |
| `radar_result_view` | Resultado autorizado efetivamente montado | `total_questions` |

Todos incluem, quando disponíveis: `funnel_version`, `page_path`, `device_type`, `traffic_source`, `traffic_medium` e `traffic_campaign`.

## Deduplicação e abandono

Cada evento recebe uma chave interna anônima baseada no início da tentativa. Ela existe apenas no armazenamento local e não é enviada ao GA4. Os marcos permanecem enviados mesmo quando o professor volta às perguntas. Uma tentativa é considerada abandonada quando o navegador volta ao Radar após mais de 30 minutos de inatividade. Se a pessoa nunca retornar, o navegador não tem uma oportunidade segura de enviar esse evento; por isso `radar_abandon` deve ser interpretado como abandono observado, não como total absoluto.

## DebugView

1. Autorize cookies de medição no site de teste.
2. Ative o modo de depuração pelo Google Tag Assistant ou execute o fluxo em um navegador conectado ao DebugView.
3. Em **Administrador → DebugView**, acompanhe os eventos na ordem do fluxo.
4. Abra cada evento e confira os parâmetros; nome, e-mail, telefone, instituição, respostas e score numérico nunca devem aparecer.
5. Recarregue e volte às questões 1, 10, 20 e 30 para confirmar que os marcos não se repetem.

## Exploração de funil

Em **Explorar → Exploração de funil**, crie um funil aberto com:

1. `radar_landing_view`
2. `radar_start_click`
3. `radar_consent_accepted`
4. `radar_profile_complete`
5. `radar_questionnaire_started`
6. `radar_progress`, filtro `question_number = 10`
7. `radar_progress`, filtro `question_number = 20`
8. `radar_complete`
9. `radar_result_view`

Marque `radar_complete` como evento principal. `radar_start_click` e `radar_profile_complete` são etapas secundárias de análise e não precisam ser marcadas como conversões.

## Configuração manual no GA4

Crie dimensões personalizadas de escopo **Evento** para: `funnel_version`, `page_path`, `device_type`, `traffic_source`, `traffic_medium`, `traffic_campaign`, `cta_id`, `cta_location`, `education_level`, `question_number`, `total_questions`, `progress_percent`, `last_step`, `last_question`, `completion_time_seconds` e `score_range`. A conversão `radar_complete` já existente deve ser preservada.
