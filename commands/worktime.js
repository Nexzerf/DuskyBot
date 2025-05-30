const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('worktime')
    .setDescription('ตั้งเวลาอ่านหนังสือหรือทำงานแบบมีระบบ')
    .addIntegerOption(option =>
      option.setName('อ่าน')
        .setDescription('ระยะเวลาอ่าน (นาที)')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('พัก')
        .setDescription('ระยะเวลาพัก (นาที)')
        .setRequired(true)),

  async execute(interaction) {
    const readMinutes = interaction.options.getInteger('อ่าน');
    const breakMinutes = interaction.options.getInteger('พัก');
    const user = interaction.user;

    let readingTimeout, breakTimeout;
    let isStopped = false;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('stop_timer')
        .setLabel('🛑 หยุด')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('reset_timer')
        .setLabel('🔄 เริ่มใหม่')
        .setStyle(ButtonStyle.Secondary)
    );

    const startEmbed = new EmbedBuilder()
      .setTitle('📚 เริ่มจับเวลาอ่าน/ทำงานแล้ว')
      .setDescription(`> 🕒 เวลาอ่าน: **${readMinutes} นาที**\n> ☕ พัก: **${breakMinutes} นาที**\n\n👤 เริ่มโดย: ${user}`)
      .setColor(0x00B894)
      .setFooter({ text: 'กำลังจับเวลาอ่าน' });

    const message = await interaction.reply({ embeds: [startEmbed], components: [row], fetchReply: true });

    // ปุ่ม listener
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: (readMinutes + breakMinutes) * 60000, // ปิด collector หลังหมดเวลา
    });

    collector.on('collect', async i => {
      if (i.user.id !== user.id) {
        return i.reply({ content: '⛔ คุณไม่สามารถควบคุมสิ่งนี้ได้', ephemeral: true });
      }

      if (i.customId === 'stop_timer') {
        isStopped = true;
        clearTimeout(readingTimeout);
        clearTimeout(breakTimeout);

        const stoppedEmbed = new EmbedBuilder()
          .setTitle('🛑 หยุดเวลาอ่าน/ทำงานแล้ว')
          .setDescription(`คุณหยุดการนับเวลาเรียบร้อยแล้ว\n\nพักผ่อนให้เพียงพอน้าา 🍃`)
          .setColor(0xD63031);

        await i.update({ embeds: [stoppedEmbed], components: [] });
        collector.stop();
      }

      if (i.customId === 'reset_timer') {
        isStopped = true;
        clearTimeout(readingTimeout);
        clearTimeout(breakTimeout);

        const resetEmbed = new EmbedBuilder()
          .setTitle('🔄 เริ่มใหม่แล้ว')
          .setDescription(`ระบบกำลังเริ่มใหม่...\n\nกรุณารันคำสั่ง \`/worktime\` อีกครั้งเพื่อเริ่มรอบใหม่`)
          .setColor(0x6C5CE7)
          .setTimestamp();

        await i.update({ embeds: [resetEmbed], components: [] });
        collector.stop();
      }
    });

    // เริ่มจับเวลาอ่าน
    readingTimeout = setTimeout(async () => {
      if (isStopped) return;

      const endReadEmbed = new EmbedBuilder()
        .setTitle('⏰ ครบเวลาอ่านแล้ว')
        .setDescription(`> ได้เวลา **พัก ${breakMinutes} นาที** แล้ว\n\n📚 เก่งมาก เก่งที่สุด!`)
        .setColor(0xE17055);

      await interaction.followUp({ embeds: [endReadEmbed] });

      // เริ่มจับเวลาพัก
      breakTimeout = setTimeout(async () => {
        if (isStopped) return;

        const endBreakEmbed = new EmbedBuilder()
          .setTitle('☕ ครบเวลาพักแล้ว')
          .setDescription(`> พร้อมเริ่มอ่านรอบใหม่หรือยัง? ✨\n\nอย่าลืมพักสายตาด้วยน้าา`)
          .setColor(0xA1887F);

        await interaction.followUp({ embeds: [endBreakEmbed] });

      }, breakMinutes * 60000);

    }, readMinutes * 60000);
  }
};
