const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send_embed')
    .setDescription('Sends an embedded message to a selected channel.')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message content')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('mention_type')
        .setDescription('"Everyone", "Here", or "None"')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Target channel')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Embed title')
        .setRequired(true)),

  async execute(interaction) {
    const msg = interaction.options.getString('message');
    const mentionType = interaction.options.getString('mention_type').toLowerCase();
    const title = interaction.options.getString('title');
    const targetChannel = interaction.options.getChannel('channel');
    const logChannel = interaction.guild.channels.cache.get(process.env.logschannel);

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`**Message:** ${msg}\n**Posted by:** ${interaction.user.username}\n**Time:** ${formatTimestamp()}`)
      .setColor('#0080FF');

    let mentionText = '';
    if (mentionType === 'here') mentionText = '@here';
    if (mentionType === 'everyone') mentionText = '@everyone';

    await targetChannel.send({ content: mentionText, embeds: [embed] });

    await interaction.reply({
      content: `✅ Embed sent in <#${targetChannel.id}>`,
      ephemeral: true
    });

    logChannel.send(`📢 <@${interaction.member.id}> sent an embed to <#${targetChannel.id}>: **${title}**`);
  }
};
