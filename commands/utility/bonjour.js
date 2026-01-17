const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder().setName('bonjour').setDescription('Premoière commande !'),
  async execute(interaction) {
    await interaction.reply('Bonjour');
  },
};
