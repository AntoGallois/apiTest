const { send } = require("express/lib/response");
const jwt = require('jsonwebtoken');

const db = require("../models");
const User = db.users;
const Group = db.groups;
const Op = db.Sequelize.Op;

// Retrieve all groups from the database.
exports.findAllGroups = (req, res) => {
    try{
        // Validate request
        const authToken = jwt.verify(req.headers.authjwt, 'RANDOM_TOKEN_SECRET');
        Group.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving tutorials."
            });
        });
    } catch {
        res.status(401).send('Invalid Authorization Header');
    }
  };

// Create a new Group and add the creator
exports.newGroup = (req, res) => {
    try{
      // Validate request
      const authToken = jwt.verify(req.headers.authjwt, 'RANDOM_TOKEN_SECRET');
      // Create a group
      const group_name = {
        name : req.body.name
      };
      const user = User.findByPk(authToken.userId);
      // Save group in the database
      const group = Group.create(group_name)
      Promise.all([group, user])
        .then(data=>{
            data[0].addGroup(data[1]);
            res.send(
            {
                name: data[0].name,
                users: [{
                    email: data[1].email,
                    firstName: data[1].firstName,
                    lastName: data[1].lastName
                }]
            });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the group."
          });
        });
      } catch {
        res.status(401).send('Invalid Authorization Header');
      }
  };

// Invite another user to a group.
exports.invite = (req, res) => {
    try{
        const authToken = jwt.verify(req.headers.authjwt, 'RANDOM_TOKEN_SECRET');
        const inviter = User.findByPk(authToken.userId);
        const invited = User.findOne({ where: { email: req.body.email } });
        const group = Group.findByPk(req.params.group_id);

        Promise.all([group, inviter, invited])
            .then(data => {
                if (!data[0]){
                    res.status(401).send({
                      message:
                        `Group ${req.params.group_id} does not exist.`
                    });
                    return;
                  };
                data[0].hasGroup(data[1]).then(result => {
                    if (!result){
                        res.status(401).send({
                            message:
                                "You do not belong here."
                            });
                        return
                    }
                    if (!data[2]){
                        res.status(401).send({
                          message:
                            "Email does not exist."
                        });
                        return;
                      };
                    data[0].addGroup(data[2]);
                    res.send({
                        name:data[0].name,
                        users:[{
                            email: data[1].email,
                            firstName: data[1].firstName,
                            lastName: data[1].lastName
                        },
                        {
                            email: data[2].email,
                            firstName: data[2].firstName,
                            lastName: data[2].lastName
                        }]
                    });
                })
            })
            .catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while retrieving tutorials."
                });
            });
      } catch {
        res.status(401).send('Invalid Authorization Header');
      }
  };