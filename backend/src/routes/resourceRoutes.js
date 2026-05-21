const router = require("express").Router();
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/admin");
const crud = require("../controllers/crudController");

const resources = {
  users: "users",
  customers: "customers",
  pets: "pets",
  services: "services",
  appointments: "appointments",
  payments: "payments",
  cash: "cash_movements",
  stock: "stock_items",
  stockMovements: "stock_movements",
  vaccines: "vaccines",
  gallery: "gallery",
  settings: "site_settings"
};

Object.entries(resources).forEach(([route, table]) => {
  router.get(`/${route}`, auth, adminOnly, crud.list(table));
  router.get(`/${route}/:id`, auth, adminOnly, crud.getOne(table));
  router.post(`/${route}`, auth, adminOnly, crud.create(table));
  router.put(`/${route}/:id`, auth, adminOnly, crud.update(table));
  router.delete(`/${route}/:id`, auth, adminOnly, crud.remove(table));
});

module.exports = router;
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
  cash: "cash_movements",
  stock: "stock_items",
  stockMovements: "stock_movements",
  vaccines: "vaccines",
  gallery: "gallery",
  settings: "site_settings"
};

Object.entries(resources).forEach(([route, table]) => {
  router.get(`/${route}`, auth, crud.list(table));
  router.get(`/${route}/:id`, auth, crud.getOne(table));
  router.post(`/${route}`, auth, crud.create(table));
  router.put(`/${route}/:id`, auth, crud.update(table));
  router.delete(`/${route}/:id`, auth, crud.remove(table));
});

module.exports = router;
