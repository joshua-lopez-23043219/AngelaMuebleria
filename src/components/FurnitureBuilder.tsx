import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Layers, Palette, Save, RotateCcw, ChevronLeft, Sparkles } from 'lucide-react';

export const FurnitureBuilder = () => {
  const [selectedFurniture, setSelectedFurniture] = useState<any>(null);
  const [material, setMaterial] = useState('oak');
  const [fabric, setFabric] = useState('linen');
  const [size, setSize] = useState('medium');

  const furnitureTypes = [
    { id: 'sofa', name: 'Sofá Ethereal', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
    { id: 'bed', name: 'Cama Imperial', image: 'https://images.unsplash.com/photo-1505693419148-43306071f56e?auto=format&fit=crop&q=80&w=800' },
    { id: 'chair', name: 'Silla Master', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' },
    { id: 'table', name: 'Mesa Onyx', image: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&q=80&w=800' },
    { id: 'cabinet', name: 'Gabinete Zenith', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120ec?auto=format&fit=crop&q=80&w=800' },
    { id: 'desk', name: 'Escritorio Aura', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800' },
  ];

  const materials = [
    { id: 'oak', name: 'Roble Claro', color: '#e5d5c0' },
    { id: 'walnut', name: 'Nogal Oscuro', color: '#5d4037' },
    { id: 'pine', name: 'Pino Natural', color: '#f5e1a4' },
  ];

  const fabrics = [
    { id: 'linen', name: 'Lino Gris', color: '#9e9e9e' },
    { id: 'velvet', name: 'Terciopelo Azul', color: '#1a237e' },
    { id: 'leather', name: 'Cuero Tabaco', color: '#795548' },
  ];

  if (!selectedFurniture) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-serif font-bold">Crea tu <span className="italic text-brand-accent">Diseño</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Selecciona una pieza base y transfórmala en algo único con nuestro configurador artesanal.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {furnitureTypes.map((type) => (
            <motion.div 
              key={type.id}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedFurniture(type)}
              className="group cursor-pointer bg-white border border-brand-accent/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={type.image} 
                  alt={type.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                  <Sparkles size={14} className="text-brand-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Personalizable</span>
                </div>
              </div>
              <div className="p-6 flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold">{type.name}</h3>
                <button className="p-3 bg-paper rounded-full group-hover:bg-brand-accent group-hover:text-white transition-all">
                  <Box size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <button 
            onClick={() => setSelectedFurniture(null)}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-accent mb-4 transition-colors"
          >
            <ChevronLeft size={16} /> Volver a Galería
          </button>
          <h1 className="text-4xl font-serif font-bold">Personalizando: <span className="italic text-brand-accent">{selectedFurniture.name}</span></h1>
          <p className="text-gray-500 text-sm">Ajusta los materiales para que se adapten a tu espacio.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-2 border border-brand-accent/20 rounded-full text-sm font-bold hover:bg-paper transition-all">
            <RotateCcw size={16} /> Reiniciar
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-full text-sm font-bold hover:bg-brand-accent transition-all shadow-lg shadow-brand-primary/10">
            <Save size={16} /> Guardar Diseño
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Renderizado del Mueble (Simulado 3D) */}
        <div className="lg:col-span-2 aspect-video bg-paper rounded-3xl relative overflow-hidden flex items-center justify-center border border-brand-accent/10 shadow-inner">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c5a059 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
           
           <motion.div 
             key={`${material}-${fabric}`}
             initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
             animate={{ scale: 1, opacity: 1, rotateY: 0 }}
             transition={{ duration: 0.8, type: 'spring' }}
             className="relative z-10 w-64 h-64 flex flex-col items-center"
           >
              {/* Representación visual abstracta adaptada */}
              <div className="w-full h-32 rounded-t-3xl shadow-2xl relative" style={{ backgroundColor: fabrics.find(f => f.id === fabric)?.color }}>
                <div className="absolute -top-4 -right-4 bg-brand-accent/20 w-12 h-12 rounded-full blur-xl animate-pulse" />
              </div>
              <div className="w-[110%] h-12 -mt-2 rounded-xl shadow-lg" style={{ backgroundColor: fabrics.find(f => f.id === fabric)?.color }}></div>
              <div className="flex gap-16 mt-0">
                 <div className="w-6 h-12 rounded-b-lg shadow-md" style={{ backgroundColor: materials.find(m => m.id === material)?.color }}></div>
                 <div className="w-6 h-12 rounded-b-lg shadow-md" style={{ backgroundColor: materials.find(m => m.id === material)?.color }}></div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">Vista Previa Configurador</p>
                <p className="text-sm text-gray-400">Artesanía personalizada por Angela Mueblería</p>
              </div>
           </motion.div>

           <div className="absolute bottom-6 right-6 flex gap-2">
              <button className="p-3 bg-white shadow-xl rounded-full hover:bg-brand-accent hover:text-white transition-all"><Box size={20}/></button>
              <button className="p-3 bg-white shadow-xl rounded-full hover:bg-brand-accent hover:text-white transition-all"><Layers size={20}/></button>
           </div>
        </div>

        {/* Panel de Control */}
        <div className="space-y-8 bg-white border border-brand-accent/10 p-8 rounded-3xl shadow-xl shadow-brand-accent/5">
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-brand-accent">
                <Palette size={18} />
                <h3 className="font-bold text-sm uppercase tracking-widest">Base de Madera</h3>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {materials.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setMaterial(m.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${material === m.id ? 'border-brand-accent bg-paper' : 'border-paper hover:border-brand-accent/30'}`}
                  >
                    <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: m.color }}></div>
                    <span className="text-sm font-medium">{m.name}</span>
                  </button>
                ))}
             </div>
          </section>

          <section className="space-y-4">
             <div className="flex items-center gap-2 text-brand-accent">
                <Layers size={18} />
                <h3 className="font-bold text-sm uppercase tracking-widest">Tapizado</h3>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {fabrics.map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setFabric(f.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${fabric === f.id ? 'border-brand-accent bg-paper' : 'border-paper hover:border-brand-accent/30'}`}
                  >
                    <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: f.color }}></div>
                    <span className="text-sm font-medium">{f.name}</span>
                  </button>
                ))}
             </div>
          </section>

          <section className="space-y-4">
             <h3 className="font-bold text-sm uppercase tracking-widest text-brand-accent">Dimensiones</h3>
             <div className="flex gap-2">
                {['small', 'medium', 'large'].map(s => (
                   <button 
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${size === s ? 'bg-brand-primary text-white' : 'bg-paper text-gray-400 hover:text-brand-primary'}`}
                   >
                     {s === 'small' ? 'P' : s === 'medium' ? 'M' : 'G'}
                   </button>
                ))}
             </div>
          </section>

          <div className="pt-6 border-t border-dashed">
             <div className="flex justify-between items-center mb-4">
                <p className="text-gray-400 text-sm">Precio Estimado</p>
                <p className="text-lg font-serif font-bold">$12,499</p>
             </div>
             <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-accent transition-all">
                Cotizar Diseño
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
