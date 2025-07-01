const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send_bug_report')
    .setDescription('Report a bug to developers.')
    .addStringOption(option =>
      option.setName('product_or_system')
        .setDescription('The product/system with the bug.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('bug')
        .setDescription('Description of the bug.')
        .setRequired(true)),

  async execute(interaction) {
    const system = interaction.options.getString('product_or_system');
    const bug = interaction.options.getString('bug');
    const reportChannel = interaction.guild.channels.cache.get(process.env.bugreportschannelid);

    const embed = new EmbedBuilder()
      .setTitle('🐞 Bug Report')
      .setDescription(`**System:** ${system}\n**Bug:** ${bug}\n**Reported by:** ${interaction.user}\n**Time:** ${formatTimestamp()}`)
      .setColor('#FF9900');

    await reportChannel.send({ embeds: [embed] });
    await interaction.reply({
      content: '✅ Bug report sent to the developers.',
      ephemeral: true
    });
  }
};
