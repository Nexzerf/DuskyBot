const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const helplineData = {
  'สุขภาพจิต': { number: '1323', detail: 'สายด่วนสุขภาพจิต กรมสุขภาพจิต' },
  'กฎหมายแรงงาน': { number: '1506', detail: 'สายด่วนกฎหมายแรงงาน กรมสวัสดิการและคุ้มครองแรงงาน' },
  'ผู้หญิงถูกทำร้าย': { number: '1300', detail: 'สายด่วนช่วยเหลือผู้หญิง สำนักงานตำรวจแห่งชาติ' },
  'วัยรุ่นมีปัญหา': { number: '1387', detail: 'สายด่วนวัยรุ่น สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ' },
  'สายด่วนทั่วไป': { number: '1111', detail: 'สายด่วนบริการประชาชน สำนักงานตำรวจแห่งชาติ' },
  'ตำรวจ': { number: '191', detail: 'สายด่วนตำรวจ' },
  'ดับเพลิง': { number: '199', detail: 'สายด่วนดับเพลิง' },
  'อุบัติเหตุ-ฉุกเฉิน': { number: '1669', detail: 'สายด่วนกู้ชีพ-กู้ภัย' },
  'ไฟไหม้': { number: '199', detail: 'สายด่วนดับเพลิง' },
  'เด็กและสตรี': { number: '1300', detail: 'สายด่วนช่วยเหลือเด็กและสตรี' },
  'คนพิการ': { number: '1300', detail: 'สายด่วนช่วยเหลือคนพิการ' },
  'สิทธิคนพิการ': { number: '1506', detail: 'สายด่วนสิทธิคนพิการ กรมส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ' },
  'สิทธิคนจน': { number: '1111', detail: 'สายด่วนช่วยเหลือประชาชนทั่วไป' },
  'ยาเสพติด': { number: '1165', detail: 'สายด่วนปรึกษาและบำบัดยาเสพติด' },
  'ผู้สูงอายุ': { number: '1300', detail: 'สายด่วนช่วยเหลือผู้สูงอายุ' },
  'การศึกษา': { number: '15439', detail: 'สายด่วนกระทรวงศึกษาธิการ' },
  'โรคติดต่อ': { number: '1422', detail: 'สายด่วนกระทรวงสาธารณสุข' },
  'ประกันสังคม': { number: '1506', detail: 'สายด่วนประกันสังคม' },
  'ค้ามนุษย์': { number: '1171', detail: 'สายด่วนป้องกันและปราบปรามการค้ามนุษย์' },
  'ภัยพิบัติ': { number: '1784', detail: 'สายด่วนเตือนภัยภัยพิบัติ' }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('helpline')
    .setDescription('แนะนำเบอร์สายด่วนช่วยเหลือตามหมวดหมู่')
    .addStringOption(option =>
      option.setName('topic')
        .setDescription('เลือกเรื่องที่ต้องการขอความช่วยเหลือ')
        .setRequired(true)
        .addChoices(
          ...Object.keys(helplineData).map(key => ({
            name: key,
            value: key
          }))
        )
    ),

  async execute(interaction) {
    const topic = interaction.options.getString('topic');
    const info = helplineData[topic];

    const embed = new EmbedBuilder()
      .setTitle(`📞 **สายด่วนช่วยเหลือเรื่อง** : ${topic}`)
      .setColor('#3333ff')
      .addFields(
        { name: 'เบอร์โทรศัพท์', value: info.number },
        { name: 'รายละเอียด', value: info.detail }
      )
      .setFooter({ text: 'สายด่วนช่วยเหลือฉุกเฉินในประเทศไทย' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
