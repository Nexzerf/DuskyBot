const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('เตะสมาชิกออกจากเซิร์ฟเวอร์')
    .addUserOption(option =>
      option.setName('สมาชิก')
        .setDescription('เลือกสมาชิกที่ต้องการเตะ')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('เหตุผล')
        .setDescription('ใส่เหตุผลในการเตะ (ถ้ามี)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('สมาชิก');
    const reason = interaction.options.getString('เหตุผล') || 'ไม่มีเหตุผลระบุ';

    if (!member) {
      return interaction.reply({ content: 'ไม่พบสมาชิกนี้ในเซิร์ฟเวอร์', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: 'ไม่สามารถเตะสมาชิกนี้ได้ อาจเป็นเพราะสิทธิ์ของบอทไม่เพียงพอ', ephemeral: true });
    }

    try {
      await member.kick(reason);

      const embed = new EmbedBuilder()
        .setTitle('👢 เตะสมาชิกเรียบร้อย')
        .setColor('#3333ff')
        .addFields(
          { name: 'ผู้ถูกเตะ', value: `${member.user.tag} (${member.id})` },
          { name: 'ผู้เตะ', value: `${interaction.user.tag}`, inline: true },
          { name: 'เหตุผล', value: reason }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'เกิดข้อผิดพลาดในการเตะสมาชิก', ephemeral: true });
    }
  }
};
