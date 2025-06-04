const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { emojis } = require('../config/emojis');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('แสดงคำสั่ง'),
  async execute(interaction) {
    const helpMenu = new StringSelectMenuBuilder()
    .setCustomId('help-menu')
    .setPlaceholder('เลือกหมวดหมู่คำสั่ง...')
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel('🎓 การเรียน / ข้อสอบ')
        .setValue('study')
        .setDescription('ฟีเจอร์เกี่ยวกับการเรียน การทำงาน ข้อสอบ'),
      new StringSelectMenuOptionBuilder()
        .setLabel('🌠 โชคลาภ / สุ่มดวง')
        .setValue('luck')
        .setDescription('คำสั่งเกี่ยวกับดวงชะตา โชคลาถ และสุ่มดวง'),
      new StringSelectMenuOptionBuilder()
        .setLabel('🔊 เพลง / เสียง')
        .setValue('music')
        .setDescription('คำสั่งควบคุมเพลงและเสียง'),
      new StringSelectMenuOptionBuilder()
        .setLabel('📄 เอกสาร / ราชการ')
        .setValue('doc')
        .setDescription('บริการทางราชการ เช่น ฟอร์ม เช็กบิล'),
      new StringSelectMenuOptionBuilder()
        .setLabel('👤 ผู้ใช้ / โปรไฟล์')
        .setValue('profile')
        .setDescription('จัดการข้อมูลผู้ใช้และบอท'),
      new StringSelectMenuOptionBuilder()
        .setLabel('😂 สนุก / สุ่ม')
        .setValue('fun')
        .setDescription('กิจกรรมเบาสมอง ลูกเล่น และเกม'),
      new StringSelectMenuOptionBuilder()
        .setLabel('⚙️ จัดการบอท')
        .setValue('admin')
        .setDescription('คำสั่งดูแลและควบคุมบอท')
    );


    const row = new ActionRowBuilder().addComponents(helpMenu);

    const embed = new EmbedBuilder()
      .setTitle(`🔎 เมนูช่วยเหลือ`)
      .setDescription('เลือกหมวดหมู่จากเมนูด้านล่างเพื่อดูคำสั่งต่าง ๆ')
      .setColor('#3333FF')
      .setThumbnail('https://cdn.discordapp.com/attachments/1239134501934993511/1379774517416693841/helpbanner.png?ex=684176a7&is=68402527&hm=5848cc87175e0b5397124830e9e52cb81f93b9c5c43955e776b3cbaef7fab557&')
      .setTimestamp();

    
    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  },
};
