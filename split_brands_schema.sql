-- 1. CLEANUP: Drop confusing tables (Safety check required in production)
-- DROP TABLE IF EXISTS songs;
-- DROP TABLE IF EXISTS audio;

-- 2. CREATE THE "ONE TRUTH" TABLE
CREATE TABLE IF NOT EXISTS tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    filename TEXT NOT NULL, -- The filename in the 'tracks' bucket

    -- THE 4-BRAND SPLIT ENGINE
    brand_domain TEXT CHECK (brand_domain IN ('GPM', 'KLEIGH', 'SCHERER', 'KFS')) NOT NULL DEFAULT 'GPM',

    -- METADATA
    moods TEXT[], -- Array of moods ['Happy', 'Calm']
    tempo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. ENABLE ROW LEVEL SECURITY (Standard Practice)
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- 4. CREATE POLICIES (Public Read Access)
CREATE POLICY "Allow public read access" ON tracks FOR SELECT USING (true);

-- 5. SEED DATA (The First "Trace" Tracks)
INSERT INTO tracks (title, artist, filename, brand_domain, moods) VALUES
('Memories', 'G Putnam', 'Memories.mp3', 'GPM', '{Nostalgic, Calm}'),
('Bought Into Your Game', 'Kleigh', '038 - kleigh - bought into your game.mp3', 'KLEIGH', '{Energetic, Pop}'),
('Jump', 'GPM & Michael Scherer', 'Jump.mp3', 'SCHERER', '{Kids, Active}');
