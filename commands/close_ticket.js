const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close_ticket')
    .setDescription('Closes an open ticket.')
    .addChannelOption(option =>
      option.setName('ticket')
        .setDescription('Ticket channel to close')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for closing')
        .setRequired(true)),

  async execute(interaction) {
    const ticketChannel = interaction.options.getChannel('ticket');
    const reason = interaction.options.getString('reason');
    const logChannel = interaction.guild.channels.cache.get(process.env.logschannel);

    if (ticketChannel.parentId !== '1025510205003403285' || !ticketChannel.name.includes(interaction.user.username)) {
      return interaction.reply({
        content: '❌ This does not appear to be a valid ticket.',
        ephemeral: true
      });
    }

    await interaction.reply({ content: 'Closing ticket...', ephemeral: true });
    await ticketChannel.delete();

    logChannel.send(`🗑️ <@${interaction.member.id}> closed ticket <#${ticketChannel.id}> for reason: **${reason}**`);
  }
};

// bruh