const { SlashCommandBuilder } = require('@discordjs/builders');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('หยุดเพลงที่กำลังเล่นอยู่และล้างคิวเพลง'),
  
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    
    
    if (!voiceChannel) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} คุณต้องเข้าร่วมช่องเสียงก่อน`)], 
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
      await queue.stop();
      await interaction.reply({ 
        embeds: [successEmbed(`${emojis.stop} หยุดเล่นเพลงและล้างคิวเพลงเรียบร้อยแล้ว`)]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} เกิดข้อผิดพลาดในการหยุดเพลง: ${error.message}`)]
      });
    }
  },
}; 