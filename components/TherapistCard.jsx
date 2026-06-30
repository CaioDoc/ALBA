// components/TherapistCard.jsx
import React from 'react';
import { SkillBadge } from './SkillBadge';

export const TherapistCard = ({ id, name, role, registry, location, avatar, bio, skills, onOpenProfile }) => {
  return (
    <div
      data-physics="card"
      data-id={id}
      className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-stone-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:border-stone-200/80 transition-all duration-500 ease-out overflow-hidden"
    >
      {/* Conteúdo Principal do Card */}
      <div>
        {/* Header do Card: Avatar e Identificação */}
        <div className="flex items-start gap-4 mb-5">
          <div className="relative flex-shrink-0 w-16 h-16 rounded-full bg-stone-50 border border-stone-100 overflow-hidden">
            {avatar ? (
              <img 
                src={avatar} 
                alt={`Foto de ${name}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              // Fallback elegante caso não haja foto
              <div className="flex items-center justify-center w-full h-full text-stone-400 font-medium text-lg bg-gradient-to-br from-stone-50 to-stone-100">
                {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="space-y-0.5">
            <h3 className="font-serif text-lg font-medium text-stone-800 leading-snug group-hover:text-emerald-900 transition-colors duration-300">
              {name}
            </h3>
            <p className="text-xs font-medium text-emerald-700 tracking-wide uppercase">
              {role}
            </p>
            <p className="text-[11px] text-stone-400 font-mono">
              {registry}
            </p>
          </div>
        </div>

        {/* Localização */}
        <div className="flex items-center gap-1.5 mb-4 text-xs text-stone-500">
          <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{location}</span>
        </div>

        {/* Pequena Biografia/Resumo */}
        <p className="text-sm text-stone-600 leading-relaxed mb-6 line-clamp-3">
          {bio}
        </p>
      </div>

      {/* Seção Inferior: Skills e CTA */}
      <div className="space-y-6 mt-auto">
        {/* Listagem de Skills (Tags) */}
        <div className="flex flex-wrap gap-2" data-physics-container="skills">
          {skills.slice(0, 4).map((skill) => (
            <SkillBadge 
              key={skill.id} 
              name={skill.name} 
              slug={skill.slug} 
            />
          ))}
          {skills.length > 4 && (
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[11px] font-medium bg-stone-50 text-stone-400 border border-stone-100 select-none">
              +{skills.length - 4}
            </span>
          )}
        </div>

        {/* Botão de Ação Primária (Touch Target Otimizado: 48px de altura) */}
        <button
          type="button"
          onClick={() => onOpenProfile(id)}
          aria-label={`Ver perfil detalhado de ${name}`}
          className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-stone-900 text-white font-medium text-sm transition-all duration-300 hover:bg-emerald-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <span>Ver Perfil Completo</span>
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};