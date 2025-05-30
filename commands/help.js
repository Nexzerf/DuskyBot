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
      .setTimestamp();

    
    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  },
};