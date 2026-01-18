const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName('bonjour').setDescription('Premoière commande !'),
  async execute(interaction) {
    await interaction.reply('Bonjour');
  },
};
