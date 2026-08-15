# Inscrição paga — Workshop IA para Prática Docente

## Rotas

- `/lp/workshop-ia-2026` continua sendo a landing page original da lista de interesse.
- `/lp/workshop-ia-2026/inscricoes` é a nova landing page de inscrição paga.
- `/lp/workshop-ia-2026/inscricoes/confirmacao` consulta o pagamento real e só mostra o Meet depois do webhook.

## Banco

A migration `20260812140000_create_workshop_registrations.sql` cria:

- `workshop_editions`: turmas configuráveis, com data, preço, acesso e status;
- `workshop_registrations`: inscrição, dados do participante, cobrança, presença e certificado;
- `workshop_webhook_events`: idempotência dos eventos ASAAS;
- a turma de 29/08/2026 por seed.

Todas as tabelas têm RLS forçada e não concedem acesso ao frontend. CPF, telefone, token e link do Meet são operados somente pelo backend.

## Pagamento e webhook

O checkout reutiliza `ASAAS_API_KEY`, `ASAAS_API_URL`, `ASAAS_WEBHOOK_TOKEN`, os helpers Supabase server-side e o endpoint existente `/api/webhooks/asaas`.

O backend procura ou cria o customer pelo CPF, cria uma cobrança `UNDEFINED` de R$ 50,00 e salva `asaas_payment_id`. O webhook trata `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, cancelamento, expiração e reembolso. Eventos repetidos não enviam e-mail novamente.

## E-mail

Não havia infraestrutura de e-mail no projeto. O envio transacional usa a API HTTPS do Resend e exige:

- `RESEND_API_KEY`;
- `WORKSHOP_EMAIL_FROM`, por padrão `PraxIA <praxia@radarpraxia.com.br>`.

O domínio remetente precisa estar verificado no Resend. O e-mail é enviado individualmente após o webhook e inclui Meet, Google Calendar, `.ics` e a página segura de confirmação.

## Teste manual

1. Aplicar a migration no Supabase.
2. Configurar as variáveis de ambiente no ambiente de preview/sandbox.
3. Usar `ASAAS_API_URL=https://api-sandbox.asaas.com/v3` e uma chave sandbox.
4. Abrir `/lp/workshop-ia-2026/inscricoes` e preencher nome, e-mail, CPF válido e telefone.
5. Concluir uma cobrança de teste no ASAAS.
6. Conferir o evento em Integrações → Webhook Logs e a atualização para `pago` em `workshop_registrations`.
7. Confirmar `confirmation_email_sent_at`, o recebimento do e-mail e o acesso liberado na página de confirmação.
8. Abrir o CTA do Google Calendar e baixar o `.ics` em Apple Calendar ou Outlook.

O webhook deve apontar diretamente para `https://www.radarpraxia.com/api/webhooks/asaas`, usar o mesmo token de `ASAAS_WEBHOOK_TOKEN` e receber ao menos `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED` e `PAYMENT_REFUNDED`.

Pagamento não emite certificado. A coluna `presenca` deve ser confirmada posteriormente; só então `certificado_id` deve ser associado a um certificado emitido.
