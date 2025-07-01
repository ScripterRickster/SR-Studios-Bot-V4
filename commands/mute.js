const { SlashCommandBuilder } = require('discord.js');
const modlogModel = require('../modlogModel');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute (timeout) a user.')
    .addUserOption(opt => opt.setName('user').setDescription('User to mute').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(true))
    .addNumberOption(opt => opt.setName('duration').setDescription('Duration in minutes').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    const duration = interaction.options.getNumber('duration');
    const moderatorId = interaction.user.id;
    const timestamp = formatTimestamp();

    await modlogModel.create({
      userId: target.id,
      type: 'Mute',
      guildId: interaction.guild.id,
      reason,
      moderatorId,
      timestamp,
      duration: `${duration} minutes`,
    });

    await target.timeout(duration * 60_000, reason);
    await interaction.reply({ content: `✅ Muted <@${target.id}> for ${duration} minutes.`, ephemeral: true });
  }
};
