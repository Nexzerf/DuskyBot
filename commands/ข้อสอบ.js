const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const examData = {
  'ประถมศึกษาปีที่ 6': {
    'O-NET': [
      { year: '2568', link: 'https://www.kruchiangrai.net/2025/01/18/ข้อสอบ-o-net-ปีการศึกษา-2568-พร้อมเฉลย/' },
      { year: '2567', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2566', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2565', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2564', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2563', link: 'https://www.niets.or.th/th/content/view/22345' }
    ]
  },
  'มัธยมศึกษาปีที่ 3': {
    'O-NET': [
      { year: '2568', link: 'https://www.kruchiangrai.net/2025/01/18/ข้อสอบ-o-net-ปีการศึกษา-2568-พร้อมเฉลย/' },
      { year: '2567', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2566', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2565', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2564', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2563', link: 'https://www.niets.or.th/th/content/view/22345' }
    ]
  },
  'มัธยมศึกษาปีที่ 6': {
    'O-NET': [
      { year: '2568', link: 'https://www.kruchiangrai.net/2025/01/18/ข้อสอบ-o-net-ปีการศึกษา-2568-พร้อมเฉลย/' },
      { year: '2567', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2566', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2565', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2564', link: 'https://www.niets.or.th/th/catalog/view/630' },
      { year: '2563', link: 'https://www.niets.or.th/th/content/view/22345' }
    ],
    'TGAT': [
      { year: '2566', link: 'https://www.eduzones.com/2024/12/06/tgat-3/' },
      { year: '2565', link: 'https://www.eduzones.com/2024/12/06/tgat-3/' }
    ],
    'TPAT': [
      { year: '2566', link: 'https://www.physicsblueprint.com/exam-tpat3-66/' },
      { year: '2565', link: 'https://www.physicsblueprint.com/exam-tpat3-66/' }
    ],
    'A-Level': [
      { year: '2568', link: 'https://www.sangfans.com/testeng-sanam/' },
      { year: '2567', link: 'https://www.sangfans.com/testeng-sanam/' },
      { year: '2566', link: 'https://www.sangfans.com/testeng-sanam/' },
      { year: '2565', link: 'https://www.sangfans.com/testeng-sanam/' },
      { year: '2564', link: 'https://www.sangfans.com/testeng-sanam/' }
    ]
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ข้อสอบ')
    .setDescription('ดาวน์โหลดข้อสอบเก่า O-NET, TGAT, TPAT, A-Level')
    .addStringOption(option =>
      option.setName('ระดับ')
        .setDescription('เลือกระดับชั้น')
        .setRequired(true)
        .addChoices(
          { name: 'ประถมศึกษาปีที่ 6', value: 'ประถมศึกษาปีที่ 6' },
          { name: 'มัธยมศึกษาปีที่ 3', value: 'มัธยมศึกษาปีที่ 3' },
          { name: 'มัธยมศึกษาปีที่ 6', value: 'มัธยมศึกษาปีที่ 6' }
        )
    ),

  async execute(interaction) {
    const level = interaction.options.getString('ระดับ');
    const exams = examData[level];

    if (!exams) {
      return interaction.reply({ content: '❌ ไม่พบข้อมูลข้อสอบสำหรับระดับที่เลือก', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`📚 ข้อสอบย้อนหลัง (${level})`)
      .setDescription(`รวมข้อสอบ O-NET, TGAT, TPAT, A-Level สำหรับนักเรียนระดับ ${level}`)
      .setColor('#3333ff')
      .setFooter({ text: 'ข้อมูลอัปเดตล่าสุด' })
      .setTimestamp();

    for (const [examType, examsArr] of Object.entries(exams)) {
      const examList = examsArr.map(e => `• [${examType} ${e.year}](${e.link})`).join('\n');
      embed.addFields({ name: `📝 ${examType}`, value: examList });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
