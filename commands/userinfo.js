const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('แสดงข้อมูลของผู้ใช้')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('เลือกผู้ใช้')
        .setRequired(false)
    ),

  async execute(interaction) {
    const member = interaction.options.getMember('user') || interaction.member;
    const user = member.user;

    const embed = new EmbedBuilder()
      .setTitle(`ℹ️ ข้อมูลของ ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor('#3333FF')
      .addFields(
        { name: '👤 ชื่อผู้ใช้', value: `${user.tag}`, inline: true },
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '📅 สร้างบัญชีเมื่อ', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
        { name: '🛬 เข้าร่วมเซิร์ฟเวอร์เมื่อ', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
        {
          name: '🔰 บทบาท',
          value: member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => role.toString())
            .join(', ') || 'ไม่มี',
          inline: false
        }
      )
      .setFooter({ text: `ร้องขอโดย ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
