"use client";

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { SkillBadge } from './SkillBadge';
import { ayurvedaSkills } from '../data/skills';

export const AntigravityLab = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVataActive, setIsVataActive] = useState(false);

  useEffect(() => {
    if (!isVataActive || !containerRef.current) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Bodies = Matter.Bodies;

    const engine = Engine.create();
    
    // Gravidade muito suave e levemente instável (simulando o Ar/Vata)
    engine.world.gravity.y = 0.5;
    engine.world.gravity.x = 0;

    const width = containerRef.current.clientWidth;
    const height = 450; // Um pouco mais compacto e elegante

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
      }
    });

    // Limites invisíveis (Chão e Paredes) para segurar os termos
    const ground = Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true });
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true });
    
    World.add(engine.world, [ground, leftWall, rightWall]);

    const skillElements = document.querySelectorAll('[data-physics="skill"]');
    const bodies: { domElement: Element; physicsBody: Matter.Body }[] = [];

    skillElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();

      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        restitution: 0.8, // Mais "elástico" (quica mais)
        friction: 0.05,
        frictionAir: 0.02, // Flutua com um pouco mais de suavidade
        render: { visible: false } 
      });

      bodies.push({ domElement: el, physicsBody: body });
      World.add(engine.world, body);

      const htmlEl = el as HTMLElement;
      htmlEl.style.position = 'absolute';
      htmlEl.style.top = '0px';
      htmlEl.style.left = '0px';
      htmlEl.style.margin = '0px';
      htmlEl.style.zIndex = '10';
    });

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: Mouse.create(containerRef.current),
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    World.add(engine.world, mouseConstraint);

    Matter.Events.on(engine, 'afterUpdate', () => {
      bodies.forEach(({ domElement, physicsBody }) => {
        const htmlEl = domElement as HTMLElement;
        htmlEl.style.transform = `translate(${physicsBody.position.x - htmlEl.offsetWidth/2}px, ${physicsBody.position.y - htmlEl.offsetHeight/2}px) rotate(${physicsBody.angle}rad)`;
      });
    });

    Runner.run(Runner.create(), engine);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [isVataActive]);

  const handleReset = () => {
    // Para simplificar o reset da física no React e restaurar o CSS, recarregamos a view
    window.location.reload();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto min-h-[450px] mt-8" ref={containerRef}>
      
      {/* Botões de Interação (Contexto Ayurvédico) */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 relative z-20">
        {!isVataActive ? (
          <button 
            onClick={() => setIsVataActive(true)}
            className="cursor-pointer group flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full font-medium transition-all"
          >
            <svg className="w-5 h-5 text-stone-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Despertar Elemento Ar (Vata)
          </button>
        ) : (
          <button 
            onClick={handleReset}
            className="cursor-pointer group flex items-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full font-medium transition-all shadow-sm"
          >
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restaurar Equilíbrio (Kapha)
          </button>
        )}
      </div>

      {/* Container Fluido das Tags */}
      <div className="flex flex-wrap justify-center gap-3 relative z-10 px-4">
        {ayurvedaSkills.map((skill) => (
          <SkillBadge key={skill.id} name={skill.name} slug={skill.slug} />
        ))}
      </div>

    </div>
  );
};
