import React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";
import PageHeader from "../components/PageHeader";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  async function load() {
    const { data } = await client.get("/gallery");
    setItems(data);
  }

  useEffect(() => { load(); }, []);

  async function upload(e) {
    e.preventDefault();
    if (!file) return toast.error("Selecione uma imagem");
    const fd = new FormData();
    fd.append("image", file);
    try {
      const up = await client.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      await client.post("/gallery", { title, image_url: up.data.path });
      setFile(null);
      setTitle("");
      toast.success("Imagem enviada");
      load();
    } catch {
      toast.error("Erro no upload");
    }
  }

  return (
    <>
      <PageHeader title="Galeria" subtitle="Fotos para usar no site e no painel" />
      <form className="card uploadBox" onSubmit={upload}>
        <input className="input" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn gold">Enviar imagem</button>
      </form>
      <div className="gallery">
        {items.map((item) => (
          <div className="card galleryItem" key={item.id}>
            <img src={`${import.meta.env.VITE_API_URL?.replace("/api","") || "http://localhost:3000"}${item.image_url}`} />
            <strong>{item.title}</strong>
          </div>
        ))}
      </div>
    </>
  );
}
