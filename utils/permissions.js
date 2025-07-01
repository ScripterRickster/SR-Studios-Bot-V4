const { PermissionsBitField } = require('discord.js');

module.exports = {
  hasAdmin(interaction) {
    return interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
  },
  hasMod(interaction) {
    return interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers);
  },
  hasManageMessages(interaction) {
    return interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages);
  },
};
