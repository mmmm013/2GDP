-- =============================================================
-- FLAGSHIP Idempotent Seed for gputnammusic.com
-- File: supabase/seed/flagship_seed.sql
-- Safe to re-run: all use ON CONFLICT / IF NOT EXISTS
-- =============================================================

DO $$
DECLARE
  t_id uuid;
  a_kleigh uuid;
  a_gp uuid;
BEGIN

  -- -------------------------------------------------------
  -- FLAGSHIP tenant
  -- -------------------------------------------------------
  INSERT INTO public.tenants (slug, name, domain)
  VALUES ('flagship', 'G Putnam Music / FLAGSHIP', 'gputnammusic.com')
  ON CONFLICT (slug) DO UPDATE
    SET name   = EXCLUDED.name,
        domain = EXCLUDED.domain,
        updated_at = now()
  RETURNING id INTO t_id;

  -- -------------------------------------------------------
  -- Artists
  -- -------------------------------------------------------
  INSERT INTO public.artists (tenant_id, handle, display_name, bio)
  VALUES (t_id, 'kleigh', 'KLEIGH', 'Alt Rock / Singer-Songwriter. Victims of Abuse advocate.')
  ON CONFLICT (handle) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        bio          = EXCLUDED.bio,
        updated_at   = now()
  RETURNING id INTO a_kleigh;

  INSERT INTO public.artists (tenant_id, handle, display_name, bio)
  VALUES (t_id, 'gputnam', 'G. Putnam', 'Founder, G Putnam Music LLC. Producer / Songwriter.')
  ON CONFLICT (handle) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        bio          = EXCLUDED.bio,
        updated_at   = now()
  RETURNING id INTO a_gp;

  -- -------------------------------------------------------
  -- K-KUTs (premade, available now via email link)
  -- -------------------------------------------------------
  INSERT INTO public.k_kuts (
    tenant_id, artist_id, title, slug, clip_url, email_link, payload, is_active
  ) VALUES
  (
    t_id, a_kleigh,
    'FOREVER IT''S GOODBYE (K-KUT)',
    'forever-its-goodbye-kkut',
    null,
    'https://gputnammusic.com/k-kuts/forever-its-goodbye',
    jsonb_build_object(
      'type', 'k_kut',
      'track_id', 922457252,
      'external_id', '922457251',
      'album', 'Rough House',
      'artist', 'KLEIGH',
      'year', 2023,
      'bpm', 80,
      'genre', 'Alt Rock',
      'pro_number', 'QZ-GD6-21-00355',
      'moods', ARRAY['Alt Rock','Indie','Singer-Songwriter'],
      'themes', ARRAY['Victims of Abuse']
    ),
    true
  ),
  (
    t_id, a_kleigh,
    'COUNTING TIME (K-KUT)',
    'counting-time-kkut',
    null,
    'https://gputnammusic.com/k-kuts/counting-time',
    jsonb_build_object('type','k_kut','artist','KLEIGH','album','Rough House'),
    true
  ),
  (
    t_id, a_gp,
    'FLAGSHIP INTRO (K-KUT)',
    'flagship-intro-kkut',
    null,
    'https://gputnammusic.com/k-kuts/flagship-intro',
    jsonb_build_object('type','k_kut','artist','G. Putnam','domain','FLAGSHIP'),
    true
  )
  ON CONFLICT (slug) DO UPDATE
    SET title      = EXCLUDED.title,
        clip_url   = EXCLUDED.clip_url,
        email_link = EXCLUDED.email_link,
        payload    = EXCLUDED.payload,
        is_active  = EXCLUDED.is_active,
        updated_at = now();

  -- -------------------------------------------------------
  -- STI slots for FLAGSHIP UI
  -- -------------------------------------------------------
  INSERT INTO app_private.sti_slots (domain_code, key, title, description, required)
  VALUES
    ('FLAGSHIP','ui_logo',                     'UI Logo',             'Header logo',          true),
    ('FLAGSHIP','ui_company_name',             'Company Name',        'Brand name display',   true),
    ('FLAGSHIP','top_row_spacer',              'Top Row Spacer',      'Layout spacer',        false),
    ('FLAGSHIP','menu_item_heroes',            'Menu: Heroes',        'Nav menu item',        true),
    ('FLAGSHIP','menu_item_uru',               'Menu: URU',           'Nav menu item',        true),
    ('FLAGSHIP','menu_item_tells_tale',        'Menu: Tells Tale',    'Nav menu item',        true),
    ('FLAGSHIP','menu_item_artists',           'Menu: Artists',       'Nav menu item',        true),
    ('FLAGSHIP','menu_item_video_klips',       'Menu: Video Klips',   'Nav menu item',        true),
    ('FLAGSHIP','menu_item_brand',             'Menu: Brand',         'Nav menu item',        false),
    ('FLAGSHIP','menu_item_art_gallery',       'Menu: Art Gallery',   'Nav menu item',        false),
    ('FLAGSHIP','menu_item_sponsorships',      'Menu: Sponsorships',  'Nav menu item',        true),
    ('FLAGSHIP','featured_playlist',           'Featured Playlist',   'Homepage playlist',    true),
    ('FLAGSHIP','k_kuts_featured',             'K-KUTs Featured',     'K-KUT spotlight',      true)
  ON CONFLICT (key) DO UPDATE
    SET title       = EXCLUDED.title,
        description = EXCLUDED.description,
        required    = EXCLUDED.required;

  -- -------------------------------------------------------
  -- BTIs (bound track items / content payloads)
  -- -------------------------------------------------------
  INSERT INTO app_private.btis (bti_key, domain_code, payload)
  VALUES
    ('bti_ui_logo_default',
     'FLAGSHIP',
     jsonb_build_object('type','image','path','/branding/logo.png','alt','G Putnam Music')),
    ('bti_company_name_default',
     'FLAGSHIP',
     jsonb_build_object('type','text','value','G. Putnam Music')),
    ('bti_menu_labels_default',
     'FLAGSHIP',
     jsonb_build_object(
       'heroes','Heroes','uru','URU','tells_tale','Tells Tale',
       'artists','Artists','video_klips','Video Klips',
       'brand','Brand','art_gallery','Art Gallery','sponsorships','Sponsorships'
     )),
    ('bti_featured_playlist_default',
     'FLAGSHIP',
     jsonb_build_object('type','playlist','id','fp-flagship-001','name','FLAGSHIP Essentials')),
    ('bti_k_kuts_featured_default',
     'FLAGSHIP',
     jsonb_build_object('type','k_kut_spotlight','slug','forever-its-goodbye-kkut','label','Now Available'))
  ON CONFLICT (bti_key) DO UPDATE
    SET domain_code = EXCLUDED.domain_code,
        payload     = EXCLUDED.payload,
        updated_at  = now();

  -- -------------------------------------------------------
  -- STI bindings
  -- -------------------------------------------------------
  INSERT INTO app_private.sti_bindings (slot_id, bti_id, priority)
  SELECT s.id, b.id, 100
  FROM app_private.sti_slots s, app_private.btis b
  WHERE (s.key = 'ui_logo'           AND b.bti_key = 'bti_ui_logo_default')
     OR (s.key = 'ui_company_name'   AND b.bti_key = 'bti_company_name_default')
     OR (s.key = 'featured_playlist' AND b.bti_key = 'bti_featured_playlist_default')
     OR (s.key = 'k_kuts_featured'   AND b.bti_key = 'bti_k_kuts_featured_default')
     OR (s.key IN (
           'top_row_spacer','menu_item_heroes','menu_item_uru','menu_item_tells_tale',
           'menu_item_artists','menu_item_video_klips','menu_item_brand',
           'menu_item_art_gallery','menu_item_sponsorships'
         )                           AND b.bti_key = 'bti_menu_labels_default')
  ON CONFLICT (slot_id, bti_id) DO UPDATE
    SET priority   = EXCLUDED.priority,
        updated_at = now();

END$$;

-- Rollback: this seed is additive; to undo, run targeted DELETEs:
-- DELETE FROM app_private.sti_bindings WHERE slot_id IN (SELECT id FROM app_private.sti_slots WHERE domain_code='FLAGSHIP');
-- DELETE FROM app_private.btis WHERE domain_code='FLAGSHIP';
-- DELETE FROM app_private.sti_slots WHERE domain_code='FLAGSHIP';
-- DELETE FROM public.k_kuts WHERE tenant_id = (SELECT id FROM public.tenants WHERE slug='flagship');
-- DELETE FROM public.artists WHERE tenant_id = (SELECT id FROM public.tenants WHERE slug='flagship');
-- DELETE FROM public.tenants WHERE slug='flagship';
