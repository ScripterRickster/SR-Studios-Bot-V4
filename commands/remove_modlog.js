const { SlashCommandBuilder } = require('discord.js');
const modlogModel = require('../modlogModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove_modlog')
    .setDescription('Remove a specific modlog by ID.')
    .addStringOption(opt => opt.setName('modlogid').setDescription('Modlog ID').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for removal').setRequired(true)),

  async execute(interaction) {
    const id = interaction.options.getString('modlogid');
    const reason = interaction.options.getString('reason');

    const log = await modlogModel.findById(id);
    if (!log) {
      return interaction.reply({ content: '❌ Modlog not found.', ephemeral: true });
    }

    await log.deleteOne();
    await interaction.reply({ content: `✅ Deleted modlog \`${id}\`.`, ephemeral: true });
  }
};
