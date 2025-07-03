const { EmbedBuilder } = require('discord.js');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (message.partial || message.author.bot) return;

    const logChannel = message.guild.channels.cache.get(process.env.logschannel);
    if (!logChannel) return;

    const baseEmbed = new EmbedBuilder()
      /*
      .setAuthor({
        name: `${message.author.tag} (${message.author.id})`,
        iconURL: message.author.displayAvatarURL(),
      })
      */
      .setFooter({ text: formatTimestamp() })
      .setColor('#ff0000');

    if (message.content) {
      const contentEmbed = baseEmbed
        .setTitle('🗑️ Message Deleted')
        .setDescription(`**User Profile:** <@${message.author.id}>\n**Channel:** <#${message.channelId}>\n**Content:** ${message.content}`);
      logChannel.send({ embeds: [contentEmbed] });
    }

    for (const [, attachment] of message.attachments) {
      const fileEmbed = baseEmbed
        .setTitle('🖼️ Attachment Deleted')
        .setDescription(`**Channel:** <#${message.channelId}>`)
        .setImage(attachment.proxyURL);
      logChannel.send({ embeds: [fileEmbed] });
    }
  },
};
