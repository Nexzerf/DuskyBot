const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const tarotLoveData = JSON.parse(fs.readFileSync('./tarotstudy.json', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tarotstudy')
    .setDescription('ดูดวงเรื่องการเรียน'),

  async execute(interaction) {
    const tarotCards = Object.keys(tarotLoveData);
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const card = tarotLoveData[randomCard];

    const embed = new EmbedBuilder()
      .setAuthor({ name: randomCard })
      .setTitle(`📚 **ทำนายเรื่องการเรียน**`)
      .setColor('#3333ff')
      .addFields(
        { name: '🔮 ความหมาย', value: card.meaning || 'ไม่มีข้อมูล' },
        { name: '💡 คำทำนาย', value: card.advice || 'ไม่มีคำแนะนำ' }
      )
      .setFooter({ text: '🃏 ใช้วิจารณญาณในการรับชม' });

    await interaction.reply({ embeds: [embed] });
  },
};
