const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const User=sequelize.define("user",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
        },
    name:{
         type:Sequelize.STRING,
         allowNull:false
         },
    email:{
        type:Sequelize.STRING,
        allowNull:false
        },
    password:{
        type:Sequelize.STRING,
        allowNull:false
        },
        isPremiumUser: { type: Sequelize.BOOLEAN, defaultValue:0 },
  resetToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  resetTokenExpiration: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});
module.exports=User;