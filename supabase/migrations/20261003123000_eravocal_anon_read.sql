-- Démo : lecture seule pour la clé anon sur trois tables du schéma eravocal.
grant usage on schema eravocal to anon;

grant select on eravocal.acheteurs to anon;
grant select on eravocal.rappels to anon;
grant select on eravocal.debriefs to anon;

create policy "anon_select_acheteurs" on eravocal.acheteurs
  for select to anon using (true);
create policy "anon_select_rappels" on eravocal.rappels
  for select to anon using (true);
create policy "anon_select_debriefs" on eravocal.debriefs
  for select to anon using (true);
