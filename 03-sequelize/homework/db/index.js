const { Sequelize, Op } = require('sequelize');
const modelCharacter = require('./models/Character.js');
const modelAbility = require('./models/Ability.js');
const modelRole = require('./models/Role.js');

const db = new Sequelize('postgres://postgres:Unicentro07@localhost:5432/henry_sequelize', {
  logging: false,
});

modelCharacter(db);
modelAbility(db);
modelRole(db);

const { Character, Ability, Role} = db.models;

Character.hasMany(Ability);       // 1 Character tiene MUCHAS Ability
Ability.belongsTo(Character);     // MUCHAS Ability puede tener 1 CHaracter

Character.belongsToMany(Role, {through:'Character_Role'});    // Muchos a Muchos con tabla intermedia
Role.belongsToMany(Character, {through:'Character_Role'});    // Muchos a Muchos  con tabla intermedia

module.exports = {
  ...db.models,
  db,
  Op
}