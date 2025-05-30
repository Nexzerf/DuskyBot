const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const translate = require('google-translate-api-x');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('แปลภาษาทันทีในแชท')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('ข้อความที่ต้องการแปล')
        .setRequired(true)),

  async execute(interaction) {
    const text = interaction.options.getString('text');

    const languageMenu = new StringSelectMenuBuilder()
      .setCustomId('select_language')
      .setPlaceholder('🔽 เลือกภาษาที่ต้องการแปลเป็น...')
      .addOptions([
        { label: '🇬🇧 อังกฤษ', value: 'en' },
        { label: '🇹🇭 ไทย', value: 'th' },
        { label: '🇯🇵 ญี่ปุ่น', value: 'ja' },
        { label: '🇰🇷 เกาหลี', value: 'ko' },
        { label: '🇨🇳 จีน (ตัวย่อ)', value: 'zh-cn' },
        { label: '🇹🇼 จีน (ตัวเต็ม)', value: 'zh-tw' },
        { label: '🇫🇷 ฝรั่งเศส', value: 'fr' },
        { label: '🇩🇪 เยอรมัน', value: 'de' },
        { label: '🇪🇸 สเปน', value: 'es' },
        { label: '🇮🇹 อิตาลี', value: 'it' },
        { label: '🇷🇺 รัสเซีย', value: 'ru' },
        { label: '🇵🇹 โปรตุเกส', value: 'pt' },
        { label: '🇵🇱 โปแลนด์', value: 'pl' },
        { label: '🇻🇳 เวียดนาม', value: 'vi' },
        { label: '🇮🇩 อินโดนีเซีย', value: 'id' },
        { label: '🇮🇳 ฮินดี', value: 'hi' },
        { label: '🇸🇦 อาหรับ', value: 'ar' },
        { label: '🇹🇷 ตุรกี', value: 'tr' },
        { label: '🇳🇱 ดัตช์', value: 'nl' },
        { label: '🇸🇪 สวีเดน', value: 'sv' }
      ]);

    const row = new ActionRowBuilder().addComponents(languageMenu);

    await interaction.reply({
      content: '🈯 กรุณาเลือกภาษาที่คุณต้องการแปลเป็น:',
      components: [row],
      ephemeral: true
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.customId === 'select_language' && i.user.id === interaction.user.id,
      time: 15_000,
      max: 1
    });

    collector.on('collect', async (selectInteraction) => {
      const target = selectInteraction.values[0];

      try {
        const res = await translate(text, { to: target });

        const embed = new EmbedBuilder()
          .setTitle(`📘 ผลการแปล (${res.from.language.iso} → ${target})`)
          .setDescription(res.text)
          .setColor('#3333ff');

        await selectInteraction.update({
          content: '',
          components: [],
          embeds: [embed]
        });
      } catch (error) {
        console.error(error);
        await selectInteraction.update({
          content: '❌ เกิดข้อผิดพลาดในการแปลภาษา',
          components: []
        });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({
          content: '⏰ หมดเวลาการเลือกภาษา กรุณาใช้คำสั่งใหม่อีกครั้ง',
          components: []
        });
      }
    });
  }
};
