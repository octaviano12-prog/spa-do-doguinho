import { apiRequest } from "./api";

export async function getDashboardStats() {
  const [
    customers,
    pets,
    appointments,
    payments
  ] = await Promise.all([
    apiRequest("/customers"),
    apiRequest("/pets"),
    apiRequest("/appointments"),
    apiRequest("/payments")
  ]);

  const revenue = payments.reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0
  );

  return {
    customers: customers.length,
    pets: pets.length,
    appointments: appointments.length,
    revenue
  };
}
