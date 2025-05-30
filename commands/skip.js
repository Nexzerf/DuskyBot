const { SlashCommandBuilder } = require('@discordjs/builders');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('ข้ามเพลงปัจจุบัน'),
  
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    
    
    if (!voiceChannel) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} ต้องเข้าร่วมช่องเสียงก่อน`)], 
        ephemeral: true 
      });
    }
    
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    
    
    if (!queue) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} ไม่มีเพลงทีกำลังเล่นในขณะนี้`)], 
        ephemeral: true 
      });
    }
    
    try {
      const song = queue.songs[0];
      await queue.skip();
      await interaction.reply({ 
        embeds: [successEmbed(`${emojis.skip} ข้ามเพลง: \`${song.name}\``)]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} เกิดข้อผิดพลาดในการข้ามเพลง: ${error.message}`)]
      });
    }
  },
}; 