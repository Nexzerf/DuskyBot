const { SlashCommandBuilder } = require('@discordjs/builders');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('สลับเพลงในคิว'),
  
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
    
    
    if (queue.songs.length < 3) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} ต้องมีเพลงอย่างน้อย 3 เพลงในคิวเพื่อสลับเพลง`)], 
        ephemeral: true 
      });
    }
    
    try {
      queue.shuffle();
      await interaction.reply({ 
        embeds: [successEmbed(`${emojis.shuffle} เพลงในคิวถูกสลับเรียบร้อยแล้ว`)]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} เกิดข้อผิดพลาดในการสลับคิวเพลง : ${error.message}`)]
      });
    }
  },
}; 