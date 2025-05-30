const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const forms = [
  { name: 'ใบแจ้งเกิด', description: 'ฟอร์มแจ้งเกิดทารก', url: 'https://kasetsomboon.go.th/UserFiles/File/60/jangkad.pdf' },
  { name: 'ใบแจ้งย้าย', description: 'ฟอร์มแจ้งย้ายที่อยู่', url: 'https://kasetsomboon.go.th/UserFiles/File/60/jangyay.pdf' },
  { name: 'ใบมอบอำนาจ', description: 'ฟอร์มมอบอำนาจให้ผู้อื่นดำเนินการแทน', url: 'https://www.bora.dopa.go.th/wp-content/uploads/2022/07/book_permission1548.pdf' },
  { name: 'แบบขอเบี้ยคนชรา', description: 'แบบขอรับเบี้ยยังชีพคนชรา', url: 'https://www.fayard.go.th/downloadfile-96.html' },
  { name: 'แบบขอเบี้ยคนพิการ', description: 'แบบขอรับเบี้ยยังชีพคนพิการ', url: 'https://www.dar.go.th/index/add_file/w8jg8t9Tue13223.pdf' },
  { name: 'ใบสมัครงานราชการ', description: 'ฟอร์มสมัครงานราชการทั่วไป', url: 'https://job.ocsc.go.th/images/Job/638350375083839697.pdf' },
  { name: 'แบบคำร้องขอทำบัตรประชาชน', description: 'ฟอร์มขอบัตรประชาชนใหม่หรือเปลี่ยนแปลงข้อมูล', url: 'https://image.mfa.go.th/mfa/0/7pRkP4tkCe/Form(s)/TH/%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%9F%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A1%E0%B8%82%E0%B8%AD%E0%B8%97%E0%B8%B3%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%8A%E0%B8%99_-_Thai_ID_Card_Application_Form.pdf' },
  { name: 'ใบขอรับเงินสงเคราะห์บุตร', description: 'ฟอร์มขอรับเงินสงเคราะห์บุตร', url: 'http://abt.in.th/_files_aorbortor/120533/uploads/files/%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%9F%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A1%E0%B8%A5%E0%B8%87%E0%B8%97%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B9%80%E0%B8%94%E0%B9%87%E0%B8%81%E0%B9%81%E0%B8%A3%E0%B8%81%E0%B9%80%E0%B8%81%E0%B8%B4%E0%B8%94.pdf' },
  { name: 'แบบคำร้องขอหนังสือเดินทาง', description: 'ฟอร์มขอหนังสือเดินทาง', url: 'https://image.mfa.go.th/mfa/0/GuK2XatnjK/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%81%E0%B8%87%E0%B8%AA%E0%B8%B8%E0%B8%A5/Thai_PP.pdf' },
  { name: 'แบบคำร้องขอรับเงินสงเคราะห์ผู้ประสบภัย', description: 'ฟอร์มขอรับเงินช่วยเหลือผู้ประสบภัย', url: 'https://www.prdsc.com/coop/ckeditor/system/plugins/ckfinder/upload/FROM-67-disaster-victims.pdf' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ฟอร์มราชการ')
    .setDescription('เลือกฟอร์มราชการที่ต้องการ')
    .addStringOption(option =>
      option.setName('form')
        .setDescription('เลือกฟอร์มราชการ')
        .setRequired(true)
        .addChoices(
          forms.map(f => ({ name: f.name, value: f.name }))
        )
    ),

  async execute(interaction) {
    const selectedFormName = interaction.options.getString('form');

    const form = forms.find(f => f.name === selectedFormName);

    if (!form) {
      return interaction.reply({
        content: '❌ ไม่พบฟอร์มที่เลือก',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`📄 ฟอร์ม: ${form.name}`)
      .setDescription(`[ดาวน์โหลดฟอร์ม](${form.url})\n\n${form.description}`)
      .setColor('#3333ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
