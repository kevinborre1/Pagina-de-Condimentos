"use client";
import { useState } from "react";
import Link from "next/link";
import { productos } from "@/data/productos";
import { Search } from "lucide-react";

export default function Home() {
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-neutral-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-8 text-center tracking-tight">
          Botica Natural
        </h1>
        
        {/* Buscador */}
        <div className="relative max-w-xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Buscar condimentos o yuyos..."
            className="w-full px-6 py-4 rounded-full border border-neutral-200 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Search className="absolute right-6 top-4 text-neutral-400" size={24} />
        </div>

        {/* Grilla de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {productosFiltrados.map((producto) => (
            <Link href={`/producto/${producto.id}`} key={producto.id} className="group relative rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
              {/* Fotos Grandes */}
              <div className="h-80 w-full relative">
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                <h2 className="text-3xl font-semibold mb-2">{producto.nombre}</h2>
                <p className="text-neutral-200 line-clamp-2">{producto.descripcionBreve}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}