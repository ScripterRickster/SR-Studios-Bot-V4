const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create_ticket')
    .setDescription('Creates a support ticket.')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for creating the ticket')
        .setRequired(true)),

  async execute(interaction) {
    const reason = interaction.options.getString('reason');
    const userId = interaction.member.id;
    const username = interaction.user.username;
    const ticketName = `${username}-${userId}`;
    const categoryId = '1025510205003403285'; // Update this if dynamic
    const supportRoleId = process.env.supportroleid;
    const logChannel = interaction.guild.channels.cache.get(process.env.logschannel);

    await interaction.reply({ content: 'Creating ticket...', ephemeral: true });

    const channel = await interaction.guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: userId,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
        },
        {
          id: supportRoleId,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
        },
      ],
    });

    await channel.send(`<@${userId}> has opened this ticket for: **${reason}**`);
    await channel.send(`<@&${supportRoleId}> will assist you shortly.`);
    logChannel.send(`🎟️ <@${userId}> created ticket: <#${channel.id}>`);

    await interaction.editReply({ content: `✅ Ticket created: <#${channel.id}>`, ephemeral: true });
  },
};