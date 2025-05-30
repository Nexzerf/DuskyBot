const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetch = require('node-fetch');

const activities = {
  youtube: '755600276941176913',
  poker: '755827207812677713',
  chess: '832012774040141894',
  fishington: '814288819477020702',
  betrayal: '773336526917861400',
  lettertile: '879863976006127627',
  wordsnack: '879863976006127627',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('activity')
    .setDescription('เริ่มกิจกรรมในช่องเสียง')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('เลือกกิจกรรม')
        .setRequired(true)
        .addChoices(
          { name: 'YouTube Together', value: 'youtube' },
          { name: 'Poker', value: 'poker' },
          { name: 'Chess', value: 'chess' },
          { name: 'Fishington', value: 'fishington' },
          { name: 'Betrayal', value: 'betrayal' },
          { name: 'Letter Tile', value: 'lettertile' },
          { name: 'Word Snack', value: 'wordsnack' },
        )),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: 'คุณต้องอยู่ในช่องเสียงก่อนใช้คำสั่งนี้', ephemeral: true });
    }

    const activityType = interaction.options.getString('type');
    const applicationId = activities[activityType];

    if (!applicationId) {
      return interaction.reply({ content: 'กิจกรรมนี้ยังไม่รองรับ', ephemeral: true });
    }

    try {
      // สร้าง invite สำหรับ activities ผ่าน Discord API
      const invite = await createDiscordActivityInvite(voiceChannel.id, applicationId);

      await interaction.reply({
        content: `คลิกลิงก์นี้เพื่อเริ่มกิจกรรม **${activityType}**:\n${invite}`,
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'เกิดข้อผิดพลาดในการสร้างลิงก์กิจกรรม', ephemeral: true });
    }
  }
};

// ฟังก์ชันสร้าง invite ผ่าน Discord API
async function createDiscordActivityInvite(channelId, applicationId) {
  const url = `https://discord.com/api/v10/channels/${channelId}/invites`;
  const body = {
    max_age: 86400,  // 1 วัน
    max_uses: 0,
    target_application_id: applicationId,
    target_type: 2,  // ACTIVITY
    temporary: false,
    validate: null
  };

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Authorization': `Bot ${process.env.TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) throw new Error(`Discord API returned ${res.status}`);

  const json = await res.json();

  return `https://discord.com/invite/${json.code}`;
}
