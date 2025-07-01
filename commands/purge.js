const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes a number of recent messages.')
    .addIntegerOption(option =>
      option.setName('messages')
        .setDescription('Number of messages to delete (max 100)')
        .setRequired(true)),

  async execute(interaction) {
    const amount = interaction.options.getInteger('messages');
    const logChannel = interaction.guild.channels.cache.get(process.env.logschannel);

    if (amount > 100) {
      return interaction.reply({
        content: '❌ You can only delete up to 100 messages at once.',
        ephemeral: true
      });
    }

    try {
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({
        content: `✅ Deleted ${amount} messages.`,
        ephemeral: true
      });

      logChannel.send(`🧹 <@${interaction.member.id}> purged ${amount} messages in <#${interaction.channel.id}>`);
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: '❌ Could not delete messages. They may be older than 14 days.',
        ephemeral: true
      });
    }
  }
};