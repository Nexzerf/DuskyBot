const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('แสดงเพลงที่กำลังเล่นในปัจจุบัน'),
  
  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    
    if (!queue || !queue.songs || queue.songs.length === 0) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} ไม่มีเพลงที่กำลังเล่นในขณะนี้`)], 
        ephemeral: true 
      });
    }
    
    try {
      const song = queue.songs[0];
      const currentTime = queue.currentTime;
      const duration = song.duration;
      const progress = createProgressBar(currentTime, duration);
      
      const embed = new EmbedBuilder()
        .setColor('#99FFFF')
        .setTitle(`${emojis.play} กำลังเล่นเพลง`)
        .setDescription(`[${song.name}](${song.url})`)
        .addFields(
          { name: 'ระยะเวลา', value: `\`${formatTime(currentTime)} / ${song.formattedDuration}\``, inline: true },
          { name: 'ขอโดย', value: `${song.user}`, inline: true },
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `ความดัง: ${queue.volume}%` });
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} เกิดข้อผิดพลาดในการเล่นเพลง : ${error.message}`)]
      });
    }
  },
};


function createProgressBar(currentTime, duration) {
  const progressBarLength = 15;
  const percentage = Math.round((currentTime / duration) * 100);
  const progress = Math.round((currentTime / duration) * progressBarLength);
  
  let progressBar = '';
  
  for (let i = 0; i < progressBarLength; i++) {
    if (i < progress) {
      progressBar += '▰'; 
    } else {
      progressBar += '▱'; 
    }
  }
  
  return `${emojis.time} \`${progressBar}\` ${percentage}%`;
}


function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
} 