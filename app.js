const Discord = require('discord.js');
require('dotenv').config();
let token = process.env.TOKEN;
let fs = require('node:fs');
let path = require('node:path');
let { Client, Collection, GatewayIntentBits } = require('discord.js');
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

// bot.on('ready', async () => {
//   console.log(`${bot.user.tag} est bien en ligne !`);
// });

bot.commands = new Collection();
bot.cooldowns = new Collection();

let foldersPath = path.join(__dirname, 'commands');
let commandFolders = fs.readdirSync(foldersPath);

for (let folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  for (let file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      bot.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required 'data' or 'execute' property.`,
      );
    }
  }
}

let eventsPath = path.join(__dirname, 'events');
let eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (let file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    bot.once(event.name, (...args) => event.execute(...args));
  } else {
    bot.on(event.name, (...args) => event.execute(...args));
  }
}

console.log(bot.commands);

bot.login(token);
