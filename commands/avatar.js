const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('ดูรูปโปรไฟล์ของผู้ใช้')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('เลือกผู้ใช้')
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const avatarEmbed = new EmbedBuilder()
      .setTitle(`🖼️ Avatar ของ ${user.username}`)
      .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setColor('#3333ff')
      .setFooter({ text: `ขอโดย ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setURL(user.displayAvatarURL({ size: 1024, dynamic: true }));

    await interaction.reply({ embeds: [avatarEmbed] });
  }
};
