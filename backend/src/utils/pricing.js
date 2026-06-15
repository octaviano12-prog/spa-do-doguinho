function cleanText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function numberValue(value) {
  const parsed = Number(String(value || "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeSizeCategory(value) {
  const size = cleanText(value);
  if (["pequeno", "small", "p"].includes(size)) return "small";
  if (["medio", "medium", "m"].includes(size)) return "medium";
  if (["grande", "large", "g"].includes(size)) return "large";
  if (["gigante", "giant", "gg"].includes(size)) return "giant";
  return "";
}

function sizeFromWeight(weight) {
  const value = numberValue(weight);
  if (!value) return "";
  if (value <= 10) return "small";
  if (value <= 25) return "medium";
  if (value <= 40) return "large";
  return "giant";
}

function petSizeKey(pet) {
  return normalizeSizeCategory(pet?.size_category) || sizeFromWeight(pet?.weight);
}

function sizeForDatabase(sizeCategory, weight) {
  const size = normalizeSizeCategory(sizeCategory) || sizeFromWeight(weight);
  return {
    small: "pequeno",
    medium: "medio",
    large: "grande",
    giant: "gigante"
  }[size] || null;
}

function estimatedBathTime(sizeCategory) {
  const size = normalizeSizeCategory(sizeCategory);
  return {
    small: 60,
    medium: 75,
    large: 90,
    giant: 120
  }[size] || 60;
}

function priceForService(service, pet) {
  const size = petSizeKey(pet);
  const bySize = numberValue(service?.[`price_${size}`]);
  const base = numberValue(service?.price);
  return bySize || base;
}

function durationForService(service, pet) {
  const size = petSizeKey(pet);
  const bySize = numberValue(service?.[`duration_${size}`]);
  const base = numberValue(service?.duration_minutes);
  const petEstimate = numberValue(pet?.estimated_bath_time);
  return bySize || base || petEstimate || 60;
}

module.exports = {
  durationForService,
  estimatedBathTime,
  normalizeSizeCategory,
  petSizeKey,
  priceForService,
  sizeForDatabase,
  sizeFromWeight
};
