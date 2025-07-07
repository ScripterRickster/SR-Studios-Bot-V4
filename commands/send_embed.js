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
        .setDescription('Choose the mention type')
        .setRequired(true)
        .addChoices(
          { name: 'Everyone', value: 'Everyone' },
          { name: 'Here', value: 'Here' },
          { name: 'None', value: 'None'}
        ))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Target channel')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Embed title')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('colour')
          .setDescription('Embed colour')
          .setRequired(true)
          .addChoices(
            {name: 'Red', value: '#FF0000'},
            {name: 'Orange', value: '#FFA500'},
            {name: 'Yellow', value: '#FFFF00'},
            {name: 'Green', value: '#00FF00'},
            {name: 'Blue', value: '#0000FF'},
            {name: 'Purple', value: '#800080'},
            {name: 'Pink', value: '#FFC0CB'},
            {name: 'Black', value: '#000000'},
            {name: 'White', value: '#FFFFFF'},
          )),

  async execute(interaction) {
    const msg = interaction.options.getString('message');
    const mentionType = interaction.options.getString('mention_type').toLowerCase();
    const title = interaction.options.getString('title');
    const embedColour = interaction.options.getString('colour');
    const targetChannel = interaction.options.getChannel('channel');
    const logChannel = interaction.guild.channels.cache.get(process.env.logschannel);

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`**Message:** ${msg}\n**Posted by:** ${interaction.user}\n**Time:** ${formatTimestamp()}`)
      .setColor(embedColour);

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
