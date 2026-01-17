const Discord = require('discord.js');
require('dotenv').config();
let token = process.env.TOKEN;
let fs = require('node:fs');
let path = require('node:path');
let { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

// bot.on('ready', async () => {
//   console.log(`${bot.user.tag} est bien en ligne !`);
// });

bot.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready ! Logged in as ${readyClient.user.tag}`);
});

bot.commands = new Collection();

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

bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.bot.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});
