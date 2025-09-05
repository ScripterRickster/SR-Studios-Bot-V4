const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  ModalBuilder,
  TextInputStyle,
  InteractionType,
} = require('discord.js');

const noblox = require('noblox.js');

const activeVerifications = new Map(); // For temporary session tracking

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Links your Discord with your Roblox account'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('robloxVerifyModal')
      .setTitle('Roblox Verification');

    const usernameInput = new TextInputBuilder()
      .setCustomId('robloxUsername')
      .setLabel('Enter your Roblox username')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(usernameInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  },

  async handleModal(interaction) {
    const robloxUsername = interaction.fields.getTextInputValue('robloxUsername');

    try {
      const userId = await noblox.getIdFromUsername(robloxUsername);
      const code = `VERIFY-${Math.floor(Math.random() * 1000000)}`;

      activeVerifications.set(interaction.user.id, {
        username: robloxUsername,
        userId,
        code,
      });

      setTimeout(() => activeVerifications.delete(interaction.user.id), 10*60*1000); // 10 minutes

      const embed = new EmbedBuilder()
        .setTitle('Verification - Step 2')
        .setDescription(
          `✅ Found Roblox user **${robloxUsername}**.\n\n🔐 Please place this code in your **profile description**:\n\n\`${code}\`\n\nThen run **/confirm_verification** to complete verification.`
        )
        .setColor('#00b0f4');

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.error('[Verification Error]', err);
      await interaction.reply({
        content: '❌ Roblox user not found or API error occurred. Please double-check the username.',
        ephemeral: true,
      });
    }
  },



  async confirm(interaction) {
    const session = activeVerifications.get(interaction.user.id);
    if (!session) {
      return interaction.reply({
        content: '❌ No active verification session found. Please use /verify first.',
        ephemeral: true,
      });
    }

    try {
      const profileDescription = await noblox.getBlurb(session.userId);


      if (profileDescription.includes(session.code)) {
        activeVerifications.delete(interaction.user.id);

        await interaction.reply({
          content: `✅ Successfully linked **${session.username}** to your Discord.`,
          ephemeral: true,
        });

        const logChannel = interaction.guild.channels.cache.get(process.env.logschannel);
        //https://www.roblox.com/users/3422141408/profile
        logChannel?.send(`🔗 <@${interaction.user.id}> verified as **[${session.username}](**(https://www.roblox.com/users/${session.userId}/profile)`);

        const verifiedRoleIDs = [
          1023638886720745572, // verified
          1023639177406984374, // community member
          1024465147764408320 // dash line (---------)
        ]

        for(const roleID of verifiedRoleIDs){
          const role = interaction.guild.roles.cache.get(roleID);
          if(role){
            await interaction.member.roles.add(role);
          }
        }

      } else {
        await interaction.reply({
          content: '❌ Verification code not found in your Roblox profile. Please make sure it is saved and try again.',
          ephemeral: true,
        });
      }
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ An error occurred while verifying your Roblox profile.',
        ephemeral: true,
      });
    }
  },
};
