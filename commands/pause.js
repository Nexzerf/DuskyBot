const { SlashCommandBuilder } = require('@discordjs/builders');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('หยุดเล่นเพลงชั่วคราว'),
  
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
      if (queue.paused) {
        return interaction.reply({ 
          embeds: [errorEmbed(`${emojis.warning} เพลงถูกหยุดชั่วคราวอยู่แล้ว`)], 
          ephemeral: true 
        });
      }
      
      queue.pause();
      await interaction.reply({ 
        embeds: [successEmbed(`${emojis.pause} หยุดเพลงชั่วคราวแล้ว`)]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} เกิดข้อผิดพลาดในการหยุดเพลงชั่วคราว : ${error.message}`)]
      });
    }
  },
}; 