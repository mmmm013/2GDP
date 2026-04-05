-- Reconcile donation protocol schema for checkout + webhook flows.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.gpm_gift_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tier TEXT NOT NULL CHECK (tier IN ('tap', 'double_tap', 'long_press', 'hold_heart')),
  asset_type TEXT NOT NULL CHECK (asset_type IN ('sticker', 'ringtone', 'wallpaper', 'voice_note', 'mini_mix', 'unreleased_clip', 'merch_code', 'studio_pass')),
  asset_name TEXT NOT NULL,
  asset_url TEXT,
  description TEXT,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'legendary')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gpm_donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  amount_cents INTEGER NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('tap', 'double_tap', 'long_press', 'hold_heart')),
  gift_asset_id UUID REFERENCES public.gpm_gift_assets(id),
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  grand_prize_eligible BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.gpm_tier_config (
  tier TEXT PRIMARY KEY CHECK (tier IN ('tap', 'double_tap', 'long_press', 'hold_heart')),
  display_name TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  label TEXT NOT NULL,
  emoji TEXT,
  sms_message_template TEXT,
  grand_prize_entries INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donations_tier ON public.gpm_donations(tier);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.gpm_donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created ON public.gpm_donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_grand_prize ON public.gpm_donations(grand_prize_eligible) WHERE grand_prize_eligible = true;
CREATE INDEX IF NOT EXISTS idx_gift_assets_tier ON public.gpm_gift_assets(tier);
CREATE INDEX IF NOT EXISTS idx_gift_assets_active ON public.gpm_gift_assets(is_active) WHERE is_active = true;

ALTER TABLE public.gpm_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpm_gift_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpm_tier_config ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'gpm_tier_config' AND policyname = 'Public can view tier config'
  ) THEN
    CREATE POLICY "Public can view tier config" ON public.gpm_tier_config FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'gpm_gift_assets' AND policyname = 'Public can view active gift assets'
  ) THEN
    CREATE POLICY "Public can view active gift assets" ON public.gpm_gift_assets FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'gpm_donations' AND policyname = 'Service role manages donations'
  ) THEN
    CREATE POLICY "Service role manages donations" ON public.gpm_donations FOR ALL USING (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'gpm_gift_assets' AND policyname = 'Service role manages gift assets'
  ) THEN
    CREATE POLICY "Service role manages gift assets" ON public.gpm_gift_assets FOR ALL USING (auth.role() = 'service_role');
  END IF;
END
$$;

INSERT INTO public.gpm_tier_config (tier, display_name, amount_cents, label, emoji, sms_message_template, grand_prize_entries)
VALUES
  ('tap', 'Tap', 199, '$1.99 - Quick Tap', '\u2764\uFE0F', 'Thanks for the tap! Your Digital Mixed Bag is ready: {link}', 0),
  ('double_tap', 'Double Tap', 499, '$4.99 - Double Tap', '\uD83E\uDDE1', 'Double love! Your Mixed Bag has something special: {link}', 1),
  ('long_press', 'Long Press', 999, '$9.99 - Long Press', '\uD83D\uDC9C', 'You held on! Your premium Mixed Bag is loaded: {link}', 3),
  ('hold_heart', 'Hold Heart', 2499, '$24.99 - Hold My Heart', '\uD83D\uDC96', 'You are legendary! Your exclusive Mixed Bag + 10 grand prize entries: {link}', 10)
ON CONFLICT (tier) DO UPDATE
SET
  display_name = EXCLUDED.display_name,
  amount_cents = EXCLUDED.amount_cents,
  label = EXCLUDED.label,
  emoji = EXCLUDED.emoji,
  sms_message_template = EXCLUDED.sms_message_template,
  grand_prize_entries = EXCLUDED.grand_prize_entries,
  updated_at = now();

NOTIFY pgrst, 'reload schema';
