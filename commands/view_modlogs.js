const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const modlogModel = require('../modlogModel');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('view_modlogs')
    .setDescription('View all modlogs for a user.')
    .addUserOption(opt => opt.setName('user').setDescription('Target user').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const logs = await modlogModel.find({ userId: user.id, guildId: interaction.guild.id });

    if (!logs.length) {
      return interaction.reply({ content: 'No modlogs found for this user.', ephemeral: true });
    }

    const entries = logs.map(log =>
      `📝 **Type:** ${log.type}\n👮 **Moderator:** <@${log.moderatorId}>\n📅 **Date:** ${log.timestamp}\n🗒️ **Reason:** ${log.reason}\n⏱️ **Duration:** ${log.duration}\n🆔 \`${log._id}\``).join('\n\n');

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Modlogs`)
      .setDescription(entries)
      .setColor('#ffcc00');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
