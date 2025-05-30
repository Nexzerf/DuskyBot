const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const siemSee = [
  { number: 1, text: "เรื่องรักจะสมหวังในเวลาอันเหมาะสม" },
  { number: 2, text: "ระวังอุปสรรคเล็กน้อย แต่จะผ่านไปได้" },
  { number: 3, text: "มีโชคดีในเรื่องเงินทอง" },
  { number: 4, text: "สุขภาพต้องดูแลมากขึ้นในช่วงนี้" },
  { number: 5, text: "เดินทางจะปลอดภัย" },
  { number: 6, text: "ระวังคนไม่จริงใจเข้ามาใกล้" },
  { number: 7, text: "มีโชคเรื่องงานประสบความสำเร็จ" },
  { number: 8, text: "จะได้ข่าวดีจากญาติผู้ใหญ่" },
  { number: 9, text: "ความรักต้องอดทนและเข้าใจ" },
  { number: 10, text: "การเงินจะดีขึ้นเรื่อย ๆ" },
  { number: 11, text: "ระวังการทะเลาะเบาะแว้งกับคนใกล้ชิด" },
  { number: 12, text: "มีโอกาสเปลี่ยนแปลงที่ดีในชีวิต" },
  { number: 13, text: "โชคลาภเล็ก ๆ จะเข้ามา" },
  { number: 14, text: "ต้องใช้ความอดทนสูงในการทำงาน" },
  { number: 15, text: "สุขภาพใจดี จะช่วยให้ร่างกายแข็งแรง" },
  { number: 16, text: "เดินทางไกลจะมีโชคดี" },
  { number: 17, text: "จะได้รับความช่วยเหลือจากคนรอบข้าง" },
  { number: 18, text: "ระวังเรื่องการเงิน อย่ารับปากใครง่าย ๆ" },
  { number: 19, text: "จะได้พบคนดีเข้ามาในชีวิต" },
  { number: 20, text: "ความรักสดใส มีความสุข" },
  { number: 21, text: "มีโอกาสเปลี่ยนแปลงที่ทำให้ดีขึ้น" },
  { number: 22, text: "ระวังการลงทุน มีความเสี่ยง" },
  { number: 23, text: "ครอบครัวจะมีความสุขอบอุ่น" },
  { number: 24, text: "ต้องทำงานหนักเพื่อผลสำเร็จ" },
  { number: 25, text: "โชคดีจะเข้ามาหาในเร็ววัน" }
];

function getRandomSiemSee() {
  // สุ่ม 1 เบอร์จาก 25 เบอร์
  const index = Math.floor(Math.random() * siemSee.length);
  return siemSee[index];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('siemsee')
    .setDescription('สุ่มเซียมซี 25 เบอร์'),

  async execute(interaction) {
    const siem = getRandomSiemSee();

    const embed = new EmbedBuilder()
      .setTitle(`🎲 ผลเซียมซี เบอร์ ${siem.number}`)
      .setDescription(siem.text)
      .setColor('#0099ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
