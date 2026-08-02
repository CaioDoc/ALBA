"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { CourseDrawer } from '../../components/CourseDrawer';
import { initialCourses as scrapedCourses } from '../../data/cursos.js';

interface Course {
  id: number;
  title: string;
  category: string;
  workload: string;
  format: string;
  image: string;
  date: string;
  description: string;
  price: string;
}

const categories = ['Todos', 'Yoga', 'Massagens Ayurvédicas', 'Medicina Ayurvédica', 'Estudos Holísticos'];

export default function CursosPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const savedCourses = localStorage.getItem('alba_cursos_v27');
    if (savedCourses) {
      try {
        const parsed = JSON.parse(savedCourses);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
        } else {
          setCourses(scrapedCourses);
          localStorage.setItem('alba_cursos_v27', JSON.stringify(scrapedCourses));
        }
      } catch (e) {
        setCourses(scrapedCourses);
        localStorage.setItem('alba_cursos_v27', JSON.stringify(scrapedCourses));
      }
    } else {
      setCourses(scrapedCourses);
      localStorage.setItem('alba_cursos_v24', JSON.stringify(scrapedCourses));
    }
  }, []);

  const filteredCourses = courses.filter((course) => {
    const isEnabled = course.active !== false && course.status !== 'Desativado' && course.status !== 'Rascunho';
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return isEnabled && matchesCategory && matchesSearch;
  });

  // Reset para a primeira página ao filtrar ou buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getImagePath = (src: string) => {
    const fallback = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop';
    if (!src) return fallback;
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    
    const clean = src.replace(/^\//, '');
    
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (window.location.hostname.includes('github.io') || pathname.startsWith('/ALBA')) {
        return `/ALBA/${clean}`;
      }
    }
    return `/${clean}`;
  };

  const handleOpenDrawer = (course: Course) => {
    setSelectedCourse(course);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <Navbar />

      <section className="pt-24 pb-16 px-4 bg-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-700 font-bold mb-4 uppercase tracking-widest text-sm">Espaço de Aprendizado</p>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Programas Educacionais</h1>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filtros e Busca */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            {/* Input de Busca */}
            <div className="relative w-full md:max-w-xs flex-shrink-0">
              <input 
                type="text" 
                placeholder="Buscar curso..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-full text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
              />
              <svg className="w-5 h-5 text-stone-400 absolute left-4 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Menu de Filtros Rápidos */}
            <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 hide-scrollbar items-center flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-md'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards (Mesmo grid de 3 colunas e mesmo tamanho de Artigos) */}
          {currentCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {currentCourses.map((course) => (
                <div key={course.id} className="group bg-white rounded-[2rem] border border-stone-200/80 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer" onClick={() => handleOpenDrawer(course)}>
                  <div className="h-56 w-full overflow-hidden relative bg-stone-900 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={getImagePath(course.image)} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" 
                    />
                    <img 
                      src={getImagePath(course.image)} 
                      alt={course.title} 
                      className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute top-4 left-4 z-20 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">{course.category}</div>
                  </div>
                  <div className="p-8 pb-4 flex-1 flex flex-col">
                    <h3 className="text-xl font-serif text-stone-900 mb-3 group-hover:text-emerald-700 transition-colors leading-snug">{course.title}</h3>
                    <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed flex-grow">{course.description}</p>
                  </div>
                  <div className="px-8 pb-8 pt-2">
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                      <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">{course.status || 'Inscrições Abertas'}</span>
                      {/* Botão que chama a Drawer */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDrawer(course);
                        }}
                        className="cursor-pointer bg-stone-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all active:scale-95 flex items-center gap-1"
                      >
                        Saber Mais
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-stone-100 mb-16">
              <p className="text-stone-500 text-lg">Nenhum curso encontrado para sua busca.</p>
            </div>
          )}

          {/* Paginação (12 itens por página) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`cursor-pointer w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-colors ${
                    currentPage === idx + 1 ? 'bg-emerald-800 text-white shadow-md' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Componente Drawer */}
      <CourseDrawer 
        course={selectedCourse} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
}
