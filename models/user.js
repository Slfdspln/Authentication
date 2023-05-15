var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

const sequelize = new Sequelize('ourDatabase', 'root', 'password', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
        },
        operatorsAliases: false
        });

        // set up User table

        var User = sequelize.define('user', {
            id: {
                type: Sequelize.INTEGER,
                unique: true,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });

        User.beforeCreate((user, options) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        });
    
        User.prototype.validPassword = function(password) {
            return bcrypt.compareSync(password, this.password);
        }

        // create all the defined tables in the specified database. 
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));  

// export User model for use in other files.
module.exports = User;