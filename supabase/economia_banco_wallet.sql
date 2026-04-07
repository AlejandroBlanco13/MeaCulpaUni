-- =============================================================================
-- Economía / banco medieval — compatibilidad con app/api/economia/*
-- =============================================================================
-- La tabla public.wallet_transactions (ver schema.sql) ya incluye:
--   amount int NOT NULL        → permite 0 (p. ej. solicitudes sin movimiento)
--   type text NOT NULL         → sin restricción ENUM; admite los tipos nuevos
--   reference_id text NULL     → opcional para motivos/origen
--
-- No es obligatorio ejecutar este script si tu base ya está creada con schema.sql;
-- úsalo para mejorar rendimiento y documentar tipos en Supabase (SQL Editor).
-- =============================================================================

-- Listados por usuario ordenados por fecha (página economía / libro mayor)
create index if not exists wallet_transactions_user_created_idx
  on public.wallet_transactions (user_id, created_at desc);

-- Filtrado por tipo (deuda, depósitos, préstamos, etc.)
create index if not exists wallet_transactions_user_type_idx
  on public.wallet_transactions (user_id, type);

comment on column public.wallet_transactions.type is
  'Tipos usados por la app: purchase (mercado); bank_deposit; bank_loan_disbursed; '
  'bank_loan_repayment; bank_fund_request; external_match_income. Otros valores permitidos.';

comment on column public.wallet_transactions.reference_id is
  'Opcional: id de producto (purchase), texto de solicitud (bank_fund_request), origen partida (external_match_income).';

-- Verificación rápida (opcional): conteos por tipo para un usuario
-- select type, count(*), sum(amount) from wallet_transactions where user_id = '...' group by type;
