// app/template/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TemplatePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [template, setTemplate] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
      if (error) setError('Could not load template');
      else setTemplate(data);
    }
    load();
  }, [id]);

  async function handleUploadAndGenerate() {
    if (!file || !template) return setError('Select a file first');
    setError(null);
    setLoading(true);

    try {
      // upload original
      const fileName = `uploads/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('user-uploads').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('user-uploads').getPublicUrl(fileName);
      const uploadedUrl = urlData.publicUrl;

      // call server generate
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id, imageUrl: uploadedUrl })
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Generation failed');
      setResultUrl(json.resultUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {!template && <div>Loading template...</div>}
      {template && (
        <>
          <h1 className="text-2xl font-bold mb-2">{template.title}</h1>
          <img src={template.preview_url} alt={template.title} className="w-full h-64 object-cover rounded mb-4" />
          <p className="text-sm text-gray-600 mb-4">{template.category}</p>

          <div className="mb-4">
            <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
          </div>

          <div className="flex gap-3 items-center">
            <button onClick={handleUploadAndGenerate} disabled={!file || loading} className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-60">
              {loading ? 'Processing...' : 'Transform my photo'}
            </button>
            {error && <div className="text-red-600 ml-3">{error}</div>}
          </div>

          {resultUrl && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Result</h3>
              <img src={resultUrl} alt="result" className="w-full rounded shadow" />
              <a className="inline-block mt-3 text-sm text-indigo-600" href={resultUrl} target="_blank" rel="noreferrer">Open / Download</a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
