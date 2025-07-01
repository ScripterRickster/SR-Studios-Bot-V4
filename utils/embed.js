const { EmbedBuilder } = require('discord.js');
const { formatTimestamp } = require('./format');

module.exports = {
  createLogEmbed({ title, description, user, color = '#0099ff', image }) {
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setFooter({ text: formatTimestamp() });

    if (user) {
      embed.setAuthor({
        name: `${user.tag} (${user.id})`,
        iconURL: user.displayAvatarURL(),
      });
    }

    if (image) {
      embed.setImage(image);
    }

    return embed;
  }
};
