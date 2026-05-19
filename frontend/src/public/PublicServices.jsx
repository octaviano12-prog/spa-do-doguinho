import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarCheck,
  Clock,
  PawPrint,
  Scissors,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import client from "../api/client";

const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function PublicServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function loadServices() {
      try {
        const { data } = await client.get("/services");
        setServices(Array.isArray(data) ? data.filter((s) => Number(s.active) !== 0) : []);
      } catch {
        setServices([]);
      }
    }

    loadServices();
  }, []);

  const fallback = [
    { id: "banho", name: "Banho Premium", price: 79.9, duration_minutes: 60, description: "Banho completo com produtos especiais." },
    { id: "tosa", name: "Tosa Higiênica", price: 69.9, duration_minutes: 45, description: "Cuidado, acabamento e conforto para seu pet." },
    { id: "spa", name: "Spa Relaxante", price: 99.9, duration_minutes: 80, description: "Experiência premium com carinho e bem-estar." },
  ];

  const list = services.length ? services : fallback;

  return (
    <div className="publicSite publicInnerPage">
      <header className="publicHeader">
        <Link to="/" className="publicLogo">
          <div className="brandIcon"><PawPrint /></div>
          <div>
            <strong>SPA do Doguinho</strong>
            <span>Serviços premium</span>
          </div>
        </Link>

        <nav className="publicNav">
          <Link to="/">Home</Link>
          <Link to="/galeria-publica">Galeria</Link>
          <Link to="/contato">Contato</Link>
          <Link to="/agendar" className="btn gold">Agendar</Link>
        </nav>
      </header>

      <section className="publicPageHero">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="backLink">
            <ArrowLeft size={17} />
            Voltar para home
          </Link>

          <span className="pageKicker">
            <Sparkles size={15} />
            Serviços especiais
          </span>

          <h1>Escolha o melhor cuidado para seu pet</h1>

          <p>
            Banho, tosa, hidratação, cuidados especiais e serviços pensados para deixar seu doguinho feliz, cheiroso e confortável.
          </p>
        </motion.div>
      </section>

      <section className="publicServicesList">
        {list.map((service, index) => (
          <motion.article
            className="card servicePublicCard"
            key={service.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <div className="serviceIcon">
              <Scissors size={30} />
            </div>

            <div className="servicePublicContent">
              <strong>{service.name}</strong>
              <p>{service.description || "Serviço premium para cuidado, beleza e bem-estar do seu pet."}</p>

              <div className="serviceMeta">
                <span>
                  <Clock size={15} />
                  {service.duration_minutes || 30} min
                </span>

                <span>
                  <ShieldCheck size={15} />
                  Atendimento premium
                </span>
              </div>
            </div>

            <div className="servicePriceBox">
              <span>A partir de</span>
              <strong>{money(service.price)}</strong>

              <Link to="/agendar" className="btn gold">
                <CalendarCheck size={17} />
                Agendar
              </Link>
            </div>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
