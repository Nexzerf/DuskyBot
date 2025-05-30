const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('นับจำนวนคำ')
    .setDescription('นับจำนวนคำและตัวอักษรในข้อความที่ใส่มา')
    .addStringOption(option =>
      option.setName('ข้อความ')
        .setDescription('ใส่ข้อความที่ต้องการนับคำและตัวอักษร')
        .setRequired(true)
    ),

  async execute(interaction) {
    const text = interaction.options.getString('ข้อความ').trim();

    // นับจำนวนคำ
    // แบ่งโดยช่องว่าง, ลบช่องว่างหลายตัว
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // นับจำนวนตัวอักษร (ไม่นับช่องว่าง)
    const charCount = text.replace(/\s+/g, '').length;

    // นับจำนวนตัวอักษรรวมช่องว่าง (ถ้าต้องการแยก)
    const charWithSpaces = text.length;

    const embed = new EmbedBuilder()
      .setTitle('📊 ผลการนับคำและตัวอักษร')
      .setColor('#3333ff')
      .addFields(
        { name: '📄 จำนวนคำ', value: `${wordCount}`, inline: true },
        { name: '🔤 ตัวอักษร (ไม่รวมช่องว่าง)', value: `${charCount}`, inline: true },
        { name: '🔤 ตัวอักษร (รวมช่องว่าง)', value: `${charWithSpaces}`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
