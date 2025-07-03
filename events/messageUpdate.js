const { EmbedBuilder } = require('discord.js');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (oldMessage.partial || newMessage.partial || oldMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const logChannel = newMessage.guild.channels.cache.get(process.env.logschannel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setTitle('✏️ Message Edited')
      /*
      .setAuthor({
        name: `${newMessage.author.tag} (${newMessage.author.id})`,
        iconURL: newMessage.author.displayAvatarURL(),
      })
      */
      .setDescription(
        `**User Profile:** <@${message.author.id}>\n**Channel:** <#${newMessage.channelId}>\n**Old:** ${oldMessage.content}\n**New:** ${newMessage.content}`
      )
      .setColor('#ffff00')
      .setFooter({ text: formatTimestamp() });

    logChannel.send({ embeds: [embed] });
  },
};
