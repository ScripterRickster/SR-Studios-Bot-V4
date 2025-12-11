const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: `SR Studio's | https://discord.gg/neTcS23xh7`, type: ActivityType.Watching }],
      status: 'online',
    });
  },
};