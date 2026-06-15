const router = require("express").Router();
const auth = require("../middlewares/auth");
const crud = require("../controllers/crudController");

const resources = {
  users: "users",
  customers: "customers",
  pets: "pets",
  services: "services",
  appointments: "appointments",
  payments: "payments",
  paymentSettings: "payment_settings",
  cash: "cash_movements",
  cashClosings: "cash_closings",
  stock: "stock_items",
  stock_items: "stock_items",
  stockMovements: "stock_movements",
  vaccines: "vaccines",
  vaccinations: "vaccinations",
  serviceHistory: "service_history",
  gallery: "gallery",
  availability: "availability",
  availabilityRules: "availability_rules",
  blockedDates: "blocked_dates",
  settings: "site_settings",
  siteProfile: "site_profile",
  activityLogs: "activity_logs"
};

Object.entries(resources).forEach(([route, table]) => {
  router.get(`/${route}`, auth, crud.list(table));
  router.get(`/${route}/:id`, auth, crud.getOne(table));
  router.post(`/${route}`, auth, crud.create(table));
  router.put(`/${route}/:id`, auth, crud.update(table));
  router.delete(`/${route}/:id`, auth, crud.remove(table));
});

module.exports = router;
