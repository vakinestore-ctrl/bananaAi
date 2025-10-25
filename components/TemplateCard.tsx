import React from "react";

export default function TemplateCard({ t }: any) {
  const handleClick = () => {
    if (t.preview_url) {
      window.open(t.preview_url, "_blank");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-4 border rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 bg-white"
    >
      <img
        src={t.preview_url}
        alt={t.title}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h3 className="text-lg font-semibold truncate">{t.title}</h3>
      <p className="text-sm text-gray-600">{t.category}</p>
    </div>
  );
}
