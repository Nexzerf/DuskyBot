const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const statuses = [
      { name: 'แฟนน่ารักวันละล้านรอบ', type: ActivityType.Watching },
      { name: '/help ดูคำสั่ง', type: ActivityType.Playing },
      { name: 'คำสั่ง /play', type: ActivityType.Watching },
      { name: `อยู่ใน ${client.guilds.cache.size} เซิร์ฟเวอร์`, type: ActivityType.Competing },
    ];

    let i = 0;
    setInterval(() => {
      const status = statuses[i % statuses.length];
      client.user.setActivity(status.name, { type: status.type });
      i++;
    }, 30000); 

    console.log(`Bot is in ${client.guilds.cache.size} guilds`);
  },
};
