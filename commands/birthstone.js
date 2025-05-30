// commands/birthstone.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const birthstones = {
  มกราคม: { gem: 'โกเมน (Garnet)', meaning: 'ปกป้องจากอันตราย เสริมพลังใจ' },
  กุมภาพันธ์: { gem: 'อเมทิสต์ (Amethyst)', meaning: 'ปกป้องจากพลังลบ และส่งเสริมสติ' },
  มีนาคม: { gem: 'อะความารีน (Aquamarine)', meaning: 'เสริมความสงบและความกล้าแสดงออก' },
  เมษายน: { gem: 'เพชร (Diamond)', meaning: 'เสริมความบริสุทธิ์ มั่นคง และความสำเร็จ' },
  พฤษภาคม: { gem: 'มรกต (Emerald)', meaning: 'เสริมเมตตา ความรัก ความมั่นคง' },
  มิถุนายน: { gem: 'ไข่มุก (Pearl)', meaning: 'ส่งเสริมความบริสุทธิ์และเสน่ห์' },
  กรกฎาคม: { gem: 'ทับทิม (Ruby)', meaning: 'เสริมพลังชีวิต ความรัก และโชคลาภ' },
  สิงหาคม: { gem: 'เพอริดอท (Peridot)', meaning: 'ช่วยปัดเป่าพลังลบ นำโชคดีมาให้' },
  กันยายน: { gem: 'ไพลิน (Sapphire)', meaning: 'เสริมปัญญาและความยุติธรรม' },
  ตุลาคม: { gem: 'โอปอล (Opal)', meaning: 'เพิ่มเสน่ห์ ความคิดสร้างสรรค์' },
  พฤศจิกายน: { gem: 'โทแพซ (Topaz)', meaning: 'เสริมความมั่นใจและดึงดูดโชคลาภ' },
  ธันวาคม: { gem: 'เทอร์ควอยซ์ (Turquoise)', meaning: 'ปกป้องจากอันตรายและเสริมสุขภาพ' }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('birthstone')
    .setDescription('แนะนำอัญมณีมงคลประจำเดือนเกิด')
    .addStringOption(option =>
      option.setName('เดือนเกิด')
        .setDescription('เลือกเดือนเกิดของคุณ')
        .setRequired(true)
        .addChoices(
          ...Object.keys(birthstones).map(month => ({ name: month, value: month }))
        )
    ),

  async execute(interaction) {
    const month = interaction.options.getString('เดือนเกิด');
    const { gem, meaning } = birthstones[month];

    const embed = new EmbedBuilder()
      .setTitle(`💎 อัญมณีมงคลประจำเดือน ${month}`)
      .setColor('#3333ff')
      .addFields(
        { name: 'อัญมณี', value: gem, inline: true },
        { name: 'ความหมาย', value: meaning, inline: true }
      )
      .setFooter({ text: 'เพื่อความเป็นสิริมงคล ใช้วิจารณญาณในการเชื่อ' });

    await interaction.reply({ embeds: [embed] });
  }
};
