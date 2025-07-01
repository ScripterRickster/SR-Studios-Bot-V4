const { SlashCommandBuilder } = require('discord.js');
const modlogModel = require('../modlogModel');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a previously banned user.')
    .addUserOption(opt => opt.setName('user').setDescription('User to unban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for unban').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const moderatorId = interaction.user.id;
    const timestamp = formatTimestamp();

    await modlogModel.create({
      userId: user.id,
      type: 'Unban',
      guildId: interaction.guild.id,
      reason,
      moderatorId,
      timestamp,
      duration: 'Permanent',
    });

    await interaction.guild.members.unban(user.id, reason).catch(() => {});
    await interaction.reply({ content: `✅ Unbanned <@${user.id}>.`, ephemeral: true });
  }
};
