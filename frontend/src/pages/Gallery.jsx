import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ImagePlus,
  Loader2,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";

import client from "../api/client";
import PageHeader from "../components/PageHeader";

const apiBase =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:3000";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const preview = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  async function load() {
    setLoading(true);

    try {
      const { data } = await client.get("/gallery");
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar galeria");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function upload(e) {
    e.preventDefault();

    if (!file) {
      toast.error("Selecione uma imagem");
      return;
    }

    setUploading(true);

    const fd = new FormData();
    fd.append("image", file);

    try {
      const up = await client.post("/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await client.post("/gallery", {
        title: title || "Imagem da galeria",
        image_url: up.data.path,
      });

      setFile(null);
      setTitle("");

      toast.success("Imagem enviada com sucesso");

      load();
    } catch {
      toast.error("Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Galeria"
        subtitle="Fotos para usar no site público e no painel administrativo"
      />

      <motion.form
        className="card uploadBox premiumPanel"
        onSubmit={upload}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="panelTitle">
          <div>
            <h2>Nova imagem</h2>
            <p>Envie fotos do ambiente, pets, serviços e campanhas</p>
          </div>
          <ImagePlus size={22} />
        </div>

        <div className="uploadGrid">
          <div className="uploadFields">
            <label>
              <span>Título da imagem</span>
              <input
                className="input"
                placeholder="Ex: Banho premium, Tosa bebê..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label>
              <span>Arquivo da imagem</span>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            <button className="btn gold" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <UploadCloud size={18} />
                  Enviar imagem
                </>
              )}
            </button>
          </div>

          <div className="uploadPreview">
            {preview ? (
              <img src={preview} alt="Pré-visualização" />
            ) : (
              <div>
                <ImageIcon size={34} />
                <span>Pré-visualização</span>
              </div>
            )}
          </div>
        </div>
      </motion.form>

      <div className="galleryHeader">
        <div>
          <h2>Imagens cadastradas</h2>
          <p>{items.length} imagem(ns) disponíveis</p>
        </div>
      </div>

      {loading ? (
        <div className="card premiumPanel tableLoading">
          <Loader2 size={22} className="spin" />
          <span>Carregando galeria...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="card premiumPanel premiumEmpty">
          <ImageIcon size={24} />
          <span>Nenhuma imagem cadastrada ainda.</span>
        </div>
      ) : (
        <div className="gallery premiumGallery">
          {items.map((item, index) => (
            <motion.div
              className="card galleryItem premiumGalleryItem"
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.035,
              }}
            >
              <img
                src={`${apiBase}${item.image_url}`}
                alt={item.title || "Imagem da galeria"}
              />

              <div className="galleryItemInfo">
                <strong>{item.title || "Imagem sem título"}</strong>
                <span>Galeria SPA do Doguinho</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
