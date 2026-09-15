"use client";
import { productos } from "@/data/productos";
import { notFound } from "next/navigation";
import { useState, use } from "react"; // 1. Agregamos 'use' aquí
import { Heart, Utensils, MessageCircle } from "lucide-react";

// 2. Le indicamos a TypeScript que params es una Promesa
export default function ProductoDetalle({ params }: { params: Promise<{ id: string }> }) {
  // 3. Desempaquetamos el ID usando React.use()
  const { id } = use(params);
  
  const [cargando, setCargando] = useState(false);
  
  // 4. Usamos el id desempaquetado para buscar el producto
  const producto = productos.find((p) => p.id === id);

  if (!producto) return notFound();

  const handlePedirWhatsApp = async () => {
    setCargando(true);
    try {
      // 1. Guardar en Excel silenciosamente vía nuestra API
      await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto: producto.nombre,
          precio: producto.precio,
          fecha: new Date().toLocaleString('es-AR')
        })
      });

      // 2. Armar mensaje y redirigir a WhatsApp
      const numeroVendedor = "5491168922030"; // Reemplazar con tu número
      const mensaje = `¡Hola! Me gustaría encargar: *${producto.nombre}*.\nPrecio marcado: $${producto.precio}.`;
      const url = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(mensaje)}`;
      
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error al procesar la orden:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="h-[50vh] w-full relative">
        <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 -mt-20 relative bg-white rounded-t-3xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">{producto.nombre}</h1>
        <p className="text-xl text-neutral-600 mb-8">{producto.descripcionBreve}</p>
        
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Bienestar y Salud */}
          <div className="bg-emerald-50 p-6 rounded-2xl">
            <h3 className="text-2xl font-semibold flex items-center gap-2 text-emerald-800 mb-4">
              <Heart className="text-emerald-600" /> Beneficios
            </h3>
            <ul className="space-y-3">
              {producto.salud.map((item, i) => (
                <li key={i} className="flex gap-2 text-emerald-900">
                  <span className="text-emerald-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Recetas e Ideas */}
          <div className="bg-orange-50 p-6 rounded-2xl">
            <h3 className="text-2xl font-semibold flex items-center gap-2 text-orange-800 mb-4">
              <Utensils className="text-orange-600" /> Cómo usarlo
            </h3>
            <ul className="space-y-3">
              {producto.recetas.map((item, i) => (
                <li key={i} className="flex gap-2 text-orange-900">
                  <span className="text-orange-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Botón Flotante / Llamado a la acción */}
        <div className="flex items-center justify-between p-6 bg-neutral-900 rounded-2xl text-white">
          <div>
            <p className="text-sm text-neutral-400">Precio estimado</p>
            <p className="text-3xl font-bold">${producto.precio}</p>
          </div>
          <button 
            onClick={handlePedirWhatsApp}
            disabled={cargando}
            className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-colors disabled:opacity-70"
          >
            <MessageCircle />
            {cargando ? 'Procesando...' : 'Pedir por WhatsApp'}
          </button>
        </div>
      </div>
    </main>
  );
}