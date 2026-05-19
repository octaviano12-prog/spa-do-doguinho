import React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Dog,
  HeartHandshake,
  PawPrint,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

export default function PublicHome() {
  return (
    <div className="publicSite">
      <header className="publicHeader">
        <div className="publicLogo">
          <div className="brandIcon">
            <Dog />
          </div>

          <div>
            <strong>SPA do Doguinho</strong>
            <span>Carinho, cuidado e beleza pet</span>
          </div>
        </div>

        <nav className="publicNav">
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre</a>
          <a href="#galeria">Galeria</a>
          <a href="#contato">Contato</a>
          <a href="/login" className="btn gold">
            Painel
          </a>
        </nav>
      </header>

      <section className="heroSection">
        <div className="heroGlow glowLeft" />
        <div className="heroGlow glowRight" />

        <motion.div
          className="heroContent"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="heroBadge">
            <Sparkles size={16} />
            SPA Premium para Pets
          </div>

          <h1>
            O cuidado que seu pet merece 💚
          </h1>

          <p>
            Banho, tosa, hidratação,
            vacinas e atendimento premium
            com carinho e segurança.
          </p>

          <div className="heroButtons">
            <button className="btn gold">
              <CalendarDays size={18} />
              Agendar agora
            </button>

            <button className="btn ghost">
              <PawPrint size={18} />
              Conhecer serviços
            </button>
          </div>
        </motion.div>

        <motion.div
          className="heroCard"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="heroImage">
            <Dog size={80} />
          </div>

          <div className="heroInfo">
            <strong>Atendimento premium</strong>

            <span>
              Ambiente confortável,
              seguro e preparado
              para o bem-estar do seu pet.
            </span>
          </div>
        </motion.div>
      </section>

      <section className="servicesSection" id="servicos">
        <div className="sectionTitle">
          <span>Nossos serviços</span>
          <h2>Serviços premium para seu pet</h2>
        </div>

        <div className="servicesGrid">
          <div className="card publicCard">
            <Scissors size={28} />
            <strong>Banho & Tosa</strong>
            <p>
              Higiene completa com
              produtos premium.
            </p>
          </div>

          <div className="card publicCard">
            <ShieldCheck size={28} />
            <strong>Vacinação</strong>
            <p>
              Controle completo
              de vacinas e reforços.
            </p>
          </div>

          <div className="card publicCard">
            <HeartHandshake size={28} />
            <strong>Atendimento VIP</strong>
            <p>
              Carinho, segurança e
              conforto para seu pet.
            </p>
          </div>
        </div>
      </section>

      <section className="aboutSection" id="sobre">
        <div className="sectionTitle">
          <span>Sobre nós</span>
          <h2>Amor e cuidado animal</h2>
        </div>

        <div className="aboutBox card">
          <p>
            O SPA do Doguinho nasceu
            para oferecer atendimento
            premium com carinho,
            responsabilidade e qualidade.
          </p>

          <div className="aboutStats">
            <div>
              <strong>+1000</strong>
              <span>Pets atendidos</span>
            </div>

            <div>
              <strong>5★</strong>
              <span>Avaliação clientes</span>
            </div>

            <div>
              <strong>Premium</strong>
              <span>Experiência pet</span>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonialsSection">
        <div className="sectionTitle">
          <span>Depoimentos</span>
          <h2>Quem conhece recomenda</h2>
        </div>

        <div className="testimonialGrid">
          <div className="card testimonialCard">
            <Star size={22} />

            <p>
              “Atendimento maravilhoso,
              meu cachorro ama!”
            </p>

            <strong>Mariana</strong>
          </div>

          <div className="card testimonialCard">
            <Star size={22} />

            <p>
              “Ambiente lindo e equipe
              extremamente cuidadosa.”
            </p>

            <strong>Carlos</strong>
          </div>
        </div>
      </section>

      <section className="contactSection" id="contato">
        <div className="sectionTitle">
          <span>Contato</span>
          <h2>Agende agora mesmo</h2>
        </div>

        <div className="contactBox card">
          <p>
            Entre em contato pelo WhatsApp
            e agende um horário para seu pet.
          </p>

          <button className="btn gold">
            <CalendarDays size={18} />
            Chamar no WhatsApp
          </button>
        </div>
      </section>

      <footer className="publicFooter">
        <strong>SPA do Doguinho</strong>

        <span>
          © 2026 — Sistema premium pet
        </span>
      </footer>
    </div>
  );
}
