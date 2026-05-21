import React from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="heroSection relative w-full h-screen md:h-[80vh]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-dog.png')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-green-900 bg-opacity-60" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col justify-center items-start h-full px-6 md:px-20 max-w-6xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
          Seu pet merece uma experiência <span className="text-yellow-400">de luxo, carinho e cuidado</span>
        </h1>

        <p className="text-white text-sm md:text-lg mb-6 max-w-xl">
          Banho, tosa, spa, vacinas e estética pet com agendamento online e atendimento profissional.
        </p>

        <a
          href="#agendamento"
          className="bg-yellow-400 text-green-900 font-semibold px-6 py-3 rounded-md shadow-lg hover:bg-yellow-300 transition duration-300"
        >
          Agendar agora
        </a>
      </motion.div>
    </section>
  );
}
