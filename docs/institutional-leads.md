# Leads institucionais

O formulário de `/para-instituicoes` possui interface, validação e um adaptador
REST tipado em `src/services/institutionalLeadService.ts`.

O backend previsto é o projeto Supabase `tkmipaleoflqsmyadaqs`. A migration em
`supabase/migrations/20260728171000_create_institutional_leads.sql` cria a tabela,
valida os dados no banco e habilita RLS. O papel anônimo recebe somente `INSERT`;
não existe política pública de leitura, atualização ou exclusão.

Variáveis necessárias:

- `VITE_SUPABASE_URL`;
- `VITE_SUPABASE_ANON_KEY`.

Somente a chave pública `anon` pode ser usada. Uma service role key nunca deve
ser exposta no frontend. Sem as variáveis, o adaptador interrompe o envio, informa
que nenhum dado foi transmitido e preserva os valores digitados.

Os eventos do GA4 recebem somente identificadores de produto, público, página,
tipo de solução e estado do formulário. Nome, instituição, e-mail, telefone,
cidade e mensagem não são enviados ao analytics.
