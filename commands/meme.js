const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('สุ่มมีมฮา ๆ จาก Reddit'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const res = await axios.get('https://meme-api.com/gimme');
      const meme = res.data;

      const embed = new EmbedBuilder()
        .setTitle(meme.title)
        .setURL(meme.postLink)
        .setImage(meme.url)
        .setColor('#ff9900')
        .setFooter({ text: `จาก r/${meme.subreddit}` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ ไม่สามารถโหลดมีมได้ในตอนนี้ ลองใหม่ภายหลังนะ!');
    }
  }
};
