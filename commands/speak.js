const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource, 
  AudioPlayerStatus 
} = require('@discordjs/voice');
const googleTTS = require('google-tts-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('speak')
    .setDescription('พูดข้อความด้วยเสียง TTS')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('ข้อความที่ต้องการพูด')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('lang')
        .setDescription('เลือกภาษา TTS เช่น th, en')
        .setRequired(false)
        .addChoices(
          { name: 'ภาษาไทย', value: 'th' },
          { name: 'ภาษาอังกฤษ', value: 'en' }
        )),

  async execute(interaction) {
    const text = interaction.options.getString('text');
    const lang = interaction.options.getString('lang') || 'th';

    const memberVoiceChannel = interaction.member.voice.channel;
    if (!memberVoiceChannel) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ ไม่สามารถใช้คำสั่งได้')
        .setDescription('คุณต้องอยู่ในช่องเสียงก่อนใช้คำสั่งนี้');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const url = googleTTS.getAudioUrl(text, {
        lang,
        slow: false,
        host: 'https://translate.google.com',
      });

      const connection = joinVoiceChannel({
        channelId: memberVoiceChannel.id,
        guildId: memberVoiceChannel.guild.id,
        adapterCreator: memberVoiceChannel.guild.voiceAdapterCreator,
      });

      const resource = createAudioResource(url, { inputType: 'arbitrary' });
      const player = createAudioPlayer();

      let disconnectTimeout;

      player.on(AudioPlayerStatus.Idle, () => {
        disconnectTimeout = setTimeout(() => {
          connection.destroy();
        }, 120000); // 2 นาที
      });

      player.on('playing', () => {
        if (disconnectTimeout) {
          clearTimeout(disconnectTimeout);
        }
      });

      player.on('error', error => {
        console.error(error);
        connection.destroy();
      });

      player.play(resource);
      connection.subscribe(player);

      const embed = new EmbedBuilder()
        .setColor('#3333ff')
        .setTitle('🔊 กำลังพูด')
        .addFields({ name: 'ข้อความ', value: text })
        .setFooter({ text: `ภาษา: ${lang}` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ เกิดข้อผิดพลาดในการสร้างเสียง TTS')
        .setDescription('โปรดลองอีกครั้งภายหลัง');
      await interaction.editReply({ embeds: [embed] });
    }
  }
};
