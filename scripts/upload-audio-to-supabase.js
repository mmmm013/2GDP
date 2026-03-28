#!/usr/bin/env node

/**
 * Upload Audio Files to Supabase Storage
 * 
 * This script uploads audio files to Supabase storage bucket and updates the tracks table with public URLs.
 * 
 * Usage:
 *   node upload-audio-to-supabase.js /path/to/audio/files
 * 
 * Environment Variables Required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

const fs = require('fs');
const path = require('path');

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
const BUCKET_NAME = 'tracks';

if (!SUPABASE_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable not set');
  console.error('   Get it from: https://supabase.com/dashboard/project/lbzpfqarraegkghxwbah/settings/api');
  console.error('   Set it with: export NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here');
  process.exit(1);
}

// Get audio directory from command line
const audioDir = process.argv[2];
if (!audioDir) {
  console.error('❌ Please provide path to audio files');
  console.error('   Usage: node upload-audio-to-supabase.js /path/to/audio/files');
  process.exit(1);
}

if (!fs.existsSync(audioDir)) {
  console.error(`❌ Directory not found: ${audioDir}`);
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Supported audio formats
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.aac'];

/**
 * Get all audio files from directory
 */
function getAudioFiles(dir) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (AUDIO_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scan(dir);
  return files;
}

/**
 * Extract track ID from filename
 * Assumes filename format: {TrackID}.mp3 or {TrackID} - Title.mp3
 */
function extractTrackId(filename) {
  const basename = path.basename(filename, path.extname(filename));
  
  // Try to extract numeric ID from start
  const match = basename.match(/^(\d+)/);
  if (match) {
    return match[1];
  }
  
  // Fallback to full basename
  return basename;
}

/**
 * Upload file to Supabase storage
 */
async function uploadFile(filePath, trackId) {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath);
  const filename = `${trackId}${ext}`;
  
  // Upload to storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, fileBuffer, {
      contentType: `audio/${ext.substring(1)}`,
      upsert: true // Overwrite if exists
    });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename);
  
  return {
    success: true,
    publicUrl: urlData.publicUrl,
    filename
  };
}

/**
 * Update track record with public URL
 */
async function updateTrackUrl(trackId, publicUrl) {
  const { error } = await supabase
    .from('tracks')
    .update({
      public_url: publicUrl,
      url: publicUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', trackId);
  
  return !error;
}

/**
 * Main upload function
 */
async function uploadAudioFiles() {
  console.log('🎵 G Putnam Music - Audio Upload Tool');
  console.log('======================================\n');
  
  console.log(`📁 Scanning directory: ${audioDir}`);
  const audioFiles = getAudioFiles(audioDir);
  
  if (audioFiles.length === 0) {
    console.log('⚠️  No audio files found');
    console.log(`   Supported formats: ${AUDIO_EXTENSIONS.join(', ')}`);
    process.exit(0);
  }
  
  console.log(`🎵 Found ${audioFiles.length} audio files\n`);
  console.log('Starting upload...\n');
  
  let uploaded = 0;
  let failed = 0;
  let skipped = 0;
  
  for (let i = 0; i < audioFiles.length; i++) {
    const filePath = audioFiles[i];
    const filename = path.basename(filePath);
    const trackId = extractTrackId(filename);
    
    process.stdout.write(`\r[${i + 1}/${audioFiles.length}] Uploading: ${filename}...`);
    
    try {
      // Upload file
      const uploadResult = await uploadFile(filePath, trackId);
      
      if (uploadResult.success) {
        // Update database with public URL
        const updateSuccess = await updateTrackUrl(trackId, uploadResult.publicUrl);
        
        if (updateSuccess) {
          uploaded++;
        } else {
          // File uploaded but DB update failed
          skipped++;
          console.log(`\n⚠️  Uploaded but couldn't update track ${trackId} in database`);
        }
      } else {
        failed++;
        console.log(`\n❌ Failed to upload ${filename}: ${uploadResult.error}`);
      }
    } catch (error) {
      failed++;
      console.log(`\n❌ Error with ${filename}: ${error.message}`);
    }
    
    // Small delay to avoid rate limiting
    if (i % 10 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log('\n');
  console.log('======================================');
  console.log(`✅ Upload Complete!`);
  console.log(`   Total Files: ${audioFiles.length}`);
  console.log(`   Uploaded: ${uploaded}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Success Rate: ${((uploaded / audioFiles.length) * 100).toFixed(1)}%`);
  console.log('======================================\n');
  
  if (uploaded > 0) {
    console.log('🎉 Audio files are now accessible at:');
    console.log(`   ${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/`);
  }
  
  if (failed > 0) {
    console.log('\n⚠️  Some files failed to upload. Check the errors above and retry.');
  }
}

// Run the upload
uploadAudioFiles().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
