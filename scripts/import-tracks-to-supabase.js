#!/usr/bin/env node

/**
 * Import Tracks to Supabase
 * 
 * This script imports all tracks from public/assets/stl.csv into the Supabase tracks table.
 * 
 * Usage:
 *   node import-tracks-to-supabase.js
 * 
 * Environment Variables Required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Check for required modules
let createClient;
try {
  const supabaseJs = require('@supabase/supabase-js');
  createClient = supabaseJs.createClient;
} catch (error) {
  console.error('❌ Missing @supabase/supabase-js package');
  console.error('   Run: npm install @supabase/supabase-js');
  process.exit(1);
}

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lbzpfqarraegkghxwbah.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable not set');
  console.error('   Get it from: https://supabase.com/dashboard/project/lbzpfqarraegkghxwbah/settings/api');
  console.error('   Set it with: export NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here');
  process.exit(1);
}

const CSV_PATH = path.join(__dirname, '..', 'public', 'assets', 'stl.csv');
const BATCH_SIZE = 100; // Insert 100 records at a time

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Parse CSV line
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

/**
 * Convert CSV row to track object
 */
function csvRowToTrack(row, headers) {
  const track = {};
  
  headers.forEach((header, index) => {
    const value = row[index] || '';
    
    // Map CSV columns to database columns
    switch (header) {
      case 'Track ID':
        track.id = value;
        break;
      case 'Title':
        track.title = value;
        break;
      case 'Artist':
        track.artist = value;
        break;
      case 'Album':
        track.album = value;
        break;
      case '[read-only] Duration':
        track.duration = value;
        break;
      case 'BPM':
        track.bpm = value ? parseFloat(value) : null;
        break;
      case 'Genre':
        track.genre = value;
        break;
      case 'Tag category: Mood/feel':
        track.mood = value;
        break;
      case 'Tag category: Tempo':
        track.tempo = value;
        break;
      case 'Tag category: Instrument':
        track.instruments = value;
        break;
      case 'Tag category: Vocals':
        track.vocals = value;
        break;
      case 'Tag category: Type':
        track.track_type = value;
        break;
      case 'Writer 1 Name':
        track.writer_1_name = value;
        break;
      case 'Writer 1 Percentage':
        track.writer_1_percentage = value ? parseFloat(value) : null;
        break;
      case 'Writer 1 PRO':
        track.writer_1_pro = value;
        break;
      case 'Writer 1 Publisher':
        track.writer_1_publisher = value;
        break;
      case 'Writer 2 Name':
        track.writer_2_name = value;
        break;
      case 'Writer 2 Percentage':
        track.writer_2_percentage = value ? parseFloat(value) : null;
        break;
      case 'Writer 2 PRO':
        track.writer_2_pro = value;
        break;
      case 'Writer 2 Publisher':
        track.writer_2_publisher = value;
        break;
    }
  });
  
  // Combine all tag categories into a single tags field
  const tagFields = ['mood', 'tempo', 'instruments', 'vocals', 'track_type', 'genre'];
  track.tags = tagFields
    .map(field => track[field])
    .filter(val => val)
    .join(', ');
  
  return track;
}

/**
 * Insert tracks in batches
 */
async function insertBatch(tracks) {
  const { data, error } = await supabase
    .from('tracks')
    .upsert(tracks, { onConflict: 'id', ignoreDuplicates: false });
  
  if (error) {
    console.error('❌ Batch insert error:', error.message);
    return false;
  }
  
  return true;
}

/**
 * Main import function
 */
async function importTracks() {
  console.log('🎵 G Putnam Music - Track Import Tool');
  console.log('=====================================\n');
  
  // Check if CSV file exists
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV file not found: ${CSV_PATH}`);
    process.exit(1);
  }
  
  console.log(`📁 Reading: ${CSV_PATH}`);
  
  const fileStream = fs.createReadStream(CSV_PATH);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let headers = [];
  let tracks = [];
  let batch = [];
  let totalProcessed = 0;
  let totalSuccess = 0;
  let isFirstLine = true;
  
  for await (const line of rl) {
    if (isFirstLine) {
      // Parse headers
      headers = parseCSVLine(line);
      console.log(`📊 Found ${headers.length} columns`);
      isFirstLine = false;
      continue;
    }
    
    if (!line.trim()) continue;
    
    try {
      const row = parseCSVLine(line);
      const track = csvRowToTrack(row, headers);
      
      if (track.id && track.title) {
        batch.push(track);
        totalProcessed++;
        
        // Insert batch when it reaches BATCH_SIZE
        if (batch.length >= BATCH_SIZE) {
          const success = await insertBatch(batch);
          if (success) {
            totalSuccess += batch.length;
            process.stdout.write(`\r✅ Imported ${totalSuccess} / ${totalProcessed} tracks`);
          }
          batch = [];
        }
      }
    } catch (error) {
      console.error(`\n⚠️  Error parsing line: ${error.message}`);
    }
  }
  
  // Insert remaining tracks
  if (batch.length > 0) {
    const success = await insertBatch(batch);
    if (success) {
      totalSuccess += batch.length;
      process.stdout.write(`\r✅ Imported ${totalSuccess} / ${totalProcessed} tracks`);
    }
  }
  
  console.log('\n');
  console.log('=====================================');
  console.log(`✅ Import Complete!`);
  console.log(`   Total Processed: ${totalProcessed}`);
  console.log(`   Total Imported: ${totalSuccess}`);
  console.log(`   Success Rate: ${((totalSuccess / totalProcessed) * 100).toFixed(1)}%`);
  console.log('=====================================\n');
  
  // Verify count in database
  const { count, error } = await supabase
    .from('tracks')
    .select('*', { count: 'exact', head: true });
  
  if (!error) {
    console.log(`🗄️  Database now contains: ${count} tracks`);
  }
}

// Run the import
importTracks().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
