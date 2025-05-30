const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const birthdayMessages = [
  "สุขสันต์วันเกิด 🎉 ขอให้มีความสุขมาก ๆ สุขภาพแข็งแรง และสมปรารถนาทุกอย่างน้าา",
  "🎂 Happy Birthday ขอให้ปีนี้เป็นปีที่ดีและเต็มไปด้วยความสุขนะเพื่อน",
  "🎈 ขอให้วันเกิดนี้เต็มไปด้วยเสียงหัวเราะและความทรงจำดี ๆ นะะะ",
  "สุขสันต์วันเกิดนะ ขอให้เจอแต่สิ่งดี ๆ ในชีวิตทุกวันเลย",
  "🎉 ขอให้เธอมีแต่ความสุข สุขภาพดี และประสบความสำเร็จในทุก ๆ ด้านนะ",
  "🎁 วันนี้เป็นวันของเธอ ขอให้ทุกอย่างที่หวังเป็นจริง สุขสันต์วันเกิดค้าบ",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('อวยพรวันเกิด')
    .setDescription('อวยพรวันเกิดเพื่อนในเซิร์ฟ')
    .addUserOption(option => 
      option.setName('เพื่อน')
        .setDescription('เลือกเพื่อนที่ต้องการอวยพรวันเกิด')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('เพื่อน');
    const randomIndex = Math.floor(Math.random() * birthdayMessages.length);
    const message = birthdayMessages[randomIndex];

    const embed = new EmbedBuilder()
      .setTitle(`🎉 **Happy Birthday to ${user}**`)
      .setDescription(`${message}`)
      .setColor('#3333ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
