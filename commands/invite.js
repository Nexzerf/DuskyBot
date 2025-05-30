const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('ส่งลิงก์เชิญบอทไปยังเซิร์ฟเวอร์ของคุณ'),

  async execute(interaction) {
    const inviteEmbed = new EmbedBuilder()
      .setTitle('✨ เชิญ Dusky เข้าร่วมเซิร์ฟเวอร์ของคุณ')
      .setDescription('[คลิกที่นี่เพื่อเชิญบอท](https://discord.com/oauth2/authorize?client_id=1375137565648097342&permissions=8&scope=bot%20applications.commands)')
      .setColor('#3333ff')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({
        text: 'ขอบคุณที่สนใจบอทของเรา',
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    await interaction.reply({ embeds: [inviteEmbed], ephemeral: true });
  },
};
