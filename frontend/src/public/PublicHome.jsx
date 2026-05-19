import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Dog,
  Gift,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  Quote,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

const whatsappHref = "https://wa.me/5518999999999";

export default function PublicHome() {
  const services = [
    { title: "Banho & Tosa", icon: Scissors, desc: "Higiene completa, pelagem bem cuidada e finalização cheia de charme." },
    { title: "Spa Relaxante", icon: Heart, desc: "Momento tranquilo para o pet relaxar e se sentir acolhido." },
    { title: "Agendamento Online", icon: CalendarCheck, desc: "Escolha serviço, data e horário pelo site de forma rápida." },
  ];

  return (
    <div className="publicSite">
      <a href={whatsappHref} target="_blank" rel="noreferrer" className="whatsappFloat">
        <MessageCircle size={30} />
      </a>

      <header className="publicHeader">
        <Link to="/" className="publicLogo">
          <div className="brandIcon"><Dog /></div>
          <div>
            <strong>SPA do Doguinho</strong>
            <span>Cuidado com amor para seu melhor amigo</span>
          </div>
        </Link>

        <nav className="publicNav">
          <Link to="/">Home</Link>
          <Link to="/servicos-publico">Serviços</Link>
          <Link to="/galeria-publica">Galeria</Link>
          <a href="#sobre">Quem Somos</a>
          <a href="#contato">Contato</a>
        </nav>

        <Link to="/agendar" className="btn gold publicHeaderCta">
          Agendar
        </Link>
      </header>

      <section className="publicHero">
        <div className="heroGlow glowLeft" />
        <div className="heroGlow glowRight" />

        <motion.div className="heroContent" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
          <div className="heroBadge">
            <Star size={16} />
            Referência em estética pet
          </div>

          <h1>
            Cuidado, carinho e beleza para o seu <span>melhor amigo</span>
          </h1>

          <p>
            Banho, tosa, vacinas e relaxamento com atendimento premium,
            carinho de verdade e agendamento online.
          </p>

          <div className="heroButtons">
            <Link to="/agendar" className="btn gold">
              <CalendarCheck size={18} />
              Agendar horário
            </Link>

            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn ghost">
              <Phone size={18} />
              WhatsApp
            </a>
          </div>

          <div className="heroMiniCards">
            <div><ShieldCheck size={24} /><strong>Ambiente seguro</strong><span>Atendimento cuidadoso</span></div>
            <div><Heart size={24} /><strong>Profissionais</strong><span>Carinho em cada detalhe</span></div>
            <div><Leaf size={24} /><strong>Produtos premium</strong><span>Conforto e qualidade</span></div>
          </div>
        </motion.div>

        <motion.div className="heroPetCard" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="petCircle"><Dog size={100} /></div>
          <div className="ratingCard">
            <div>{[1,2,3,4,5].map((i) => <Star key={i} size={18} fill="currentColor" />)}</div>
            <strong>5.0 de avaliação</strong>
            <span>Clientes e pets felizes</span>
          </div>
        </motion.div>
      </section>

      <section className="publicStats">
        {[
          { icon: PawPrint, value: "+3.500", label: "Pets atendidos" },
          { icon: Award, value: "5 anos", label: "De experiência" },
          { icon: Clock, value: "Online", label: "Agendamento fácil" },
          { icon: Gift, value: "Premium", label: "Benefícios exclusivos" },
        ].map(({ icon: Icon, value, label }) => (
          <div className="statBox" key={value}>
            <Icon size={26} />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="servicesSection" id="servicos">
        <div className="sectionTitle">
          <span><Sparkles size={16} /> Serviços especiais</span>
          <h2>Tudo que seu pet precisa em um só lugar</h2>
        </div>

        <div className="servicesGrid">
          {services.map(({ title, icon: Icon, desc }) => (
            <div className="card publicCard" key={title}>
              <Icon size={32} />
              <strong>{title}</strong>
              <p>{desc}</p>
              <Link to="/servicos-publico">Ver serviços</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="aboutSection" id="sobre">
        <div className="aboutBox card">
          <div>
            <span className="pageKicker">Por que escolher a gente?</span>
            <h2>Um atendimento pensado para o pet e para o tutor</h2>
            <p>
              O SPA do Doguinho une visual profissional, agendamento fácil,
              carinho, segurança e uma experiência premium para encantar clientes.
            </p>
          </div>

          <div className="aboutChecklist">
            {[
              "Ambiente seguro e acolhedor.",
              "Produtos especiais para pele e pelagem.",
              "Agendamento online simples e rápido.",
            ].map((text) => (
              <div key={text}>
                <CheckCircle2 size={20} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonialsSection" id="depoimentos">
        <div className="sectionTitle">
          <span>Depoimentos</span>
          <h2>Quem conhece recomenda</h2>
        </div>

        <div className="testimonialGrid">
          {[
            "Meu pet voltou cheiroso, calmo e muito bem cuidado.",
            "Gostei muito do agendamento online. Rápido e fácil.",
            "Equipe atenciosa e espaço organizado. Recomendo!",
          ].map((text, index) => (
            <div className="card testimonialCard" key={text}>
              <Quote size={26} />
              <p>“{text}”</p>
              <strong>Cliente {index + 1}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="contactSection" id="contato">
        <div className="contactBox card">
          <div>
            <span className="pageKicker"><MapPin size={15} /> Agendamento fácil</span>
            <h2>Pronto para mimar seu doguinho?</h2>
            <p>Escolha o melhor horário pelo site ou fale direto no WhatsApp.</p>
          </div>

          <div className="heroButtons">
            <Link to="/agendar" className="btn gold">Começar agendamento</Link>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn ghost">WhatsApp</a>
          </div>
        </div>
      </section>

      <footer className="publicFooter">
        <strong>SPA do Doguinho</strong>
        <span>© 2026 — Cuidado, carinho e beleza pet</span>
      </footer>
    </div>
  );
}
