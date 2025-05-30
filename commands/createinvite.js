const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createinvite')
    .setDescription('สร้างลิงก์เชิญสำหรับเข้าช่องในเซิร์ฟเวอร์นี้')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('เลือกช่องที่จะสร้างลิงก์เชิญ')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    // ตรวจสอบว่าเป็นช่องข้อความหรือเสียง
    if (!channel.isTextBased() && !channel.isVoiceBased()) {
      return interaction.reply({ content: '❌ ไม่สามารถสร้างลิงก์เชิญในช่องนี้ได้', ephemeral: true });
    }

    try {
      const invite = await channel.createInvite({
        maxAge: 0, // อายุ 1 ชั่วโมง
        maxUses: 0,      // ใช้ได้ 5 ครั้ง
        unique: true,
        reason: `สร้างโดย ${interaction.user.tag}`
      });

      return interaction.reply({
        content: `✅ ลิงก์เชิญของคุณ: ${invite.url}`,
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: '❌ เกิดข้อผิดพลาดในการสร้างลิงก์เชิญ โปรดตรวจสอบสิทธิ์ของบอท',
        ephemeral: true
      });
    }
  }
};
