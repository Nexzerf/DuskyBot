const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const numberGrades = JSON.parse(fs.readFileSync('./berlnw.json', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('berlnw')
    .setDescription('วิเคราะห์เบอร์โทรศัพท์')
    .addStringOption(option =>
      option.setName('เบอร์')
        .setDescription('กรอกเบอร์โทรศัพท์ของคุณ')
        .setRequired(true)
    ),

  async execute(interaction) {
    const phone = interaction.options.getString('เบอร์').replace(/\D/g, ''); // ลบ non-digit
    if (!/^[0-9]{9,10}$/.test(phone)) {
      return interaction.reply('📵 กรุณากรอกเบอร์ที่ถูกต้อง (9-10 หลัก)');
    }

    const digits = phone.slice(1); // ตัดเลข 0 ตัวหน้าออก
    const pairs = [];
    for (let i = 0; i < digits.length - 1; i++) {
      pairs.push(digits.slice(i, i + 2));
    }

    const fields = [];
    const gradeCounts = {};

    for (const pair of pairs) {
      const data = numberGrades[pair];
      if (data) {
        fields.push({
          name: `🔢 คู่เลข ${pair}`,
          value: data.description,
        });
        gradeCounts[data.grade] = (gradeCounts[data.grade] || 0) + 1;
      } else {
        fields.push({
          name: `❓ คู่เลข ${pair}`,
          value: 'ไม่พบข้อมูลในระบบ',
        });
      }
    }

    // วิเคราะห์เกรดรวม
    const gradePriority = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];
    let summaryGrade = null;
    for (const grade of gradePriority) {
      if (gradeCounts[grade]) {
        summaryGrade = grade;
        break;
      }
    }

    let summaryAdvice = '✅ เบอร์นี้อยู่ในเกณฑ์ดี';
    if (summaryGrade === 'D' || summaryGrade === 'F') {
      summaryAdvice = '⚠️ เบอร์นี้อยู่ในเกณฑ์ควรเปลี่ยน';
    } else if (summaryGrade === 'C' || summaryGrade === 'D+') {
      summaryAdvice = '⚠️ เบอร์นี้ควรพิจารณาเปลี่ยนเพื่อเสริมดวง';
    }

    const embed = new EmbedBuilder()
      .setTitle(`📱 วิเคราะห์เบอร์: ${phone}`)
      .setColor('#3333ff')
      .addFields(fields)
      .addFields({
        name: '📊 สรุปผลรวม',
        value: `เบอร์ของคุณอยู่ในระดับ **${summaryGrade}**\n${summaryAdvice}`
      })
      .setFooter({ text: '🧠 ใช้วิจารณญาณในการตีความตามหลักโหราศาสตร์ไทย' });

    await interaction.reply({ embeds: [embed], ephemeral: true });

  }
};
