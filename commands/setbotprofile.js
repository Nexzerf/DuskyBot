      const { SlashCommandBuilder } = require('discord.js');

      module.exports = {
        data: new SlashCommandBuilder()
          .setName('setbotprofile')
          .setDescription('เปลี่ยนชื่อเล่นและรูปโปรไฟล์ของบอทในเซิร์ฟเวอร์นี้')
          .addStringOption(option =>
            option.setName('nickname')
              .setDescription('ชื่อเล่นใหม่ของบอท')
              .setRequired(false))
          .addAttachmentOption(option =>
            option.setName('avatar')
              .setDescription('รูปโปรไฟล์ใหม่ของบอท (ไฟล์แนบ)')
              .setRequired(false))
          .setDefaultMemberPermissions(0), // ให้เฉพาะแอดมินใช้

        async execute(interaction) {
          const nickname = interaction.options.getString('nickname');
          const avatarAttachment = interaction.options.getAttachment('avatar');

          const botMember = interaction.guild.members.me;

          try {
            const options = {};

            if (nickname) options.nick = nickname;
            if (avatarAttachment) options.avatar = avatarAttachment.url;

            await botMember.edit(options);

            let response = '✅ เปลี่ยนโปรไฟล์บอทเรียบร้อยแล้ว\n';
            if (nickname) response += `📝 ชื่อเล่น: ${nickname}\n`;
            if (avatarAttachment) response += `🖼️ รูปใหม่: [ดูรูป](${avatarAttachment.url})`;

            await interaction.reply({ content: response, ephemeral: true });
          } catch (error) {
            console.error(error);
            await interaction.reply({
              content: '❌ เกิดข้อผิดพลาดในการเปลี่ยนโปรไฟล์บอท',
              ephemeral: true
            });
          }
        }
      };
