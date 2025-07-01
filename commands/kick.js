const { SlashCommandBuilder } = require('discord.js');
const modlogModel = require('../modlogModel');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server.')
    .addUserOption(opt => opt.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for kick').setRequired(true)),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    const moderatorId = interaction.user.id;
    const timestamp = formatTimestamp();

    if (!member.kickable) {
      return interaction.reply({ content: '❌ Cannot kick this user.', ephemeral: true });
    }

    await modlogModel.create({
      userId: member.id,
      type: 'Kick',
      guildId: interaction.guild.id,
      reason,
      moderatorId,
      timestamp,
      duration: 'Permanent',
    });

    await member.send(`🔨 You were kicked from SR Studio's for: **${reason}**`).catch(() => {});
    await member.kick(reason);
    await interaction.reply({ content: `✅ Kicked <@${member.id}>.`, ephemeral: true });
  }
};
