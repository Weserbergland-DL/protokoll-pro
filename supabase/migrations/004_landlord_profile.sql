-- Add landlord profile fields to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS street        text,
  ADD COLUMN IF NOT EXISTS house_number  text,
  ADD COLUMN IF NOT EXISTS zip_code      text,
  ADD COLUMN IF NOT EXISTS city          text,
  ADD COLUMN IF NOT EXISTS phone         text,
  ADD COLUMN IF NOT EXISTS email_contact text,
  ADD COLUMN IF NOT EXISTS iban          text,
  ADD COLUMN IF NOT EXISTS bank_name     text;
