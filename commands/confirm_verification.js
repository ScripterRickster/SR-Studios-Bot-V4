const { SlashCommandBuilder } = require('discord.js');
const verifyModule = require('./verify');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('confirm_verification')
    .setDescription('Confirm your Roblox verification after placing the code.'),

  async execute(interaction) {
    await verifyModule.confirm(interaction);
  }
};
