"use client";

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { CourseDrawer } from '../../components/CourseDrawer';

const allCoursesData = [
  {
    id: 1, title: 'Formação Profissional em Terapeuta Ayurvédico', category: 'Formação', workload: '300h', format: 'Híbrido', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop', date: 'Início em Março de 2027', description: 'Curso completo voltado para quem deseja se profissionalizar na medicina milenar indiana. Inclui anatomia ayurvédica, patologia, farmacologia e estágio supervisionado.', price: 'Inscrições Abertas'
  },
  {
    id: 2, title: 'Workshop Intensivo de Culinária Ayurvédica', category: 'Workshops', workload: '16h', format: 'Presencial', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop', date: '15 e 16 de Abril', description: 'Aprenda a utilizar os temperos, especiarias e combinações corretas de alimentos para acender o seu fogo digestivo (Agni) e equilibrar o seu Dosha no dia a dia.', price: 'Vagas Limitadas'
  },
  {
    id: 3, title: 'Retiro Avançado de Desintoxicação e Panchakarma', category: 'Imersões', workload: '7 Dias', format: 'Presencial', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', date: '12 a 19 de Maio', description: 'Uma experiência de imersão total sob a supervisão de médicos e terapeutas experientes. Inclui alimentação personalizada, massagens diárias e práticas de purificação.', price: 'Últimas Vagas'
  },
  {
    id: 4, title: 'Especialização em Saúde da Mulher e Ginecologia Ayurvédica', category: 'Especialização', workload: '60h', format: 'Online', image: 'https://images.unsplash.com/photo-1594824406951-31823095b27b?q=80&w=600&auto=format&fit=crop', date: 'Acesso Imediato', description: 'Curso de extensão voltado para terapeutas que desejam aprofundar os cuidados nos ciclos femininos, desde a menarca até a menopausa, utilizando fitoterapia e rotinas de autocuidado.', price: 'Disponível'
  },
  {
    id: 5, title: 'Introdução ao Ayurveda: Princípios Básicos para o Cotidiano', category: 'Workshops', workload: '8h', format: 'Online (Ao Vivo)', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop', date: '05 de Junho', description: 'Ideal para iniciantes. Entenda de forma simples o conceito dos cinco elementos, como identificar traços do seu biotipo e pequenos hábitos para implementar amanhã.', price: 'Inscrições Abertas'
  }
];

const categories = ['Todos', 'Formação', 'Especialização', 'Workshops', 'Imersões'];

export default function CursosPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredCourses = allCoursesData.filter((course) => {
    return activeCategory === 'Todos' || course.category === activeCategory;
  });

  const handleOpenDrawer = (course: any) => {
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
        <div className="max-w-6xl mx-auto">
          {/* Menu de Filtros Rápidos */}
          <div className="flex overflow-x-auto gap-2 pb-6 mb-12 border-b border-stone-200/60 hide-scrollbar items-center">
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

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="group bg-white rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="h-56 w-full overflow-hidden relative">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-emerald-800">{course.category}</div>
                </div>
                <div className="p-8 pb-4 flex-1">
                  <h3 className="text-2xl font-serif text-stone-900 mb-3">{course.title}</h3>
                  <p className="text-stone-500 text-sm line-clamp-2">{course.description}</p>
                </div>
                <div className="px-8 pb-8">
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">{course.price}</span>
                    {/* Botão que chama a Drawer */}
                    <button 
                      onClick={() => handleOpenDrawer(course)}
                      className="cursor-pointer bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all active:scale-95 flex items-center gap-1"
                    >
                      Saber Mais
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
