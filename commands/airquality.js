const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const provinceMap = require('../thai_provinces_airvisual_map.json');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('airquality')
    .setDescription('เช็กค่าฝุ่น PM2.5 และคุณภาพอากาศ')
    .addStringOption(option =>
      option.setName('จังหวัด')
        .setDescription('ชื่อจังหวัด (ภาษาไทย)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const provinceThai = interaction.options.getString('จังหวัด');
    await interaction.deferReply();

    const mapping = provinceMap[provinceThai];

    if (!mapping) {
      return interaction.editReply(`❌ ไม่พบข้อมูลจังหวัด "${provinceThai}" กรุณาตรวจสอบชื่อให้ถูกต้อง`);
    }

    const { city, state } = mapping;

    try {
      const url = `http://api.airvisual.com/v2/city?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=Thailand&key=${process.env.AIRVISUAL_API_KEY}`;
      const res = await axios.get(url);
      const data = res.data.data;

      const aqi = data.current.pollution.aqius;
      const pm25 = data.current.pollution.mainus;
      const temp = data.current.weather.tp;

      let level = '';
      if (aqi <= 50) level = '🟢 ดี';
      else if (aqi <= 100) level = '🟡 ปานกลาง';
      else if (aqi <= 150) level = '🟠 ไม่ดีต่อกลุ่มเสี่ยง';
      else if (aqi <= 200) level = '🔴 ไม่ดี';
      else level = '🟣 อันตรายมาก';

      const embed = new EmbedBuilder()
        .setColor('#00aaff')
        .setTitle(`🌫 คุณภาพอากาศในจังหวัด ${provinceThai}`)
        .addFields(
          { name: '📊 ค่า AQI (US)', value: `${aqi} - ${level}`, inline: true },
          { name: '🌬 PM2.5', value: `${pm25}`, inline: true },
          { name: '🌡 อุณหภูมิ', value: `${temp}°C`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'ข้อมูลจาก AirVisual API' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ ไม่สามารถดึงข้อมูลจาก AirVisual API ได้ กรุณาลองใหม่ภายหลัง');
    }
  }
};
