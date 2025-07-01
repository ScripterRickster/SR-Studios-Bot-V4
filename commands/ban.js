const { SlashCommandBuilder } = require('discord.js');
const modlogModel = require('../modlogModel');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server.')
    .addUserOption(opt => opt.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for ban').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const moderatorId = interaction.user.id;
    const timestamp = formatTimestamp();

    await modlogModel.create({
      userId: user.id,
      type: 'Ban',
      guildId: interaction.guild.id,
      reason,
      moderatorId,
      timestamp,
      duration: 'Permanent',
    });

    await user.send(`🚫 You were banned from SR Studio's for: **${reason}**`).catch(() => {});
    await interaction.guild.members.ban(user.id, { reason });
    await interaction.reply({ content: `✅ Banned <@${user.id}>.`, ephemeral: true });
  }
};
