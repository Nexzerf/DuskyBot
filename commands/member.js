const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('member')
    .setDescription('ดูจำนวนสมาชิกในเซิร์ฟเวอร์ แยกคนกับบอท'),

  async execute(interaction) {
    const guild = interaction.guild;

    // นับสมาชิกทั้งหมด
    const totalMembers = guild.memberCount;

    // นับบอท
    const bots = guild.members.cache.filter(member => member.user.bot).size;

    // นับคน (สมาชิกจริง)
    const humans = totalMembers - bots;

    const embed = new EmbedBuilder()
      .setTitle(`📊 จำนวนสมาชิกในเซิร์ฟเวอร์: ${guild.name}`)
      .addFields(
        { name: '👤 สมาชิกจริง', value: `${humans}`, inline: true },
        { name: '🤖 บอท', value: `${bots}`, inline: true },
        { name: '🧮 รวมทั้งหมด', value: `${totalMembers}`, inline: true },
      )
      .setColor('#3333ff')
      .setTimestamp()
      .setFooter({ text: `ID เซิร์ฟเวอร์: ${guild.id}` });

    await interaction.reply({ embeds: [embed] });
  }
};
