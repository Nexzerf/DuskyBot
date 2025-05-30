const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('แบนสมาชิกออกจากเซิร์ฟเวอร์')
    .addUserOption(option => 
      option.setName('สมาชิก')
        .setDescription('เลือกสมาชิกที่ต้องการแบน')
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('เหตุผล')
        .setDescription('ใส่เหตุผลในการแบน (ถ้ามี)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('สมาชิก');
    const reason = interaction.options.getString('เหตุผล') || 'ไม่มีเหตุผลระบุ';

    if (!member) {
      return interaction.reply({ content: 'ไม่พบสมาชิกนี้ในเซิร์ฟเวอร์', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: 'ไม่สามารถแบนสมาชิกนี้ได้ อาจเป็นเพราะสิทธิ์ของบอทไม่เพียงพอ', ephemeral: true });
    }

    try {
      await member.ban({ reason });

      const embed = new EmbedBuilder()
        .setTitle('🚫 แบนสมาชิกเรียบร้อย')
        .setColor('#3333ff')
        .addFields(
          { name: 'ผู้ถูกแบน', value: `${member.user.tag} (${member.id})` },
          { name: 'ผู้แบน', value: `${interaction.user.tag}`, inline: true },
          { name: 'เหตุผล', value: reason }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'เกิดข้อผิดพลาดในการแบนสมาชิก', ephemeral: true });
    }
  }
};
