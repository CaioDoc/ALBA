"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { CourseDrawer } from './CourseDrawer';

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

const coursesData: Course[] = [
  { id: 1, title: 'Massagem Ayurvédica Tradicional', category: 'Formação', workload: 'Consulte', format: 'Presencial', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=600&auto=format&fit=crop', date: 'Em Breve', description: 'Formação completa em técnicas tradicionais de massagem ayurvédica para reequilíbrio corporal e energético.', price: 'Consulte' },
  { id: 2, title: 'Workshop Indian Head Massage - Champi', category: 'Workshop Prático', workload: 'Consulte', format: 'Presencial', image: 'https://images.unsplash.com/photo-1600334129128-685054110de4?q=80&w=600&auto=format&fit=crop', date: 'Em Breve', description: 'Aprenda a tradicional técnica indiana de massagem focada na cabeça, ombros e pescoço.', price: 'Consulte' },
  { id: 3, title: 'Instrutor de Yoga - Formação Super Intensiva', category: 'Formação Intensiva', workload: 'Consulte', format: 'Imersão', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', date: 'Em Breve', description: 'Imersão profunda e transformadora para formação certificada de instrutores de Yoga.', price: 'Consulte' },
  { id: 4, title: 'Nutrição e Estilo de Vida Segundo a Ayurveda', category: 'Curso Livre', workload: 'Consulte', format: 'Online / Híbrido', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop', date: 'Em Breve', description: 'Aprenda a utilizar os princípios ayurvédicos na alimentação diária para uma vida mais saudável.', price: 'Consulte' },
  { id: 5, title: 'Saiba Mais Sobre a Medicina Ayurvédica', category: 'Introdução', workload: 'Consulte', format: 'Online', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop', date: 'Em Breve', description: 'Uma introdução completa e acessível aos conceitos fundamentais e à filosofia do Ayurveda.', price: 'Consulte' }
];

export const CourseCarousel = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const handleOpenDrawer = (course: Course) => {
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
