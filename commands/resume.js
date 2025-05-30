const { SlashCommandBuilder } = require('@discordjs/builders');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('เล่นเพลงปัจจุบันต่อ'),
  
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
        embeds: [errorEmbed(`${emojis.error} ไม่มีเพลงที่กำลังเล่นในขณะนี้`)], 
        ephemeral: true 
      });
    }
    
    try {
      if (!queue.paused) {
        return interaction.reply({ 
          embeds: [errorEmbed(`${emojis.warning} เพลงกำลังเล่นอยู่แล้ว`)], 
          ephemeral: true 
        });
      }
      
      queue.resume();
      await interaction.reply({ 
        embeds: [successEmbed(`${emojis.play} เล่นเพลงต่อจากที่หยุดไว้`)]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} เกิดข้อผิดพลาดในการเล่นเพลงต่อ : ${error.message}`)]
      });
    }
  },
}; 