-- Executar no SQL Editor do projeto Supabase criado para esta plataforma

create table if not exists respostas_pmadc (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nome text,
  segmento text,
  leu_minuta text,
  respostas jsonb,
  sintese_alteracoes text,
  sintese_exclusoes text,
  sintese_inclusoes text,
  sintese_comentarios text
);

alter table respostas_pmadc enable row level security;

-- Permite que qualquer professor (sem login) envie sua resposta
create policy "insercao_publica_respostas_pmadc"
  on respostas_pmadc for insert
  to anon
  with check (true);

-- Permite que o painel (protegido por senha no próprio app) leia as respostas
create policy "leitura_publica_respostas_pmadc"
  on respostas_pmadc for select
  to anon
  using (true);
