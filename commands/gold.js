const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gold')
    .setDescription('📈 เช็กราคาทองคำล่าสุดจากสมาคมค้าทองคำ'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const res = await axios.get('https://www.goldtraders.or.th/');
      const $ = cheerio.load(res.data);

      const updateTime = $('.date').first().text().trim();
      const prices = {
        buy: $('#DetailPlace_uc_goldprices1_lblBLSell').text().trim(),
        sell: $('#DetailPlace_uc_goldprices1_lblBLBuy').text().trim(),
        buyGold: $('#DetailPlace_uc_goldprices1_lblOMSell').text().trim(),
        sellGold: $('#DetailPlace_uc_goldprices1_lblOMBuy').text().trim(),
      };

      const embed = new EmbedBuilder()
        .setTitle('💰 ราคาทองคำล่าสุด')
        .setDescription(`อัปเดตเมื่อ: ${updateTime}`)
        .addFields(
          { name: '🔸 ทองคำแท่ง', value: `• รับซื้อ: ${prices.sell} บาท\n• ขายออก: ${prices.buy} บาท`, inline: true },
          { name: '🔹 ทองรูปพรรณ', value: `• รับซื้อ: ${prices.sellGold} บาท\n• ขายออก: ${prices.buyGold} บาท`, inline: true },
        )
        .setColor(0xFFD700)
        .setFooter({ text: 'ข้อมูลจาก สมาคมค้าทองคำ' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ ไม่สามารถดึงข้อมูลราคาทองคำได้ในขณะนี้');
    }
  },
};
