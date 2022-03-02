const { send } = require("express/lib/response");
const jwt = require('jsonwebtoken');

const db = require("../models");
const User = db.appli;
const Group = db.groups;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  const isIdUnique = email =>
  User.findOne({ where: { email}, attributes: ['email'] })
    .then(token => token !== null)
    .then(isUnique => isUnique);
  isIdUnique(req.body.email).then(isUnique => {
    if (isUnique){
      res.status(400).send({
        message: "email already exists!"
      });
      return;
    };
    // Create a user
    const user = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      group: req.body.group ? req.body.group : 0
    };
    // Save user in the database
    User.create(user)
      .then(data => {
        res.send({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
  });
};
// Retrieve all users from the database.
exports.findAllUsers = (req, res) => {
  try{
    const authToken = jwt.verify(req.headers.authjwt, 'RANDOM_TOKEN_SECRET');
    let condition = {id: { [Op.ne]: authToken.userId }};
    User.findAll({ where: condition })
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
// Match an email and password
exports.login = (req, res) => {
    User.findOne({
      attributes:['id','password'],
      where:{email:req.body.email}
    }).then(data => {
      if (!data){
        res.status(401).send({
          message:
            "Email does not exist."
        });
        return;
      }
      if (data.password != req.body.password){
        res.status(401).send({
          message:
            "Email and password do not match."
        });
        return;
      };
      const token = jwt.sign(
        { userId: data.id },
        'RANDOM_TOKEN_SECRET',
        { expiresIn: '24h' });
      res.send({ 
        userId: data.id,
        token: token});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while matching email/pw."
      });
    });
};
// // Update a Tutorial by the id in the request
// exports.update = (req, res) => {
//     const id = req.params.id;
//     Tutorial.update(req.body, {
//       where: { id: id }
//     })
//       .then(num => {
//         if (num == 1) {
//           res.send({
//             message: "Tutorial was updated successfully."
//           });
//         } else {
//           res.send({
//             message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).send({
//           message: "Error updating Tutorial with id=" + id
//         });
//       });
// };
// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {
//     const id = req.params.id;
//     Tutorial.destroy({
//       where: { id: id }
//     })
//       .then(num => {
//         if (num == 1) {
//           res.send({
//             message: "Tutorial was deleted successfully!"
//           });
//         } else {
//           res.send({
//             message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).send({
//           message: "Could not delete Tutorial with id=" + id
//         });
//       });
// };
// // Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {
//     Tutorial.destroy({
//         where: {},
//         truncate: false
//       })
//         .then(nums => {
//           res.send({ message: `${nums} Tutorials were deleted successfully!` });
//         })
//         .catch(err => {
//           res.status(500).send({
//             message:
//               err.message || "Some error occurred while removing all tutorials."
//           });
//         });
// };
// // Find all published Tutorials
// exports.findAllPublished = (req, res) => {
//     Tutorial.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving tutorials."
//       });
//     });
// };