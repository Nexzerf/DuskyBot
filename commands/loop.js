const { SlashCommandBuilder } = require('@discordjs/builders');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('ตั้งค่าโหมดการเล่นซ้ำ')
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('การเล่นเพลงซ้ำ')
        .setRequired(true)
        .addChoices(
          { name: 'Off', value: 'off' },
          { name: 'Song', value: 'song' },
          { name: 'Queue', value: 'queue' }
        )),
  
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
    
    const mode = interaction.options.getString('mode');
    let loopMode = 0;
    let modeText = 'Off';
    let modeEmoji = emojis.stop;
    
    switch (mode) {
      case 'off':
        loopMode = 0;
        modeText = 'Off';
        modeEmoji = emojis.stop;
        break;
      case 'song':
        loopMode = 1;
        modeText = 'Song';
        modeEmoji = emojis.repeatOne;
        break;
      case 'queue':
        loopMode = 2;
        modeText = 'Queue';
        modeEmoji = emojis.repeat;
        break;
    }
    
    try {
      queue.setRepeatMode(loopMode);
      await interaction.reply({ 
        embeds: [successEmbed(`${modeEmoji} ตั้งโหมดการเล่นซ้ำเป็น : **${modeText}**`)]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(`${emojis.error} เกิดข้อผิดพลาดในการเล่นเพลงซ้ำ : ${error.message}`)]
      });
    }
  },
}; 