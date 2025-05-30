const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moodcheckin')
    .setDescription('บอกอารมณ์และความรู้สึกของคุณวันนี้')
    .addStringOption(option =>
      option.setName('mood')
        .setDescription('เลือกอารมณ์ของคุณวันนี้')
        .setRequired(true)
        .addChoices(
          { name: 'สดใส 😊', value: 'happy' },
          { name: 'เหนื่อย 😓', value: 'tired' },
          { name: 'เครียด/เศร้า 😞', value: 'stressed' },
          { name: 'ว่างเปล่า 😐', value: 'empty' },
        ))
    .addStringOption(option =>
      option.setName('feeling')
        .setDescription('บอกความรู้สึกของคุณวันนี้ (ไม่บังคับ)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const mood = interaction.options.getString('mood');
    const feeling = interaction.options.getString('feeling') || '- ไม่ได้บอกความรู้สึก -';

    let moodDesc = '';
    let color = '#3333FF';

    switch (mood) {
      case 'happy':
        moodDesc = 'ดีใจที่คุณรู้สึกสดใสนะ 😊 ลองฝึกหายใจลึก ๆ และสนุกกับสิ่งที่ทำในวันนี้นะ!';
        color = '#FFD700'; // สีทอง
        break;
      case 'tired':
        moodDesc = 'รู้สึกเหนื่อยก็พักบ้างนะ 😌 ลองฝึกการทำ mindfulness หรือหยุดพักสั้น ๆ เพื่อรีเฟรชตัวเอง';
        color = '#87CEEB'; // สีฟ้าอ่อน
        break;
      case 'stressed':
        moodDesc = 'อย่าลืมหายใจลึก ๆ และปล่อยวางบ้างนะ 😞 คุณไม่ได้อยู่คนเดียว เดินช้า ๆ และฟังเสียงใจตัวเอง';
        color = '#FF6347'; // สีส้มแดง
        break;
      case 'empty':
        moodDesc = 'บางครั้งการว่างเปล่าก็เป็นสิ่งที่ต้องการนะ 😐 ลองจดบันทึกความคิด หรือฟังเพลงเบา ๆ เพื่อเติมพลัง';
        color = '#808080'; // สีเทา
        break;
    }

    const embed = new EmbedBuilder()
      .setTitle('📋 Mood Check-in')
      .setColor(color)
      .addFields(
        { name: 'อารมณ์วันนี้', value: moodDesc },
        { name: 'ความรู้สึกของคุณ', value: feeling }
      )
      .setFooter({ text: `บันทึกโดย: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
