const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const billInfo = {
  'ค่าน้ำ': {
    name: 'การประปานครหลวง (กปน.) / การประปาส่วนภูมิภาค (กปภ.)',
    linkMwa: 'https://www.mwa.co.th/',
    linkPwa: 'https://www.pwa.co.th/',
    guide: `**วิธีเช็กบิลค่าน้ำ**
- กปน. (กรุงเทพฯ, นนทบุรี, สมุทรปราการ):
1. เข้าเว็บไซต์ [กปน.](https://www.mwa.co.th/)
2. เลือกเมนู "ชำระบิล" หรือ "ตรวจสอบบิล"
3. กรอกเลขที่ผู้ใช้น้ำหรือหมายเลขบิล

- กปภ. (ต่างจังหวัด):
1. เข้าเว็บไซต์ [กปภ.](https://www.pwa.co.th/)
2. เลือกเมนู "ตรวจสอบบิลค่าน้ำ"
3. กรอกเลขผู้ใช้น้ำหรือข้อมูลที่กำหนด`
  },
  'ค่าไฟ': {
    name: 'MEA, PEA, และ กฟน.',
    linkMEA: 'https://www.mea.or.th/',
    linkPEA: 'https://www.pea.co.th/',
    linkPEAapp: 'https://play.google.com/store/apps/details?id=com.pea.smartplus',
    guide: `**วิธีเช็กบิลค่าไฟ**
- MEA (กทม., นนทบุรี, สมุทรปราการ):
1. เข้าเว็บไซต์ [MEA](https://www.mea.or.th/)
2. ใช้เมนู "ตรวจสอบบิลค่าไฟ"

- PEA (ต่างจังหวัด):
1. เข้าเว็บไซต์ [PEA](https://www.pea.co.th/)
2. หรือดาวน์โหลดแอป [PEA Smart Plus](https://play.google.com/store/apps/details?id=com.pea.smartplus)
3. กรอกเลขผู้ใช้ไฟฟ้าเพื่อตรวจสอบบิล`
  },
  'เน็ต': {
    name: 'True, 3BB, AIS Fibre, CAT',
    linkTrue: 'https://www.trueonline.com/payment',
    link3BB: 'https://www.3bb.co.th/payment',
    linkAIS: 'https://www.ais.co.th/internet/payment/',
    linkCAT: 'https://www.cattelecom.com/payment/',
    guide: `**วิธีเช็กบิลอินเทอร์เน็ต**
- True Online:
1. เข้าเว็บไซต์ [True Online](https://www.trueonline.com/payment)
2. ลงชื่อเข้าใช้หรือกรอกข้อมูลลูกค้า

- 3BB:
1. เข้าเว็บไซต์ [3BB](https://www.3bb.co.th/payment)
2. ลงชื่อเข้าใช้หรือกรอกข้อมูลลูกค้า

- AIS Fibre:
1. เข้าเว็บไซต์ [AIS Fibre](https://www.ais.co.th/internet/payment/)
2. ลงชื่อเข้าใช้หรือกรอกข้อมูลลูกค้า

- CAT Telecom:
1. เข้าเว็บไซต์ [CAT Telecom](https://www.cattelecom.com/payment/)
2. ตรวจสอบบิลผ่านระบบออนไลน์`
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('billcheck')
    .setDescription('ส่งลิงก์และวิธีเช็กบิลค่าน้ำ ค่าไฟ ค่าเน็ต')
    .addStringOption(option =>
      option.setName('ประเภท')
        .setDescription('เลือกประเภทบิลที่ต้องการ เช่น ค่าน้ำ, ค่าไฟ, เน็ต')
        .setRequired(true)
        .addChoices(
          { name: 'ค่าน้ำ', value: 'ค่าน้ำ' },
          { name: 'ค่าไฟ', value: 'ค่าไฟ' },
          { name: 'เน็ต', value: 'เน็ต' }
        )),

  async execute(interaction) {
    const type = interaction.options.getString('ประเภท');

    if (type === 'ค่าน้ำ') {
      const info = billInfo['ค่าน้ำ'];
      const embed = new EmbedBuilder()
        .setTitle(`💧 บิลค่าน้ำ - ${info.name}`)
        .setColor('#3333ff')
        .setDescription(`**เว็บไซต์หลัก**\n- [กปน.](${info.linkMwa})\n- [กปภ.](${info.linkPwa})\n\n${info.guide}`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } else if (type === 'ค่าไฟ') {
      const info = billInfo['ค่าไฟ'];
      const embed = new EmbedBuilder()
        .setTitle(`⚡ บิลค่าไฟ - ${info.name}`)
        .setColor('#3333ff')
        .setDescription(`${info.guide}`)
        .addFields(
          { name: 'MEA (กทม.)', value: `[เข้าสู่เว็บไซต์ MEA](${info.linkMEA})`, inline: true },
          { name: 'PEA (ต่างจังหวัด)', value: `[เข้าสู่เว็บไซต์ PEA](${info.linkPEA})\n[ดาวน์โหลดแอป PEA Smart Plus](${info.linkPEAapp})`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } else if (type === 'เน็ต') {
      const info = billInfo['เน็ต'];
      const embed = new EmbedBuilder()
        .setTitle(`🌐 **บิลอินเทอร์เน็ต** - ${info.name}`)
        .setColor('#3333ff')
        .setDescription(`${info.guide}`)
        .addFields(
          { name: 'True Online', value: `[เข้าสู่เว็บไซต์ True Online](${info.linkTrue})`, inline: true },
          { name: '3BB', value: `[เข้าสู่เว็บไซต์ 3BB](${info.link3BB})`, inline: true },
          { name: 'AIS Fibre', value: `[เข้าสู่เว็บไซต์ AIS Fibre](${info.linkAIS})`, inline: true },
          { name: 'CAT Telecom', value: `[เข้าสู่เว็บไซต์ CAT Telecom](${info.linkCAT})`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } else {
      await interaction.reply({ content: '❌ กรุณาเลือกประเภทบิลที่ถูกต้อง (ค่าน้ำ, ค่าไฟ, เน็ต)', ephemeral: true });
    }
  }
};
