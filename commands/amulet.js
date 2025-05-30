// commands/amulet.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const amuletByTopic = {
  การงาน: '🔹 **หลวงปู่ทวด** – เสริมความน่าเกรงขาม และเมตตา\n🔹 **พระปิดตา** – ปิดปากคนไม่หวังดี ทำให้มีสมาธิในการทำงาน',
  ความรัก: '💖 **พระขุนแผน** – เสริมเสน่ห์ เมตตามหานิยม\n💖 **นางกวัก** – เรียกคนรัก ให้คนเอ็นดู',
  ป้องกันภัย: '🛡️ **หลวงพ่อโสธร** – ป้องกันอันตราย เดินทางปลอดภัย\n🛡️ **หลวงพ่อเงิน** – กันภัย กันคุณไสย สิ่งไม่ดี',
  โชคลาภ: '💰 **หลวงพ่อรวย** – เสริมโชคลาภ การเงิน\n💰 **พระสมเด็จ** – เสริมดวงด้านฐานะ',
  สุขภาพ: '🍀 **พระปิดตา** – กันโรคภัย\n🍀 **หลวงพ่อคูณ** – คุ้มครองสุขภาพและชีวิต',
};

const amuletByBirthday = {
  อาทิตย์: '🌞 **พระปางถวายเนตร** – เสริมบารมี น่าเกรงขาม',
  จันทร์: '🌙 **พระปางห้ามสมุทร** – เสริมเสน่ห์ เมตตา',
  อังคาร: '🔥 **พระปางไสยาสน์** – ป้องกันภัย คุ้มครอง',
  พุธกลางวัน: '🌤️ **พระปางอุ้มบาตร** – เสริมเมตตา มนุษยสัมพันธ์',
  พุธกลางคืน: '🌌 **พระปางป่าเลไลย์** – หนุนดวงลึกลับ ป้องกันภัยลับ',
  พฤหัสบดี: '📘 **พระปางสมาธิ** – เสริมสติปัญญา ความรู้',
  ศุกร์: '💗 **พระปางรำพึง** – เสริมเสน่ห์ ความรัก',
  เสาร์: '🪨 **พระปางนาคปรก** – ป้องกันภัยหนัก คุ้มครองชีวิต',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('amulet')
    .setDescription('แนะนำพระเครื่อง/ของมงคลตามความต้องการ')
    .addStringOption(option =>
      option.setName('เรื่องที่อยากเสริม')
        .setDescription('ระบุเรื่อง เช่น การงาน ความรัก โชคลาภ ป้องกันภัย สุขภาพ หรือวันเกิด')
        .setRequired(true)
        .addChoices(
          { name: 'การงาน', value: 'การงาน' },
          { name: 'ความรัก', value: 'ความรัก' },
          { name: 'โชคลาภ', value: 'โชคลาภ' },
          { name: 'ป้องกันภัย', value: 'ป้องกันภัย' },
          { name: 'สุขภาพ', value: 'สุขภาพ' },
          { name: 'วันอาทิตย์', value: 'อาทิตย์' },
          { name: 'วันจันทร์', value: 'จันทร์' },
          { name: 'วันอังคาร', value: 'อังคาร' },
          { name: 'วันพุธ (กลางวัน)', value: 'พุธกลางวัน' },
          { name: 'วันพุธ (กลางคืน)', value: 'พุธกลางคืน' },
          { name: 'วันพฤหัสบดี', value: 'พฤหัสบดี' },
          { name: 'วันศุกร์', value: 'ศุกร์' },
          { name: 'วันเสาร์', value: 'เสาร์' }
        )
    ),

  async execute(interaction) {
    const topic = interaction.options.getString('เรื่องที่อยากเสริม');
    const isBirthday = topic in amuletByBirthday;
    const description = isBirthday
      ? amuletByBirthday[topic]
      : amuletByTopic[topic];

    const embed = new EmbedBuilder()
      .setTitle(isBirthday ? `✨ พระประจำวันเกิด: วัน${topic}` : `🔮 พระแนะนำสำหรับ${topic}`)
      .setDescription(description)
      .setColor(isBirthday ? '#ffcc00' : '#0099ff')
      .setFooter({ text: 'เพื่อความเชื่อส่วนบุคคล โปรดใช้วิจารณญาณ' });

    await interaction.reply({ embeds: [embed] });
  }
};
