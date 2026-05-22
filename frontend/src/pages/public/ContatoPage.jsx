import React from "react";
import PublicLayout from "../../components/public/PublicLayout";

export default function ContatoPage() {
  return (
    <PublicLayout>
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white/10 rounded-[40px] p-10">
          <h1 className="text-6xl font-black">
            Contato
          </h1>

          <p className="text-white/70 mt-4 text-xl">
            Entre em contato para agendar um atendimento.
          </p>

          <div className="grid gap-6 mt-10">
            <input
              placeholder="Seu nome"
              className="bg-white/10 border border-white/10 rounded-2xl px-6 py-5 outline-none"
            />

            <input
              placeholder="Seu telefone"
              className="bg-white/10 border border-white/10 rounded-2xl px-6 py-5 outline-none"
            />

            <textarea
              rows={6}
              placeholder="Mensagem"
              className="bg-white/10 border border-white/10 rounded-2xl px-6 py-5 outline-none"
            />

            <button className="bg-green-500 hover:bg-green-600 py-5 rounded-2xl font-black text-lg">
              Enviar mensagem
            </button>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
