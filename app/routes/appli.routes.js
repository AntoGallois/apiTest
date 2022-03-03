module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const groups = require("../controllers/group.controller.js");
    var router = require("express").Router();

    // Create a new User
    router.post("/subscribe", users.create);
    // Retrieve all Tutorials
    router.get("/users", users.findAllUsers);
    // Match email and password
    router.post("/login", users.login);
    // Retrieve all Groups
    router.get("/groups", groups.findAllGroups);
    // Create a Group
    router.post("/groups", groups.newGroup);
    // Invite a user
    router.post("/groups/:group_id/invite", groups.invite);

    app.use('/api', router);
  };