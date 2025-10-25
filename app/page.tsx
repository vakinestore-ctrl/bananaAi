'use client';
import React, { useEffect, useState } from 'react';
import { createSupabaseClient } from '../lib/supabaseClient';
import TemplateCard from '../components/TemplateCard';

export default function HomePage() {
  const supabase = createSupabaseClient();
  const [templates, setTemplates] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from('templates').select('id, title, category, tags, preview_url, created_at').order('created_at', { ascending: false }).limit(1000);
      if (error) { console.error('Supabase error', error); setTemplates([]); setFiltered([]); }
      else { setTemplates(data || []); setFiltered(data || []); }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    setFiltered(templates.filter((t:any) => {
      const title = (t.title || '').toString().toLowerCase();
      const tags = t.tags ? (Array.isArray(t.tags) ? t.tags.join(' ') : String(t.tags)) : '';
      const cat = (t.category || '').toString().toLowerCase();
      if (tagFilter && tags.toLowerCase().indexOf(tagFilter.toLowerCase()) === -1) return false;
      if (!q) return true;
      return title.includes(q) || tags.toLowerCase().includes(q) || cat.includes(q);
    }));
  }, [query, tagFilter, templates]);

  return (
    <main className="p-6">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-yellow-600">🍌 BananaAI</h1>
        <p className="text-slate-500 mt-2">Trendy photo templates — instant gallery</p>
      </header>

      <div className="max-w-4xl mx-auto mb-6 flex gap-3">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search templates, tags, categories..." className="flex-1 p-3 rounded-xl border" />
        <input value={tagFilter} onChange={(e)=>setTagFilter(e.target.value)} placeholder="Filter by tag" className="w-48 p-3 rounded-xl border" />
      </div>

      {loading ? <div className="text-center">Loading templates...</div> : (
        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((t:any) => <TemplateCard key={t.id} t={t} />)}
        </section>
      )}
    </main>
  );
}
