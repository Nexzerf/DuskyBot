const { SlashCommandBuilder } = require('@discordjs/builders');
const { infoEmbed, errorEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');
const YouTube = require('youtube-sr').default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('เล่นเพลง')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('ลิ้งค์เพลงหรือคิวเพลง')
        .setRequired(true)),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} ต้องเข้าร่วมช่องเสียงก่อน`)],
        ephemeral: true 
      });
    }

    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions?.has('Connect') || !permissions.has('Speak')) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} บอทไม่มีสิทธิ์เชื่อมต่อหรือพูดในช่องเสียงนี้`)],
        ephemeral: true 
      });
    }

    await interaction.deferReply();

    try {
      let songUrl = query;
      const isUrl = /^https?:\/\//i.test(query);

     
      if (!isUrl) {
        const result = await YouTube.searchOne(query);
        if (!result) {
          return await interaction.editReply({ 
            embeds: [errorEmbed(`${emojis.error} ไม่พบผลลัพธ์สำหรับ : \`${query}\``)]
          });
        }
        songUrl = result.url;
      }

      const queue = interaction.client.distube.getQueue(interaction.guildId);
      if (!queue) {
        await interaction.client.distube.voices.join(voiceChannel);
      }

      await interaction.client.distube.play(voiceChannel, songUrl, {
        member: interaction.member,
        textChannel: interaction.channel,
        metadata: { interaction }
      });

      await interaction.editReply({ 
        embeds: [infoEmbed(`${emojis.search} กำลังเล่น : \`${query}\``)]
      });

    } catch (error) {
      console.error(error);
      await interaction.editReply({ 
        embeds: [errorEmbed(`${emojis.error} เกิดข้อผิดพลาดในการเล่นเพลง : ${error.message}`)]
      });
    }
  },
};
