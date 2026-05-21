import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  User,
} from "lucide-react";

import client from "../api/client";

const whatsappHref = "https://wa.me/5518999999999";

const img = (path) => `/images/${path}`;

const fallbackServices = [
  {
    id: "banho",
    name: "Banho & Tosa",
    description:
      "Higiene completa, pelagem bem cuidada e finalização cheia de charme.",
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

        setServices(
          Array.isArray(data)
            ? data.filter((service) => Number(service.active) !== 0)
            : []
        );
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
    if (!services.length) return fallbackServices;

    return services.slice(0, 3).map((service, index) => ({
      ...service,
      icon: fallbackServices[index]?.icon || Scissors,
      image_url: service.image_url || fallbackServices[index]?.image_url,
    }));
  }, [services]);

  const galleryList = gallery.length
    ? gallery.slice(0, 4)
    : [
        { id: 1, image_url: img("gallery-1.jpg"), title: "Banho premium" },
        { id: 2, image_url: img("gallery-human-1.jpg"), title: "Tutor e pet" },
        { id: 3, image_url: img("service-spa.jpg"), title: "Spa relaxante" },
        {
          id: 4,
          image_url: img("service-agendamento.jpg"),
          title: "Agendamento online",
        },
      ];

  function goBooking() {
    navigate(window.innerWidth <= 768 ? "/agendamento-mobile" : "/agendamento");
  }

  function scrollToSection(id) {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <div className="publicSite cinemaHome">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="whatsappFloat"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle size={30} />
      </a>

      <header className="publicHeader cinemaHeader">
        <Link to="/" className="publicLogo">
          <div className="brandIcon">
            <Dog />
          </div>

          <div>
            <strong>SPA do Doguinho</strong>
            <span>Cuidado com amor para seu melhor amigo</span>
          </div>
        </Link>

        <nav className="publicNav">
          <Link to="/">Home</Link>
          <Link to="/servicos-publico">Serviços</Link>
          <Link to="/galeria-publica">Galeria</Link>

          <button
            type="button"
            className="navButton"
            onClick={() => scrollToSection("sobre")}
          >
            Quem Somos
          </button>

          <button
            type="button"
            className="navButton"
            onClick={() => scrollToSection("contato")}
          >
            Contato
          </button>
        </nav>

        <div className="headerActions">
          <Link to="/login" className="accountLink">
            <User size={18} />
            Minha Conta
          </Link>

          <button onClick={goBooking} className="btn gold publicHeaderCta">
            <CalendarCheck size={18} />
            Agendar Agora
          </button>
        </div>
      </header>

      <section className="cinemaHero">
        <div className="cinemaHeroBg" />
        <div className="cinemaHeroOverlay" />

        <div className="heroParticles">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <span key={item} />
          ))}
        </div>

        <div className="cinemaHeroContent">
          <motion.div
            className="cinemaHeroText"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="cinemaBadge">
              <Star size={16} fill="currentColor" />
              Referência em estética pet
            </div>

            <h1>
              Cuidado, carinho e beleza para o seu{" "}
              <span>melhor amigo</span>
            </h1>

            <p>
              Banho, tosa e relaxamento com profissionais especializados que
              amam o que fazem. Seu pet merece o melhor!
            </p>

            <div className="cinemaButtons">
              <button onClick={goBooking} className="btn gold">
                <CalendarCheck size={18} />
                Agendar Horário
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn ghost"
              >
                <Phone size={18} />
                Falar no WhatsApp
              </a>
            </div>

            <div className="cinemaFeatures">
              <div>
                <ShieldCheck size={24} />
                <strong>Ambiente Seguro</strong>
                <span>Monitorado 24h</span>
              </div>

              <div>
                <Heart size={24} />
                <strong>Profissionais</strong>
                <span>Especializados</span>
              </div>

              <div>
                <Leaf size={24} />
                <strong>Produtos Premium</strong>
                <span>Hipoalergênicos</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="cinemaHeroVisual"
            initial={{ opacity: 0, scale: 0.96, x: 35 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="dogGlow" />

            <img
              src={img("hero-dog.png")}
              alt="SPA do Doguinho"
              className="cinemaDog"
            />

            <div className="goldRing" />

            <div className="cinemaReviewCard">
              <div className="heroStars">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} size={18} fill="currentColor" />
                ))}
              </div>

              <strong>5.0 de 500+ avaliações</strong>
              <span>Clientes e pets felizes!</span>
            </div>
          </motion.div>
        </div>

        <section className="cinemaStats">
          {[
            { icon: PawPrint, value: "+3.500", label: "Pets atendidos" },
            { icon: Award, value: "5 anos", label: "De experiência" },
            { icon: CalendarCheck, value: "Online", label: "Agendamento fácil" },
            { icon: Gift, value: "Premium", label: "Benefícios exclusivos" },
          ].map(({ icon: Icon, value, label }) => (
            <div className="cinemaStatItem" key={value}>
              <div className="cinemaStatIcon">
                <Icon size={30} />
              </div>

              <div>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </div>
          ))}
        </section>
      </section>

      <section className="servicesSection" id="servicos">
        <div className="sectionTitle">
          <span>
            <Sparkles size={16} />
            Serviços especiais
          </span>
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
                carinho, segurança e uma experiência premium para encantar
                clientes.
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

          <img
            className="aboutImage"
            src={img("spa-recepcao.jpg")}
            alt="Recepção SPA do Doguinho"
          />
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
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={item} size={14} fill="currentColor" />
                  ))}
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
          {galleryList.map((item) => (
            <div className="homeGalleryItem" key={item.id}>
              <img
                src={item.image_url}
                alt={item.title || "Galeria SPA do Doguinho"}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="contactSection" id="contato">
        <div className="contactBox card">
          <div>
            <span className="pageKicker">
              <MapPin size={15} />
              Agendamento fácil
            </span>

            <h2>Pronto para mimar seu doguinho?</h2>

            <p>Escolha o melhor horário pelo site ou fale direto no WhatsApp.</p>
          </div>

          <div className="heroButtons">
            <button onClick={goBooking} className="btn gold">
              Começar agendamento
            </button>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn ghost"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="publicFooter premiumFooter">
        <div className="footerColumn">
          <div className="footerBrand">
            <div className="brandIcon">
              <Dog size={24} />
            </div>

            <div>
              <strong>SPA do Doguinho</strong>
              <span>Cuidado com amor para seu melhor amigo.</span>
            </div>
          </div>
        </div>

        <div className="footerColumn">
          <strong>Links rápidos</strong>

          <div className="footerLinks">
            <Link to="/">Home</Link>
            <Link to="/servicos-publico">Serviços</Link>
            <Link to="/galeria-publica">Galeria</Link>
            <button type="button" onClick={() => scrollToSection("sobre")}>
              Quem Somos
            </button>
            <button type="button" onClick={() => scrollToSection("contato")}>
              Contato
            </button>
          </div>
        </div>

        <div className="footerColumn">
          <strong>Contato</strong>

          <div className="footerInfo">
            <span>(18) 99999-9999</span>
            <span>Segunda a Sexta — 08:00 às 18:00</span>
          </div>
        </div>

        <div className="footerColumn">
          <strong>Redes sociais</strong>

          <div className="footerSocials">
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
