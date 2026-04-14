-- Mietvertragsdaten: auf dem Mietverhältnis, damit sie für Mietvertrag,
-- Kautionsbescheinigung und Nebenkostenabrechnung wiederverwendet werden können.

ALTER TABLE public.tenancies
  ADD COLUMN IF NOT EXISTS rent_cold            numeric(10,2),
  ADD COLUMN IF NOT EXISTS utilities            numeric(10,2),
  ADD COLUMN IF NOT EXISTS deposit              numeric(10,2),
  ADD COLUMN IF NOT EXISTS sqm                  numeric(6,2),
  ADD COLUMN IF NOT EXISTS rooms                numeric(3,1),
  ADD COLUMN IF NOT EXISTS floor                text,
  ADD COLUMN IF NOT EXISTS contract_duration    text DEFAULT 'unbefristet',
  ADD COLUMN IF NOT EXISTS contract_end_date    date,
  ADD COLUMN IF NOT EXISTS notice_period_months int DEFAULT 3,
  ADD COLUMN IF NOT EXISTS rent_due_day         int DEFAULT 3;
