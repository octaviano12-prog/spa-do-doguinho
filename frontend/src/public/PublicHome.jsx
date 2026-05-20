import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award, CalendarCheck, CheckCircle2, Clock, Dog, Gift, Heart, Leaf,
  MapPin, MessageCircle, PawPrint, Phone, Quote, Scissors, ShieldCheck,
  Sparkles, Star
} from "lucide-react";
import client from "../api/client";

const whatsappHref = "https://wa.me/5518999999999";

const img = (path) => `/images/${path}`;

const fallbackServices = [
  {
    id: "banho",
    name: "Banho & Tosa",
    description: "Higiene completa, pelagem bem cuidada e finalização cheia de charme.",
    image_url: img("service-banho.jpg"),
    icon: Scissors,
  },
  {
    id: "spa",
    name: "Spa Relaxante",
    description: "Momento tranquilo para o pet relaxar e se sentir acolhido.",
    image_url: img("service-spa.jpg"),
    icon: Heart,
  },
  {
    id: "agenda",
    name: "Agendamento Online",
    description: "Escolha serviço, data e horário pelo site de forma rápida.",
    image_url: img("service-agendamento.jpg"),
    icon: CalendarCheck,
  },
];

export default function PublicHome() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    document.title = "SPA do Doguinho | Cuidado premium para seu pet";

    async function load() {
      try {
        const { data } = await client.get("/services");
        setServices(Array.isArray(data) ? data.filter((s) => Number(s.active) !== 0) : []);
      } catch {
        setServices([]);
      }

      try {
        const { data } = await client.get("/gallery");
        setGallery(Array.isArray(data) ? data : []);
      } catch {
        setGallery([]);
      }
    }

    load();
  }, []);

  const serviceList = useMemo(() => {
    return services.length
      ? services.slice(0, 3).map((s, i) => ({
          ...s,
          icon: fallbackServices[i]?.icon || Scissors,
          image_url: s.image_url || fallbackServices[i]?.image_url,
        }))
      : fallbackServices;
  }, [services]);

  function goBooking() {
    const mobile = window.innerWidth <= 768;
    navigate(mobile ? "/agendamento-mobile" : "/agendamento");
  }

  return (
    <div className="publicSite">
      <a href={whatsappHref} target="_blank" rel="noreferrer" className="whatsappFloat">
        <MessageCircle size={30} />
      </a>

      <button className="mobileBookingCta" onClick={goBooking}>
        <MessageCircle size={18} />
        Agendar pelo WhatsApp
      </button>

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

        <button onClick={goBooking} className="btn gold publicHeaderCta">
          <CalendarCheck size={18} />
          Agendar
        </button>
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
            <button onClick={goBooking} className="btn gold">
              <CalendarCheck size={18} />
              Agendar agora
            </button>

            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn ghost">
              <Phone size={18} />
              Falar no WhatsApp
            </a>
          </div>

          <div className="heroMiniCards">
            <div><ShieldCheck size={24} /><strong>Ambiente climatizado</strong><span>Conforto e segurança</span></div>
            <div><Heart size={24} /><strong>Atendimento com carinho</strong><span>Cuidado em cada detalhe</span></div>
            <div><Leaf size={24} /><strong>Produtos de qualidade</strong><span>Bem-estar para o pet</span></div>
          </div>
        </motion.div>

        <motion.div
          className="heroImageWrap"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="heroImageGlow" />
          <img src={img("hero-dog.png")} alt="SPA do Doguinho" className="heroDogImage" />

          <div className="heroFloatingCard">
            <div className="heroStars">
              {[1,2,3,4,5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <strong>5.0 de avaliação</strong>
            <span>Mais de 3.500 pets atendidos com carinho</span>
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

        <div className="servicesGrid serviceImageGrid">
          {serviceList.map((service) => {
            const Icon = service.icon || Scissors;
            return (
              <div className="card publicCard serviceImageCard" key={service.id}>
                <img src={service.image_url} alt={service.name} />
                <div>
                  <Icon size={30} />
                  <strong>{service.name}</strong>
                  <p>{service.description}</p>
                  <Link to="/servicos-publico">Ver serviços →</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="aboutSection" id="sobre">
        <div className="aboutPremiumGrid">
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
                "Ambiente climatizado e acolhedor.",
                "Produtos especiais para pele e pelagem.",
                "Atendimento com carinho de verdade.",
                "Profissionais experientes.",
              ].map((text) => (
                <div key={text}>
                  <CheckCircle2 size={20} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <img className="aboutImage" src={img("spa-recepcao.jpg")} alt="Recepção SPA do Doguinho" />
        </div>
      </section>

      <section className="testimonialsSection" id="depoimentos">
        <div className="sectionTitle">
          <span>Depoimentos</span>
          <h2>Quem conhece recomenda</h2>
        </div>

        <div className="testimonialPremiumGrid">
          <div className="testimonialCards">
            {[
              ["Juliana S.", "Meu pet voltou cheiroso, calmo e muito bem cuidado."],
              ["Carlos M.", "Gostei muito do agendamento online. Rápido e fácil."],
              ["Amanda R.", "Equipe atenciosa e espaço organizado. Recomendo!"],
            ].map(([name, text]) => (
              <div className="card testimonialCard" key={name}>
                <Quote size={26} />
                <p>“{text}”</p>
                <strong>{name}</strong>
                <div className="heroStars">
                  {[1,2,3,4,5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
              </div>
            ))}
          </div>

          <img src={img("testimonial-dog.jpg")} alt="Pet feliz no SPA" />
        </div>
      </section>

      <section className="servicesSection" id="galeria-preview">
        <div className="sectionTitle">
          <span>Galeria</span>
          <h2>Momentos especiais no SPA</h2>
        </div>

        <div className="homeGalleryGrid">
          {(gallery.length ? gallery.slice(0, 4) : [
            { id: 1, image_url: img("gallery-1.jpg"), title: "Banho premium" },
            { id: 2, image_url: img("gallery-human-1.jpg"), title: "Tutor e pet" },
            { id: 3, image_url: img("service-spa.jpg"), title: "Spa relaxante" },
            { id: 4, image_url: img("service-agendamento.jpg"), title: "Agendamento online" },
          ]).map((item) => (
            <div className="homeGalleryItem" key={item.id}>
              <img src={item.image_url} alt={item.title || "Galeria SPA do Doguinho"} />
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
            <button onClick={goBooking} className="btn gold">Começar agendamento</button>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn ghost">WhatsApp</a>
          </div>
        </div>
      </section>

      <footer className="publicFooter premiumFooter">
        <div>
          <strong>SPA do Doguinho</strong>
          <span>Cuidado com amor para seu melhor amigo.</span>
        </div>

        <div>
          <strong>Links rápidos</strong>
          <Link to="/">Home</Link>
          <Link to="/servicos-publico">Serviços</Link>
          <Link to="/galeria-publica">Galeria</Link>
        </div>

        <div>
          <strong>Contato</strong>
          <span>(18) 99999-9999</span>
          <span>Segunda a Sexta — 08:00 às 18:00</span>
        </div>
      </footer>
    </div>
  );
}
