// components/SkillBadge.jsx
import React from 'react';

export const SkillBadge = ({ name, slug }) => {
  return (
    <span
      data-physics="skill"
      data-slug={slug}
      className="inline-block px-3.5 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200/60 select-none transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200/80 cursor-default"
    >
      {name}
    </span>
  );
};