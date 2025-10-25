export default function TemplateCard({ t }: { t: any }) {
  return (
    <article className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="w-full h-48 bg-gray-100">
        <img src={t.preview_url || '/placeholder-hero.jpg'} alt={t.title || `Template ${t.id}`} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm">{t.title || `Template ${t.id}`}</h3>
        <p className="text-xs text-slate-500">{t.category || (t.tags ? (Array.isArray(t.tags)? t.tags.join(', '): String(t.tags)) : 'Uncategorized')}</p>
      </div>
    </article>
  );
}
