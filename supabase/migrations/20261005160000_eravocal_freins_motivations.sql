-- Freins et motivations du prospect, alimentés par l'agent WhatsApp (après validation) et modifiables dans l'app.
alter table eravocal.acheteurs
  add column freins text[] not null default '{}',
  add column motivations text[] not null default '{}';

-- Démo : l'app (clé anon) ne peut modifier que ces deux colonnes.
grant update (freins, motivations) on eravocal.acheteurs to anon;

create policy "anon_update_acheteurs" on eravocal.acheteurs
  for update to anon using (true) with check (true);
