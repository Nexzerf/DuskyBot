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
      .setImage('https://cdn.discordapp.com/attachments/1239134501934993511/1379819056068296815/1.png?ex=6841a022&is=68404ea2&hm=bb650f877e207d4fc52dd989790914dfa2322dcb8fb05b607637c5b9ee0084a0&')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({
        text: 'ขอบคุณที่สนใจบอทของเรา',
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    await interaction.reply({ embeds: [inviteEmbed], ephemeral: true });
  },
};
