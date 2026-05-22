import React from "react";
import PublicLayout from "../../components/public/PublicLayout";

export default function GaleriaPublicPage() {
  return (
    <PublicLayout>
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black">
            Galeria
          </h1>

          <p className="text-white/70 mt-4 text-xl">
            Veja alguns dos nossos atendimentos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((item) => (
            <div
              key={item}
              className="bg-white/10 rounded-3xl overflow-hidden"
            >
              <div className="h-[300px] bg-gradient-to-br from-green-400 to-emerald-700" />

              <div className="p-6">
                <h2 className="text-2xl font-black">
                  Atendimento #{item}
                </h2>

                <p className="text-white/70 mt-2">
                  Resultado incrível para nossos clientes pets.
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}
