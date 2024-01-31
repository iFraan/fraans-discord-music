const enmap = require('enmap');
const db = {};

db.guilds = new enmap('Guilds');

module.exports = db;