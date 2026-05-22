import React from "react";
import PublicLayout from "../../components/public/PublicLayout";

export default function ServicosPublicPage() {
  const services = [
    {
      title: "Banho Completo",
      price: "R$ 50",
      desc: "Banho com produtos especiais e secagem profissional."
    },
    {
      title: "Tosa Higiênica",
      price: "R$ 40",
      desc: "Higiene completa e acabamento premium."
    },
    {
      title: "Tosa Completa",
      price: "R$ 80",
      desc: "Visual completo para deixar seu pet lindo."
    },
    {
      title: "Hidratação",
      price: "R$ 35",
      desc: "Tratamento especial para pelos macios e brilhantes."
    }
  ];

  return (
    <PublicLayout>
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black">
            Nossos Serviços
          </h1>

          <p className="text-white/70 mt-4 text-xl">
            Atendimento profissional para seu melhor amigo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-3xl p-8 border border-white/10"
            >
              <h2 className="text-3xl font-black">
                {service.title}
              </h2>

              <p className="text-green-300 text-2xl font-bold mt-4">
                {service.price}
              </p>

              <p className="text-white/70 mt-4">
                {service.desc}
              </p>

              <button className="mt-8 w-full bg-green-500 hover:bg-green-600 py-4 rounded-2xl font-bold">
                Agendar
              </button>
            </div>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}
