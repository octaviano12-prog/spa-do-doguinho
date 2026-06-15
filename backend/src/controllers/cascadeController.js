const crud = require("./crudController");

exports.deletePetCascade = crud.remove("pets");
exports.deleteCustomerCascade = crud.remove("customers");
