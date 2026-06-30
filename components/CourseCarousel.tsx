"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { CourseDrawer } from './CourseDrawer';

const coursesData = [
  { id: 1, title: 'Formação em Terapeuta Ayurvédico', category: 'Formação Completa', workload: '300h', format: 'Híbrido', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop', date: 'Início em Março', description: 'Curso completo voltado para quem deseja se profissionalizar na medicina milenar indiana.', price: 'Inscrições Abertas' },
  { id: 2, title: 'Workshop de Culinária Ayurvédica', category: 'Workshop Prático', workload: '16h', format: 'Presencial', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop', date: '15 de Abril', description: 'Aprenda a utilizar temperos para equilibrar seu Dosha.', price: 'Vagas Limitadas' },
  { id: 3, title: 'Retiro de Desintoxicação (Panchakarma)', category: 'Imersão', workload: '7 Dias', format: 'Presencial', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', date: 'Maio a Junho', description: 'Imersão sob supervisão de terapeutas.', price: 'Últimas Vagas' },
  { id: 4, title: 'Especialização em Saúde da Mulher', category: 'Especialização', workload: '60h', format: 'Online', image: 'https://images.unsplash.com/photo-1594824406951-31823095b27b?q=80&w=600&auto=format&fit=crop', date: 'Inscrições Abertas', description: 'Extensão voltada para a ginecologia natural ayurvédica.', price: 'Disponível' }
];

export const CourseCarousel = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const handleOpenDrawer = (course: any) => {
    setSelectedCourse(course);
    setIsDrawerOpen(true);
  };

  return (
    <section className="py-24 px-4 bg-white border-t border-stone-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-emerald-700 font-bold mb-4 uppercase tracking-widest text-sm">Educação e Formação</p>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Cursos e Workshops</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2 mr-4">
              <button onClick={() => scroll('left')} className="cursor-pointer w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <button onClick={() => scroll('right')} className="cursor-pointer w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
            </div>
            <Link href="/cursos" className="cursor-pointer whitespace-nowrap bg-stone-100 text-stone-700 px-6 py-3 rounded-2xl font-bold hover:bg-stone-200 transition-all active:scale-95 text-sm flex items-center gap-2">Ver todos</Link>
          </div>
        </div>

        {/* O scroll nativo do CSS já habilita drag no celular e touchscreens */}
        <div ref={scrollContainerRef} className="flex overflow-x-auto touch-pan-x gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {coursesData.map((course) => (
            <div key={course.id} onClick={() => handleOpenDrawer(course)} className="group relative flex-shrink-0 w-[300px] sm:w-[350px] bg-stone-50 rounded-[2rem] border border-stone-100 overflow-hidden snap-start hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500 cursor-pointer">
              <div className="h-48 w-full overflow-hidden relative">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6 md:p-8 flex flex-col">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{course.date}</p>
                <h3 className="text-xl font-serif text-stone-900 mb-4 group-hover:text-emerald-700 transition-colors line-clamp-2">{course.title}</h3>
                <div className="mt-auto pt-6 border-t border-stone-200/60">
                  <span className="text-emerald-700 font-bold text-sm flex items-center gap-1 group-hover:text-emerald-800 transition-colors">
                    Mais Detalhes
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CourseDrawer course={selectedCourse} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </section>
  );
};
