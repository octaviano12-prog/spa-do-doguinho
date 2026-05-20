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
  ArrowRight,
} from "lucide-react";

import client from "../api/client";

const whatsappHref = "https://wa.me/5518999999999";

const img = (path) => `/images/${path}`;

const fallbackServices = [
  {
    id: "banho",
    name: "Banho & Tosa",
    description:
      "Higiene completa, hidratação e acabamento premium.",
    image_url: img("service-banho.jpg"),
    icon: Scissors,
  },
  {
    id: "spa",
    name: "Spa Relaxante",
    description:
      "Experiência relaxante para deixar o pet confortável e feliz.",
    image_url: img("service-spa.jpg"),
    icon: Heart,
  },
  {
    id: "agenda",
    name: "Agendamento Online",
    description:
      "Escolha data e horário rapidamente pelo celular.",
    image_url: img("service-agendamento.jpg"),
    icon: CalendarCheck,
  },
];

export default function PublicHome() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    document.title = "SPA do Doguinho | Estética Pet Premium";

    async function load() {
      try {
        const { data } = await client.get("/services");

        setServices(
          Array.isArray(data)
            ? data.filter((s) => Number(s.active) !== 0)
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
    return services.length
      ? services.slice(0, 3).map((s, i) => ({
          ...s,
          icon: fallbackServices[i]?.icon || Scissors,
          image_url:
            s.image_url || fallbackServices[i]?.image_url,
        }))
      : fallbackServices;
  }, [services]);

  function goBooking() {
    const mobile = window.innerWidth <= 768;

    navigate(
      mobile
        ? "/agendamento-mobile"
        : "/agendamento"
    );
  }

  return (
    <div className="premiumHome">

      {/* WHATSAPP FLOAT */}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="whatsappFloat"
      >
        <MessageCircle size={28} />
      </a>

      {/* MOBILE CTA */}

      <button
        className="mobileBookingCta"
        onClick={goBooking}
      >
        <div>
          <strong>Agendamento Online</strong>
          <span>Reserve agora mesmo</span>
        </div>

        <ArrowRight size={22} />
      </button>

      {/* HEADER */}

      <header className="premiumHeader">

        <Link to="/" className="premiumLogo">

          <div className="premiumLogoIcon">
            <Dog />
          </div>

          <div>
            <strong>SPA do Doguinho</strong>
            <span>
              Estética pet premium
            </span>
          </div>

        </Link>

        <nav className="premiumNav">
          <Link to="/">Home</Link>
          <Link to="/servicos-publico">Serviços</Link>
          <Link to="/galeria-publica">Galeria</Link>
          <a href="#sobre">Quem Somos</a>
          <a href="#contato">Contato</a>
        </nav>

        <button
          className="premiumBookingBtn"
          onClick={goBooking}
        >
          <CalendarCheck size={18} />
          Agendar
        </button>

      </header>

      {/* HERO */}

      <section className="premiumHero">

        <div className="heroBlur heroBlur1" />
        <div className="heroBlur heroBlur2" />

        <motion.div
          className="heroLeft"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >

          <div className="heroTag">
            <Sparkles size={15} />
            Atendimento Premium
          </div>

          <h1>
            Seu pet merece uma experiência de
            <span> luxo, carinho e cuidado.</span>
          </h1>

          <p>
            Banho, tosa, spa, vacinas e estética pet
            com agendamento online e atendimento
            profissional.
          </p>

          <div className="heroButtons">

            <button
              className="btnPrimary"
              onClick={goBooking}
            >
              <CalendarCheck size={18} />
              Agendar agora
            </button>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btnSecondary"
            >
              <Phone size={18} />
              WhatsApp
            </a>

          </div>

          <div className="heroFeatures">

            <div>
              <ShieldCheck size={22} />
              <span>Ambiente seguro</span>
            </div>

            <div>
              <Heart size={22} />
              <span>Atendimento humanizado</span>
            </div>

            <div>
              <Leaf size={22} />
              <span>Produtos premium</span>
            </div>

          </div>

        </motion.div>

        <motion.div
          className="heroRight"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="heroImageGlow" />

          <img
            src={img("hero-dog.png")}
            alt="SPA do Doguinho"
            className="heroDog"
          />

          <div className="heroFloatingCard">

            <div className="heroStars">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={15}
                  fill="currentColor"
                />
              ))}
            </div>

            <strong>+3.500 pets atendidos</strong>

            <span>
              Referência em estética pet premium
            </span>

          </div>

        </motion.div>

      </section>

      {/* STATS */}

      <section className="premiumStats">

        {[
          {
            icon: PawPrint,
            value: "+3.500",
            label: "Pets atendidos",
          },

          {
            icon: Award,
            value: "5 anos",
            label: "Experiência",
          },

          {
            icon: Clock,
            value: "Online",
            label: "Agendamento rápido",
          },

          {
            icon: Gift,
            value: "Premium",
            label: "Experiência exclusiva",
          },
        ].map(({ icon: Icon, value, label }) => (

          <motion.div
            className="premiumStatCard"
            key={value}
            whileHover={{ y: -8 }}
          >

            <Icon size={30} />

            <strong>{value}</strong>

            <span>{label}</span>

          </motion.div>

        ))}

      </section>

      {/* SERVICES */}

      <section className="premiumServices">

        <div className="sectionTitle">

          <span>
            <Sparkles size={15} />
            Serviços
          </span>

          <h2>
            Tudo para o bem-estar do seu pet
          </h2>

        </div>

        <div className="servicesGrid">

          {serviceList.map((service) => {

            const Icon =
              service.icon || Scissors;

            return (

              <motion.div
                key={service.id}
                className="serviceCard"
                whileHover={{ y: -10 }}
              >

                <img
                  src={service.image_url}
                  alt={service.name}
                />

                <div className="serviceOverlay" />

                <div className="serviceContent">

                  <Icon size={28} />

                  <strong>
                    {service.name}
                  </strong>

                  <p>
                    {service.description}
                  </p>

                  <Link to="/servicos-publico">
                    Ver detalhes →
                  </Link>

                </div>

              </motion.div>

            );
          })}

        </div>

      </section>

      {/* ABOUT */}

      <section
        className="premiumAbout"
        id="sobre"
      >

        <div className="aboutContent">

          <span className="aboutTag">
            Sobre nós
          </span>

          <h2>
            Um espaço criado para encantar
            pets e tutores.
          </h2>

          <p>
            O SPA do Doguinho oferece uma
            experiência moderna, acolhedora e
            premium para garantir conforto,
            segurança e carinho.
          </p>

          <div className="aboutChecklist">

            {[
              "Ambiente climatizado",
              "Produtos premium",
              "Equipe especializada",
              "Atendimento humanizado",
            ].map((item) => (

              <div key={item}>

                <CheckCircle2 size={20} />

                <span>{item}</span>

              </div>

            ))}

          </div>

        </div>

        <img
          src={img("spa-recepcao.jpg")}
          alt="Recepção"
          className="aboutImage"
        />

      </section>

      {/* TESTIMONIALS */}

      <section className="premiumTestimonials">

        <div className="sectionTitle">

          <span>Depoimentos</span>

          <h2>
            Quem conhece recomenda
          </h2>

        </div>

        <div className="testimonialGrid">

          {[
            [
              "Juliana",
              "Meu pet voltou lindo e super feliz.",
            ],

            [
              "Amanda",
              "Atendimento impecável e ambiente maravilhoso.",
            ],

            [
              "Carlos",
              "Melhor experiência pet da cidade.",
            ],
          ].map(([name, text]) => (

            <motion.div
              className="testimonialCard"
              key={name}
              whileHover={{ y: -8 }}
            >

              <Quote size={30} />

              <p>
                “{text}”
              </p>

              <strong>{name}</strong>

              <div className="heroStars">

                {[1,2,3,4,5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="currentColor"
                  />
                ))}

              </div>

            </motion.div>

          ))}

        </div>

      </section>

      {/* GALLERY */}

      <section className="premiumGallery">

        <div className="sectionTitle">

          <span>Galeria</span>

          <h2>
            Momentos especiais
          </h2>

        </div>

        <div className="galleryGrid">

          {(gallery.length
            ? gallery.slice(0, 4)
            : [
                {
                  id: 1,
                  image_url: img("gallery-1.jpg"),
                },

                {
                  id: 2,
                  image_url: img("gallery-human-1.jpg"),
                },

                {
                  id: 3,
                  image_url: img("service-spa.jpg"),
                },

                {
                  id: 4,
                  image_url:
                    img("service-agendamento.jpg"),
                },
              ]).map((item) => (

            <motion.div
              key={item.id}
              className="galleryItem"
              whileHover={{ scale: 1.03 }}
            >

              <img
                src={item.image_url}
                alt="Galeria"
              />

            </motion.div>

          ))}

        </div>

      </section>

      {/* CTA */}

      <section
        className="premiumCta"
        id="contato"
      >

        <div className="premiumCtaBox">

          <div>

            <span>
              <MapPin size={15} />
              Atendimento premium
            </span>

            <h2>
              Pronto para cuidar do seu
              doguinho?
            </h2>

            <p>
              Agende agora mesmo pelo site
              ou WhatsApp.
            </p>

          </div>

          <div className="heroButtons">

            <button
              onClick={goBooking}
              className="btnPrimary"
            >
              Agendar agora
            </button>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btnSecondary"
            >
              WhatsApp
            </a>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="premiumFooter">

        <div>

          <strong>
            SPA do Doguinho
          </strong>

          <span>
            Estética pet premium
          </span>

        </div>

        <div>

          <strong>
            Navegação
          </strong>

          <Link to="/">
            Home
          </Link>

          <Link to="/servicos-publico">
            Serviços
          </Link>

          <Link to="/galeria-publica">
            Galeria
          </Link>

        </div>

        <div>

          <strong>
            Contato
          </strong>

          <span>
            (18) 99999-9999
          </span>

          <span>
            Segunda a Sexta • 08h às 18h
          </span>

        </div>

      </footer>

    </div>
  );
}
