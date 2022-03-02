module.exports = app => {
    const auth = require('../middleware/auth');

    const applis = require("../controllers/appli.controller.js");
    var router = require("express").Router();

    // Create a new User
    router.post("/subscribe", applis.create);
    // Retrieve all Tutorials
    router.get("/users", applis.findAllUsers);
    // Match email and password
    router.post("/login", applis.login);
    // // Retrieve a single Tutorial with id
    // router.get("/:id", tutorials.findOne);
    // // Update a Tutorial with id
    // router.put("/:id", tutorials.update);
    // // Delete a Tutorial with id
    // router.delete("/:id", tutorials.delete);
    // // Delete all Tutorials
    // router.delete("/", tutorials.deleteAll);
    app.use('/api', router);
  };