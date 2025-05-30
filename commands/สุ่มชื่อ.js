const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('สุ่มชื่อ')
    .setDescription('สุ่มชื่อจากสมาชิกในห้อง หรือจากรายชื่อที่คุณกำหนดเอง')
    .addStringOption(option =>
      option.setName('รายชื่อ')
        .setDescription('กรอกรายชื่อคั่นด้วยเครื่องหมายจุลภาค เช่น: เอ,บี,ซี')
        .setRequired(false)
    ),

  async execute(interaction) {
    const input = interaction.options.getString('รายชื่อ');

    let chosen;
    let sourceText;

    if (input) {
      const names = input.split(',').map(name => name.trim()).filter(n => n);
      if (names.length === 0) {
        return await interaction.reply('⚠️ ไม่พบรายชื่อที่สามารถสุ่มได้');
      }
      chosen = names[Math.floor(Math.random() * names.length)];
      sourceText = `จากรายชื่อที่คุณกำหนดเอง`;
    } else {
      const members = await interaction.guild.members.fetch();
      const onlineMembers = members
        .filter(m => !m.user.bot && m.presence && m.presence.status !== 'offline')
        .map(m => m.displayName);

      if (onlineMembers.length === 0) {
        return await interaction.reply('⚠️ ไม่พบสมาชิกที่ออนไลน์ให้สุ่มได้');
      }

      chosen = onlineMembers[Math.floor(Math.random() * onlineMembers.length)];
      sourceText = `จากสมาชิกในห้องที่ออนไลน์`;
    }

    const embed = new EmbedBuilder()
      .setTitle('📛 ชื่อที่ถูกสุ่มได้คือ...')
      .setColor('#3333ff')
      .setDescription(`🎉 **${chosen}**`)
      .setFooter({ text: sourceText });

    await interaction.reply({ embeds: [embed] });
  }
};
