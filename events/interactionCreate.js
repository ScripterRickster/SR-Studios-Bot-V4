module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: 'There was an error while executing this command.',
          ephemeral: true,
        });
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId === 'verifybutton') {
        const role = interaction.guild.roles.cache.get("1023638886720745572");
        if (interaction.member.roles.cache.has(role.id)) {
          return interaction.reply({
            content: 'You are already verified.',
            ephemeral: true,
          });
        }

        const additionalRoles = [
          "1024464369716826112",
          "1024465147764408320",
          "1023639177406984374",
        ];

        interaction.member.roles.add(role);
        additionalRoles.forEach((id) => {
          const r = interaction.guild.roles.cache.get(id);
          if (r) interaction.member.roles.add(r);
        });

        const logChannel = interaction.guild.channels.cache.get(process.env.logschannel);
        if (logChannel) {
          logChannel.send(`✅ <@${interaction.member.id}> has successfully verified.`);
        }

        return interaction.reply({
          content: `Successfully verified your account: **${interaction.member.displayName}**.`,
          ephemeral: true,
        });
      }
    }
  },
};