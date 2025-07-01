const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('private_message')
    .setDescription('Sends a private message to a user (logged).')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to send the message to')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Content of the message')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const message = interaction.options.getString('message');
    const logChannel = interaction.guild.channels.cache.get(process.env.logschannel);

    try {
      await user.send({
        content: `# **New Message From: ${interaction.user}**\n# Message: \"${message}\"\n### *This message is logged.*`
      });

      const logEmbed = new EmbedBuilder()
        .setTitle('Private Message Log')
        .setDescription(`**To:** ${user}\n**From:** ${interaction.user}\n**Message:** ${message}\n**Time:** ${formatTimestamp()}`);

      logChannel.send({ embeds: [logEmbed] });

      await interaction.reply({
        content: `✅ Successfully sent the message to ${user}.`,
        ephemeral: true
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to send the message.', ephemeral: true });
    }
  }
};
