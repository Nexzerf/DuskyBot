const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorEmbed } = require('../utils/embeds');
const { queueEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('แสดงคิวเพลง'),
  
  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    
  
    if (!queue || !queue.songs || queue.songs.length === 0) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} ไม่มีเพลงที่กำกลังเล่นในขณะนี้`)], 
        ephemeral: true 
      });
    }
    
    try {
      await interaction.reply({ 
        embeds: [queueEmbed(queue)]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} เกิดข้อผิดพลาดในการแสดงคิว : ${error.message}`)]
      });
    }
  },
}; 