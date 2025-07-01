const { SlashCommandBuilder } = require('discord.js');
const modlogModel = require('../modlogModel');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove a user timeout.')
    .addUserOption(opt => opt.setName('user').setDescription('User to unmute').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for unmute').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    const moderatorId = interaction.user.id;
    const timestamp = formatTimestamp();

    await modlogModel.create({
      userId: target.id,
      type: 'Unmute',
      guildId: interaction.guild.id,
      reason,
      moderatorId,
      timestamp,
      duration: 'Permanent',
    });

    await target.timeout(null, reason);
    await interaction.reply({ content: `✅ Unmuted <@${target.id}>.`, ephemeral: true });
  }
};
