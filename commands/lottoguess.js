const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

function getRandomNumber(digits) {
  let min = Math.pow(10, digits - 1);
  let max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lottoguess')
    .setDescription('สุ่มเลขหวยตามประเภทที่เลือก'),

  async execute(interaction) {
    
    const menu = new StringSelectMenuBuilder()
      .setCustomId('lotto-type-select')
      .setPlaceholder('เลือกประเภทหวยที่ต้องการ')
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel('หวย 2 ตัว').setValue('two'),
        new StringSelectMenuOptionBuilder().setLabel('หวย 3 ตัว').setValue('three'),
        new StringSelectMenuOptionBuilder().setLabel('หวย 6 ตัว').setValue('six'),
        new StringSelectMenuOptionBuilder().setLabel('หวยบน').setValue('up'),
        new StringSelectMenuOptionBuilder().setLabel('หวยล่าง').setValue('down'),
      );

    const row = new ActionRowBuilder().addComponents(menu);

    const embed = new EmbedBuilder()
      .setTitle('🎲 ขอเลขหวย')
      .setDescription('กรุณาเลือกประเภทหวยที่ต้องการจากเมนูด้านล่าง')
      .setColor('#3333ff');

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },

  
  async handleSelect(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'lotto-type-select') return;

    const selected = interaction.values[0];

    let result = '';
    switch (selected) {
      case 'two':
        result = getRandomNumber(2).toString().padStart(2, '0');
        break;
      case 'three':
        result = getRandomNumber(3).toString();
        break;
      case 'six':
        result = getRandomNumber(6).toString().padStart(6, '0');
        break;
      case 'up':
        // หวยบน 3 ตัว + 2 ตัว (สมมติ)
        const up3 = getRandomNumber(3).toString();
        const up2 = getRandomNumber(2).toString().padStart(2, '0');
        result = `3 ตัวบน: ${up3}\n2 ตัวบน: ${up2}`;
        break;
      case 'down':
        // หวยล่าง 2 ตัว (สมมติ)
        result = getRandomNumber(2).toString().padStart(2, '0');
        break;
      default:
        result = 'ไม่พบประเภทหวยที่เลือก';
        break;
    }

    const embed = new EmbedBuilder()
      .setTitle('🎲 เลขหวยของคุณ')
      .setColor('#3333ff')
      .setDescription(result)
      .setTimestamp();

    // อัปเดตข้อความตอบกลับ (update) ให้แสดงเลขที่สุ่ม
    await interaction.update({ embeds: [embed], components: [] });
  }
};
