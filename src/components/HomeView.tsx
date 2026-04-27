import React from 'react';
import { motion } from 'motion/react';
import { Award, Heart, ShieldCheck, History, Target, Eye, ChevronRight } from 'lucide-react';

export const HomeView = ({ onStartShopping }: { onStartShopping: () => void }) => {
  const stats = [
    { label: 'Años de Tradición', value: '25+' },
    { label: 'Diseños Únicos', value: '500+' },
    { label: 'Familias Nicaragüenses', value: '10k+' },
    { label: 'Departamentos', value: '15' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
            alt="Interior Lujoso" 
            className="w-full h-full object-cover grayscale-[20%] brightness-[0.7]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-accent font-mono text-sm uppercase tracking-[0.3em] font-bold">Artesanía que Trasciende</span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mt-4 leading-tight">
              Elegancia en cada <span className="italic">Detalle</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mt-6 font-light leading-relaxed">
              En Angela Mueblería, convertimos espacios ordinarios en santuarios de diseño y confort con piezas fabricadas a mano por maestros artesanos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-4 justify-center pt-8"
          >
            <button 
              onClick={onStartShopping}
              className="bg-brand-accent text-brand-primary px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-2"
            >
              Explorar Catálogo <ChevronRight size={18} />
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
              Nuestra Historia
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="-mt-16 relative z-20 max-w-7xl mx-auto w-full px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 bg-white shadow-2xl rounded-[2rem] overflow-hidden border border-brand-accent/10">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`p-8 text-center ${i !== stats.length - 1 ? 'md:border-r border-brand-accent/10' : ''}`}>
              <p className="text-4xl font-serif font-bold text-brand-primary">{stat.value}</p>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-accent mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History & Origin */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper border border-brand-accent/20 rounded-full text-brand-accent">
              <History size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Desde 1999</span>
            </div>
            <h2 className="text-5xl font-serif font-bold text-brand-primary leading-tight">
              Origen en el Corazón de <span className="italic text-brand-accent">Masatepe</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Angela Mueblería nació en un pequeño taller familiar en Masatepe, Masaya, con una meta clara: demostrar que el mobiliario nicaragüense de lujo puede competir con los estándares internacionales más exigentes.
              </p>
              <p>
                Lo que comenzó como un sueño local, hoy es un referente nacional en diseño de interiores, manteniendo siempre la esencia artesanal que nos vio nacer en las tierras blancas de Masatepe. Cada pieza cuenta una historia de dedicación y orgullo nicaragüense.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-6">
               <div className="space-y-2">
                 <h4 className="font-serif font-bold text-xl">Calidad Certificada</h4>
                 <p className="text-xs text-gray-500">Maderas seleccionadas de bosques sustentables y textiles premium.</p>
               </div>
               <div className="space-y-2">
                 <h4 className="font-serif font-bold text-xl">Artesanía Pura</h4>
                 <p className="text-xs text-gray-500">Procesos manuales que garantizan la durabilidad de por vida.</p>
               </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl animate-pulse" />
            <div className="relative grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800" 
                className="rounded-3xl shadow-xl translate-y-8" 
                alt="Artesano trabajando"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800" 
                className="rounded-3xl shadow-xl" 
                alt="Mueble finalizado"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Bento */}
      <section className="bg-paper py-24 px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl font-serif font-bold">Nuestra Identidad</h2>
            <p className="text-gray-500">Los pilares que sostienen cada decisión y creación en nuestra casa de diseño.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mision */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-12 rounded-[3rem] shadow-xl border border-brand-accent/5 flex flex-col items-center text-center space-y-6"
            >
              <div className="p-6 bg-brand-accent/10 text-brand-accent rounded-full">
                <Target size={42} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-serif font-bold">Nuestra Misión</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Crear mobiliario que trascienda generaciones, equilibrando la estética moderna con la durabilidad de la manufactura tradicional, brindando a las familias hogares donde el diseño sea el protagonista.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-brand-primary p-12 rounded-[3rem] shadow-xl text-white flex flex-col items-center text-center space-y-6"
            >
              <div className="p-6 bg-white/10 text-brand-accent rounded-full border border-white/10">
                <Eye size={42} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-serif font-bold">Nuestra Visión</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Consolidarnos como la firma líder en diseño de interiores de lujo en Nicaragua, siendo reconocidos por nuestra innovación constante y el compromiso innegociable con la excelencia artesanal en Masatepe.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-4xl font-serif font-bold mb-4">Valores Innegociables</h2>
           <div className="w-24 h-1 bg-brand-accent mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              title: 'Integridad', 
              desc: 'Hacemos lo correcto, siempre. Desde la selección ética de maderas hasta la transparencia total con nuestros clientes.',
              icon: ShieldCheck
            },
            { 
              title: 'Pasión por el Detalle', 
              desc: 'No creemos en lo "suficiente". Si un milímetro no es perfecto, la pieza no sale de nuestro taller.',
              icon: Heart
            },
            { 
              title: 'Exclusividad', 
              desc: 'Cada mueble es una obra única. Rechazamos la producción masiva para abrazar lo individual.',
              icon: Award
            }
          ].map((v) => (
            <div key={v.title} className="space-y-4 group">
              <div className="w-12 h-12 bg-paper rounded-2xl flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all duration-500">
                <v.icon size={24} />
              </div>
              <h4 className="text-2xl font-serif font-bold">{v.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-8 pb-24">
        <div className="max-w-7xl mx-auto bg-brand-accent/10 rounded-[4rem] p-16 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 blur-[120px] rounded-full" />
          <h2 className="text-5xl font-serif font-bold text-brand-primary">¿Listo para transformar <span className="italic">tu espacio?</span></h2>
          <p className="text-gray-600 max-w-xl mx-auto">Únete a las miles de familias que ya disfrutan de la experiencia de vivir en un hogar diseñado por Angela Mueblería.</p>
          <button 
            onClick={onStartShopping}
            className="inline-block bg-brand-primary text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl shadow-brand-primary/20"
          >
            Comenzar Experiencia
          </button>
        </div>
      </section>
    </div>
  );
};
