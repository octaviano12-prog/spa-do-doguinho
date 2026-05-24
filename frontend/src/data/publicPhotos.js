export const publicPhotos = {
  heroBath:
    "https://images.pexels.com/photos/6131158/pexels-photo-6131158.jpeg?auto=compress&cs=tinysrgb&w=1800",
  bathCare:
    "https://images.pexels.com/photos/19145888/pexels-photo-19145888.jpeg?auto=compress&cs=tinysrgb&w=1400",
  grooming:
    "https://images.pexels.com/photos/19145884/pexels-photo-19145884.jpeg?auto=compress&cs=tinysrgb&w=1400",
  towel:
    "https://images.pexels.com/photos/6131162/pexels-photo-6131162.jpeg?auto=compress&cs=tinysrgb&w=1400",
  vet:
    "https://images.pexels.com/photos/7468980/pexels-photo-7468980.jpeg?auto=compress&cs=tinysrgb&w=1400",
  vetCare:
    "https://images.pexels.com/photos/6234626/pexels-photo-6234626.jpeg?auto=compress&cs=tinysrgb&w=1400",
  essentials:
    "https://images.pexels.com/photos/4432261/pexels-photo-4432261.jpeg?auto=compress&cs=tinysrgb&w=1400",
  salon:
    "https://images.pexels.com/photos/6816863/pexels-photo-6816863.jpeg?auto=compress&cs=tinysrgb&w=1400"
};

export const homePhotoStories = [
  {
    title: "Banho com calma",
    description: "Rotina de limpeza feita com paciência, segurança e carinho.",
    image: publicPhotos.bathCare
  },
  {
    title: "Tosa no capricho",
    description: "Acabamento bonito para valorizar cada raça e cada pelagem.",
    image: publicPhotos.grooming
  },
  {
    title: "Cuidado pós-banho",
    description: "Toalha, perfume e aquele momento gostoso antes de voltar para casa.",
    image: publicPhotos.towel
  }
];

export const fallbackGallery = [
  {
    id: "fallback-1",
    title: "Banho premium",
    description: "Cuidado completo, carinho e acabamento especial.",
    image_url: publicPhotos.bathCare
  },
  {
    id: "fallback-2",
    title: "Tosa delicada",
    description: "Detalhes feitos com técnica para deixar o pet mais bonito.",
    image_url: publicPhotos.grooming
  },
  {
    id: "fallback-3",
    title: "Pet relaxado",
    description: "Um atendimento pensado para conforto, beleza e bem-estar.",
    image_url: publicPhotos.towel
  },
  {
    id: "fallback-4",
    title: "Atenção veterinária",
    description: "Cuidado preventivo com olhar profissional e acolhedor.",
    image_url: publicPhotos.vet
  },
  {
    id: "fallback-5",
    title: "Saúde em dia",
    description: "Acompanhamento para tutores que querem praticidade e segurança.",
    image_url: publicPhotos.vetCare
  },
  {
    id: "fallback-6",
    title: "Rotina pet organizada",
    description: "Produtos, espaço e atendimento preparados para uma experiência tranquila.",
    image_url: publicPhotos.essentials
  }
];

export function getPublicServicePhoto(name = "", category = "") {
  const text = `${name} ${category}`.toLowerCase();

  if (text.includes("vacina")) return publicPhotos.vet;
  if (text.includes("spa")) return publicPhotos.towel;
  if (text.includes("tosa")) return publicPhotos.grooming;
  if (text.includes("banho")) return publicPhotos.bathCare;

  return publicPhotos.heroBath;
}
