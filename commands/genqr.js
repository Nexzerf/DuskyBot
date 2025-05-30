const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('genqr')
    .setDescription('สร้าง QR Code จากข้อความหรือลิงก์')
    .addStringOption(option =>
      option.setName('ข้อความ')
        .setDescription('ข้อความหรือลิงก์ที่ต้องการสร้าง QR')
        .setRequired(true)),

  async execute(interaction) {
    const text = interaction.options.getString('ข้อความ');
    await interaction.deferReply();

    const fileName = `qr-${interaction.id}.png`;
    const filePath = path.join(__dirname, '..', 'temp', fileName);

    try {
      // สร้างโฟลเดอร์ temp ถ้ายังไม่มี
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath));
      }

      // สร้าง QR Code และเซฟเป็นไฟล์ PNG
      await QRCode.toFile(filePath, text, {
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        width: 300
      });

      const attachment = new AttachmentBuilder(filePath);

      await interaction.editReply({
        content: '✅ สร้าง QR Code สำเร็จ',
        files: [attachment]
      });

      // ลบไฟล์หลังส่ง
      setTimeout(() => {
        fs.unlink(filePath, () => {});
      }, 10000);

    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ ไม่สามารถสร้าง QR Code ได้');
    }
  }
};
