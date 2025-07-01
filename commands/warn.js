const { SlashCommandBuilder } = require('discord.js');
const modlogModel = require('../modlogModel');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user.')
    .addUserOption(opt => opt.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for warning').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const moderatorId = interaction.user.id;
    const timestamp = formatTimestamp();

    await modlogModel.create({
      userId: target.id,
      type: 'Warn',
      guildId: interaction.guild.id,
      reason,
      moderatorId,
      timestamp,
      duration: 'Permanent',
    });

    await interaction.reply({ content: `✅ Warned <@${target.id}>.`, ephemeral: true });
    await target.send(`⚠️ You have been warned in SR Studio's for: **${reason}**`).catch(() => {});
  }
};
