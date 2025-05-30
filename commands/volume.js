const { SlashCommandBuilder } = require('@discordjs/builders');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('ปรับความดังเพลง')
    .addIntegerOption(option =>
      option.setName('ระดับความดัง')
        .setDescription('ปรับระดับความดัง (0-100)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(100)),
  
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    
    // Check if user is in a voice channel
    if (!voiceChannel) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} ต้องเข้าร่วมช่องเสียงก่อน`)], 
        ephemeral: true 
      });
    }
    
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    
    // Check if there's a queue
    if (!queue) {
      return interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} There is nothing playing right now!`)], 
        ephemeral: true 
      });
    }
    
    const volumePercentage = interaction.options.getInteger('percentage');
    
    try {
      queue.setVolume(volumePercentage);
      
     
      let volumeEmoji = emojis.volume;
      if (volumePercentage === 0) {
        volumeEmoji = emojis.mute;
      } else if (volumePercentage < 50) {
        volumeEmoji = emojis.volume;
      }
      
      await interaction.reply({ 
        embeds: [successEmbed(`${volumeEmoji} ปรับความดังเป็น: **${volumePercentage}%**`)]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} เกิดข้อผิดพลาดในการปรับความดัง: ${error.message}`)]
      });
    }
  },
}; 