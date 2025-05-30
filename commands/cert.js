const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cert')
    .setDescription('ดูกิจกรรมที่คุณสนใจเก็บเกียรติบัตร')
    .addStringOption(option =>
      option.setName('หมวดหมู่')
        .setDescription('เลือกประเภทกิจกรรมที่ต้องการ')
        .setRequired(true)
        .addChoices(
          { name: '📚 คอร์สเรียน', value: 'course' },
          { name: '🏕️ ค่าย', value: 'camp' },
          { name: '🎓 MOOC มหาวิทยาลัย', value: 'mooc' },
          { name: '🏆 การแข่งขัน/ประกวด', value: 'competition' },
          { name: '🧑‍🏫 อบรม/สัมมนา', value: 'seminar' },
          { name: '📅 คอร์สเรียนล่วงหน้า', value: 'upcoming_courses' }
        )
    ),

  async execute(interaction) {
    const category = interaction.options.getString('หมวดหมู่');

    const embeds = {
      course: new EmbedBuilder()
        .setColor('#3333ff')
        .setTitle('📚 **คอร์สเรียนแนะนำ**')
        .setDescription([
          '**Google Digital Garage**',
          '🟢 Digital Marketing, มีเกียรติบัตร',
          '🔗 https://learndigital.withgoogle.com/',
        ].join('\n')),

      camp: new EmbedBuilder()
        .setColor('#3333ff')
        .setTitle('🏕️ **ค่ายแนะนำ**')
        .setDescription([
          '**Camphub / Hatumport**',
          '🔗 https://www.camphub.in.th/news/',
          '🔗 https://www.instagram.com/hatum.port/'
        ].join('\n')),

      mooc: new EmbedBuilder()
        .setColor('#3333ff')
        .setTitle('🎓 **MOOC มหาวิทยาลัย**')
        .setDescription([
          '**MUx (ม.มหิดล)** - https://mux.mahidol.ac.th',
          '**CHULA MOOC** - https://mooc.chula.ac.th',
          '**CMU MOOC** - https://mooc.cmu.ac.th',
          '**TU MOOC** - https://tunext.com/',
          '**Thai MOOC** - https://thaimooc.org',
          '**PSU MOOC** - https://mooc.psu.ac.th/',
          '**Plearn RMUTT** - https://plearn.rmutt.ac.th/',
          '**KLIX KMITL** - https://klix.kmitl.ac.th/',
          '**KU MOOC** - https://kumooc.ku.th/',
          '**CMRU MOOC** - https://cmrumooc.teachable.com/'
        ].join('\n')),

      competition: new EmbedBuilder()
        .setColor('#3333ff')
        .setTitle('🏆 **การแข่งขัน/ประกวด**')
        .setDescription([
          '🔗 https://www.camphub.in.th/type/contest/',
          '🔗 https://contest-thailand.com/'
        ].join('\n')),

      seminar: new EmbedBuilder()
        .setColor('#3333ff')
        .setTitle('🧑‍🏫 **อบรม/สัมมนา**')
        .setDescription([
          '**Eventpop**',
          '🔗 https://www.eventpop.me/g/education'
        ].join('\n')),

      upcoming_courses: new EmbedBuilder()
      .setColor('#3333ff')
      .setTitle('📅 **คอร์สเรียนล่วงหน้า**')
      .setDescription([
        '**โครงการเรียนล่วงหน้าของมหาวิทยาลัยเกษตรศาสตร์**',
        '🔗 https://registrar.ku.ac.th/adv',
        '**เรียนร่วม มช.**',
        '🔗 https://www.lifelong.cmu.ac.th/advanced-cmu/about',
        '**PRE BUU - มหาวิทยาลัยบูรพา**',
        '**Pre-degree - มหาวิทยาลัยรามคำแหง**',
        '🔗 http://www.kan.ru.ac.th/pre-degree/',
        '**สัมฤทธิบัตร - มหาวิทยาลัยสุโขทัยธรรมาธิราช**',
          '🔗 https://www.stou.ac.th/study/sumrit/Learn/page3.html',
      ].join('\n')),
    };

    await interaction.reply({ embeds: [embeds[category]] });
  }
};
