module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      group: {
        type: Sequelize.INTEGER
      }
    });
    const Group = sequelize.define("group", {
      name:{
        type: Sequelize.STRING
      }
    });
    return User;
  };