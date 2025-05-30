const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const gradeMap = {
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('grade')
    .setDescription('คำนวณ GPA / GPAX จากเกรดที่ใส่มา')
    .addStringOption(option =>
      option.setName('เกรด')
        .setDescription('ใส่เกรด เช่น A B+ C F (กรณีใส่หน่วยกิตให้ใส่แบบ A:3 B+:4 C:2)')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName('รวมหลายเทอม')
        .setDescription('ถ้าเกรดหลายเทอม ให้คั่นแต่ละเทอมด้วย ; เช่น A:3 B+:4; A B C')
        .setRequired(false)
    ),

  async execute(interaction) {
    const input = interaction.options.getString('เกรด');
    const multiTerm = interaction.options.getBoolean('รวมหลายเทอม') || false;

    // ฟังก์ชันแปลงเกรด+หน่วยกิตแบบ "A:3"
    function parseGradesWithCredits(gradesStr) {
      const parts = gradesStr.trim().toUpperCase().split(/\s+/);
      let totalPoint = 0;
      let totalCredit = 0;
      let invalid = [];

      for (const part of parts) {
        if (part.includes(':')) {
          const [grade, creditStr] = part.split(':');
          const credit = Number(creditStr);
          if (gradeMap[grade] !== undefined && !isNaN(credit) && credit > 0) {
            totalPoint += gradeMap[grade] * credit;
            totalCredit += credit;
          } else {
            invalid.push(part);
          }
        } else {
          // ถ้าไม่ใส่หน่วยกิตให้ถือว่า credit = 1
          if (gradeMap[part] !== undefined) {
            totalPoint += gradeMap[part];
            totalCredit += 1;
          } else {
            invalid.push(part);
          }
        }
      }
      return { totalPoint, totalCredit, invalid };
    }

    // ถ้าเลือกรวมหลายเทอม แยกด้วย ; 
    if (multiTerm) {
      const terms = input.split(';').map(t => t.trim());
      let sumPoint = 0;
      let sumCredit = 0;
      let invalidAll = [];

      for (const term of terms) {
        const { totalPoint, totalCredit, invalid } = parseGradesWithCredits(term);
        sumPoint += totalPoint;
        sumCredit += totalCredit;
        if (invalid.length > 0) invalidAll.push(...invalid);
      }

      if (sumCredit === 0) {
        return await interaction.reply({ content: '❌ ไม่พบเกรดที่ถูกต้องในทุกเทอม', ephemeral: true });
      }

      const gpax = (sumPoint / sumCredit).toFixed(2);

      const embed = new EmbedBuilder()
        .setTitle('📊 ผลการคำนวณ GPAX รวมหลายเทอม')
        .setColor('#4CAF50')
        .addFields(
          { name: '🎓 GPAX', value: `${gpax}`, inline: true },
          { name: '📚 จำนวนหน่วยกิตรวม', value: `${sumCredit} หน่วยกิต`, inline: true },
          { name: '📅 จำนวนเทอม', value: `${terms.length} เทอม`, inline: true }
        )
        .setFooter({ text: invalidAll.length > 0 ? `มีข้อมูลที่ไม่ถูกต้อง: ${invalidAll.join(', ')}` : '✓ ข้อมูลถูกต้องทั้งหมด' });

      return await interaction.reply({ embeds: [embed] });
    } 

    // ถ้าไม่ใช่หลายเทอม จะคำนวณแค่ชุดเดียว
    else {
      const { totalPoint, totalCredit, invalid } = parseGradesWithCredits(input);
      if (totalCredit === 0) {
        return await interaction.reply({ content: '❌ ไม่พบเกรดที่ถูกต้อง กรุณาใส่เกรด เช่น A B+ C F หรือ A:3 B+:4 C:2', ephemeral: true });
      }

      const gpa = (totalPoint / totalCredit).toFixed(2);

      const embed = new EmbedBuilder()
        .setTitle('📊 ผลการคำนวณ GPA')
        .setColor('#3333ff')
        .addFields(
          { name: '🎓 GPA', value: `${gpa}`, inline: true },
          { name: '📚 จำนวนหน่วยกิตรวม', value: `${totalCredit}`, inline: true }
        )
        .setFooter({ text: invalid.length > 0 ? `มีข้อมูลที่ไม่ถูกต้อง: ${invalid.join(', ')}` : '✓ ข้อมูลถูกต้องทั้งหมด' });

      return await interaction.reply({ embeds: [embed] });
    }
  }
};
