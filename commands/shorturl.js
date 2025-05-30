const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shorturl')
    .setDescription('ย่อลิงก์ด้วย Bitly')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('ลิงก์ที่ต้องการย่อ')
        .setRequired(true)
    ),

  async execute(interaction) {
    const longUrl = interaction.options.getString('url');

    await interaction.deferReply({ ephemeral: true });

    try {
      const response = await axios.post(
        'https://api-ssl.bitly.com/v4/shorten',
        {
          long_url: longUrl,
          domain: 'bit.ly'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.BITLY_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const shortUrl = response.data.link;

      await interaction.editReply({
        content: `🔗 ลิงก์ย่อของคุณ:\n${shortUrl}`,
        ephemeral: true
      });

    } catch (error) {
      console.error(error?.response?.data || error.message);
      await interaction.editReply({
        content: '❌ เกิดข้อผิดพลาดในการย่อลิงก์ กรุณาตรวจสอบลิงก์หรือ Token ของ Bitly',
        ephemeral: true
      });
    }
  }
};
