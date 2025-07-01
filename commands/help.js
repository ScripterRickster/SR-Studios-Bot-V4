const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all of the available commands.'),

  async execute(interaction) {
    const commands = await interaction.guild.commands.fetch();
    let allCommands = "";

    commands.forEach(command => {
      allCommands += `\n**/${command.name}**\n\`\`\`${command.description}\`\`\``;
    });

    const embed = new EmbedBuilder()
      .setTitle("All Commands")
      .setDescription(allCommands)
      .setColor("#00AAFF");

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};