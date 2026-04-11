'use client';

import { useState , type ChangeEvent, type FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function FanCamUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Generate URU ID (Clean ID)
  const generateUruId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `uru-${timestamp}-${randomStr}`.toUpperCase();
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadStatus('Please select an image first');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading your photo...');

    try {
      // Generate URU ID
      const uruId = generateUruId();
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uruId}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fan-uploads')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fan-uploads')
        .getPublicUrl(fileName);

      // Insert into fan_submissions table
      const { error: dbError } = await supabase
        .from('fan_submissions')
        .insert({
          fan_email: email || null,
          image_url: publicUrl,
          uru_id: uruId,
          caption: caption || null,
          status: 'pending',
          vote_count: 0
        });

      if (dbError) throw dbError;

      setUploadStatus('Success! Your photo has been submitted to the Fan Cam Contest!');
      setSelectedFile(null);
      setEmail('');
      setCaption('');
      setPreviewUrl(null);
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black/30 rounded-lg border border-gold-500/20">
      <h2 className="text-3xl font-bold text-gold-400 mb-4 text-center">
        📸 Fan Cam Contest - Upload Your Photo!
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-white mb-2 font-semibold">
            Select Your Photo *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full p-3 bg-black/50 border border-gold-500/30 rounded text-white"
            required
          />
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div className="mt-4">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full h-64 object-contain mx-auto rounded border-2 border-gold-500/50"
            />
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block text-white mb-2">
            Your Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full p-3 bg-black/50 border border-gold-500/30 rounded text-white placeholder-gray-500"
          />
        </div>

        {/* Caption Input */}
        <div>
          <label className="block text-white mb-2">
            Caption (optional)
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Tell us about your photo..."
            rows={3}
            className="w-full p-3 bg-black/50 border border-gold-500/30 rounded text-white placeholder-gray-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !selectedFile}
          className="w-full py-3 px-6 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-bold rounded-lg hover:from-gold-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {uploading ? 'Uploading...' : 'Submit to Contest'}
        </button>
      </form>

      {/* Status Message */}
      {uploadStatus && (
        <div className={`mt-4 p-4 rounded ${
          uploadStatus.includes('Success') 
            ? 'bg-green-900/50 text-green-200' 
            : uploadStatus.includes('Error')
            ? 'bg-red-900/50 text-red-200'
            : 'bg-blue-900/50 text-blue-200'
        }`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
}
