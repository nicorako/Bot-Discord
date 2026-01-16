const Discord = require("discord.js");
const bot = new Discord.Client({intents: 53608447});
let token = process.env.TOKEN


bot.login(token)