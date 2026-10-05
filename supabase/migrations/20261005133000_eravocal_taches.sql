-- Tâches : plusieurs par acheteur, échéance au jour, statut. La table garde son nom rappels.
alter table eravocal.rappels drop constraint rappels_acheteur_id_key;

alter table eravocal.rappels
  add column echeance date,
  add column statut text not null default 'a_faire'
    check (statut in ('a_faire', 'terminee', 'annulee')),
  add column canal text check (canal in ('appel', 'whatsapp', 'email')),
  add column contexte text,
  add column message_suggere text,
  add column termine_le timestamptz;

update eravocal.rappels
  set echeance = (created_at at time zone 'Europe/Paris')::date
  where echeance is null;

-- Valeur par défaut tant que le workflow n8n n'envoie pas encore l'échéance
alter table eravocal.rappels
  alter column echeance set default (now() at time zone 'Europe/Paris')::date,
  alter column echeance set not null;

create index rappels_acheteur_statut_echeance_idx
  on eravocal.rappels (acheteur_id, statut, echeance);

-- Démo : l'app peut terminer, annuler, reporter et réécrire une tâche, pas en créer ni en supprimer.
grant update (statut, echeance, texte, contexte, termine_le) on eravocal.rappels to anon;
create policy "anon_update_rappels" on eravocal.rappels
  for update to anon using (true) with check (true);

alter publication supabase_realtime add table eravocal.rappels;
