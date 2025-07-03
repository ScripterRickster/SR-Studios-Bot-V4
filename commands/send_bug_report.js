const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { formatTimestamp } = require('../utils/format');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send_bug_report')
    .setDescription('Report a bug to developers.')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Choose between Product or System')
        .setRequired(true)
        .addChoices(
          { name: 'Product', value: 'Product' },
          { name: 'System', value: 'System' }
        ))
    .addStringOption(option =>
      option.setName('bug')
        .setDescription('Description of the bug.')
        .setRequired(true)),

  async execute(interaction) {
    const type = interaction.options.getString('type');
    const bug = interaction.options.getString('bug');
    const reportChannel = interaction.guild.channels.cache.get(process.env.bugreportschannelid);

    const embed = new EmbedBuilder()
      .setTitle('🐞 Bug Report')
      .setDescription(`**Type:** ${type}\n**Bug:** ${bug}\n**Reported by:** ${interaction.user}\n**Time:** ${formatTimestamp()}`)
      .setColor('#FF9900');

    await reportChannel.send({ embeds: [embed] });
    await interaction.reply({
      content: '✅ Bug report sent to the developers.',
      ephemeral: true
    });
  }
};
