const { Events, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { emojis } = require('../config/emojis');

function getRandomNumber(digits) {
  let min = Math.pow(10, digits - 1);
  let max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const helplineData = {
  'สุขภาพจิต': { number: '1323', detail: 'สายด่วนสุขภาพจิต กรมสุขภาพจิต' },
  'กฎหมายแรงงาน': { number: '1506', detail: 'สายด่วนกฎหมายแรงงาน กรมสวัสดิการและคุ้มครองแรงงาน' },
  'ผู้หญิงถูกทำร้าย': { number: '1300', detail: 'สายด่วนช่วยเหลือผู้หญิง สำนักงานตำรวจแห่งชาติ' },
  'วัยรุ่นมีปัญหา': { number: '1387', detail: 'สายด่วนวัยรุ่น สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ' },
  'สายด่วนทั่วไป': { number: '1111', detail: 'สายด่วนบริการประชาชน สำนักงานตำรวจแห่งชาติ' },
  'ตำรวจ': { number: '191', detail: 'สายด่วนตำรวจ' },
  'ดับเพลิง': { number: '199', detail: 'สายด่วนดับเพลิง' },
  'อุบัติเหตุ-ฉุกเฉิน': { number: '1669', detail: 'สายด่วนกู้ชีพ-กู้ภัย' },
  'ไฟไหม้': { number: '199', detail: 'สายด่วนดับเพลิง' },
  'เด็กและสตรี': { number: '1300', detail: 'สายด่วนช่วยเหลือเด็กและสตรี' },
  'คนพิการ': { number: '1300', detail: 'สายด่วนช่วยเหลือคนพิการ' },
  'สิทธิคนพิการ': { number: '1506', detail: 'สายด่วนสิทธิคนพิการ กรมส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ' },
  'สิทธิคนจน': { number: '1111', detail: 'สายด่วนช่วยเหลือประชาชนทั่วไป' },
  'ยาเสพติด': { number: '1165', detail: 'สายด่วนปรึกษาและบำบัดยาเสพติด' },
  'ผู้สูงอายุ': { number: '1300', detail: 'สายด่วนช่วยเหลือผู้สูงอายุ' },
  'การศึกษา': { number: '15439', detail: 'สายด่วนกระทรวงศึกษาธิการ' },
  'ช่วยเหลือเด็ก': { number: '1300', detail: 'สายด่วนช่วยเหลือเด็กและเยาวชน' },
  'โรคติดต่อ': { number: '1422', detail: 'สายด่วนกระทรวงสาธารณสุข' },
  'ติดต่อประกันสังคม': { number: '1506', detail: 'สายด่วนประกันสังคม' },
  'ผู้ป่วยจิตเวช': { number: '1323', detail: 'สายด่วนสุขภาพจิต' },
  'ครอบครัว': { number: '1300', detail: 'สายด่วนช่วยเหลือครอบครัว' },
  'ช่วยเหลือเด็กและเยาวชน': { number: '1300', detail: 'สายด่วนช่วยเหลือเด็กและเยาวชน' },
  'ค้ามนุษย์': { number: '1171', detail: 'สายด่วนป้องกันและปราบปรามการค้ามนุษย์' },
  'แจ้งเหตุร้าย': { number: '191', detail: 'สายด่วนตำรวจ' },
  'ภัยพิบัติ': { number: '1784', detail: 'สายด่วนเตือนภัยภัยพิบัติ' },
  'แผ่นดินไหว': { number: '1784', detail: 'สายด่วนเตือนภัยแผ่นดินไหว' },
  'น้ำท่วม': { number: '1784', detail: 'สายด่วนเตือนภัยน้ำท่วม' },
  'ไฟป่า': { number: '1784', detail: 'สายด่วนเตือนภัยไฟป่า' },
  'โทรแจ้งเหตุฉุกเฉิน': { number: '1669', detail: 'สายด่วนกู้ชีพ-กู้ภัย' }
};

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // 🎯 จัดการเมนู help
    if (interaction.isStringSelectMenu() && interaction.customId === 'help-menu') {
      let embed;

      switch (interaction.values[0]) {
         case 'study': // 🎓 การเรียน / ข้อสอบ
            embed = new EmbedBuilder()
              .setTitle('🎓 การเรียน / ข้อสอบ')
              .setColor('#3333ff')
              .setDescription([
                '`⏰ /worktime` - ตั้งเวลาอ่านหนังสือแบบ Pomodoro',
                '`📐 /cert` - ค้นหากิจกรรมประเภทต่าง ๆ เก็บเกียรติบัตร',
                '`📖 /ข้อสอบ` - ดาวน์โหลดข้อสอบเก่า O-NET, TGAT, TPAT, A-Level',
                '`📏 /wordcount` - นับจำนวนคำในข้อความ',
                '`📊 /grade` - เช็คเกรดหรือคะแนน',
                '`💹 /calc` - เครื่องคิดเลขคำนวณเลข',
                '`🌐 /translate` - แปลภาษา',
                '`📻 /speak` - พูดข้อความด้วยเสียงบอท',
                '`🔬 /morse` - แปลงข้อความเป็นรหัสมอร์ส',
              ].join('\n'));
            break;

          case 'music': // 🔊 เพลง / เสียง
            embed = new EmbedBuilder()
              .setTitle('🔊 เพลง / เสียง')
              .setColor('#3333ff')
              .setDescription([
                '`🎼 /play` - เล่นเพลง',
                '`⏸ /pause` - หยุดชั่วคราว',
                '`⏯ /resume` - เล่นต่อ',
                '`⏭ /skip` - ข้ามเพลง',
                '`⏹ /stop` - หยุดเพลง',
                '`🎶 /queue` - ดูคิวเพลง',
                '`🎵 /nowplaying` - เพลงที่กำลังเล่น',
                '`🔀 /shuffle` - สุ่มคิวเพลง',
                '`🔁 /loop` - เล่นซ้ำ',
                '`🔊 /volume` - ปรับระดับเสียง',
              ].join('\n'));
            break;

          case 'doc': // 📄 เอกสาร / ราชการ
            embed = new EmbedBuilder()
              .setTitle('📄 เอกสาร / ราชการ')
              .setColor('#3333ff')
              .setDescription([
                '`📋 /form` - แบบฟอร์มราชการ',
                '`📇 /billcheck` - เช็คบิลน้ำ ไฟ เน็ต',
                '`🪙 /gold` - ราคาทองคำปัจจุบัน',
                '`☎ /helpline` - เบอร์สายด่วนช่วยเหลือ',
                '`💨 /airquality` - ตรวจสอบคุณภาพอากาศ',
              ].join('\n'));
            break;

          case 'profile': // 👤 ผู้ใช้ / โปรไฟล์
            embed = new EmbedBuilder()
              .setTitle('👤 ผู้ใช้ / โปรไฟล์')
              .setColor('#3333ff')
              .setDescription([
                '`👤 /userinfo` - ข้อมูลผู้ใช้',
                '`🖼 /avatar` - ดูรูปโปรไฟล์',
              ].join('\n'));
            break;

          case 'fun': // 😂 สนุก / สุ่ม
            embed = new EmbedBuilder()
              .setTitle('😂 สนุก / สุ่ม')
              .setColor('#3333ff')
              .setDescription([
                '`🧩 /meme` - ส่งมีมฮาๆ',
                '`🎲 /สุ่มชื่อ` - สุ่มชื่อคนในเซิร์ฟเวอร์',
                '`🧊 /สุ่มหัวข้อคุย` - สุ่มหัวข้อการคุย',
                '`🎉 /อวยพรวันเกิด` - ส่งคำอวยพรวันเกิด',
                '`🎮 /activity` - เล่นกิจกรรมในเซิร์ฟเวอร์',  
                '`👾 /tictactoe` - เล่นเกม XO',
                '`😀 /moodcheckin` - เช็กอารมณ์วันนี้',
              ].join('\n'));
            break;
          
          case 'luck': // 😂 สนุก / สุ่ม
          embed = new EmbedBuilder()
            .setTitle('🌠 สุ่มดวง')
            .setColor('#3333ff')
            .setDescription([
              '`💞 /tarotlover` - ดูดวงเรื่องความรัก',
              '`☘️ /tarotluck` - ดูดวงเรื่องโชคลาภ',
              '`💌 /tarotfamily` - ดูดวงเรื่องครอบครัว',
              '`🫧 /tarothealth` - ดูดวงเรื่องสุขภาพ',
              '`💼 /tarotwork` - ดูดวงเรื่องหน้าที่การงาน',
              '`📚 /tarotstudy` - ดูดวงเรื่องการเรียน',  
              '`🎐 /lottoguess` - ขอเลขหวย',
              '`📿 /amulet` - แนะนำพระเครื่องและเครื่องราง',
              '`📞 /bermongkol` - สีมงคลตามวันเกิด',
              '`🧿 /birthstone` - หินประจำวันเกิด',
              '`🧧 /siemsee` - สุ่มเซียมซี',
            ].join('\n'));
          break;

          case 'admin': // ⚙️ จัดการบอท
            embed = new EmbedBuilder()
              .setTitle('⚙️ จัดการบอท')
              .setColor('#3333ff')
              .setDescription([
                '`📘 /help` - เมนูช่วยเหลือ',
                '`⛔ /ban` - แบนสมาชิก',
                '`💢 /kick` - เตะสมาชิกออก',
                '`📥 /createinvite` - สร้างลิงก์เชิญบอท',
                '`➕ /invite` - เชิญบอท',
                '`🔩 /setbotprofile` - ตั้งค่าชื่อ/โพรไฟล์บอท',
              ].join('\n'));
            break;

          default:
            embed = new EmbedBuilder()
              .setTitle('❓ ไม่พบหมวดหมู่นี้')
              .setDescription('โปรดลองเลือกหมวดหมู่อื่น')
              .setColor('#FF0000');
            break;
        }

      return await interaction.update({
        embeds: [embed],
        components: interaction.message.components
      });
    }

    // 🎯 จัดการเมนูขอเลขหวย
    if (interaction.isStringSelectMenu() && interaction.customId === 'lotto-type-select') {
      const selected = interaction.values[0];
      let result = '';

      switch (selected) {
        case 'two':
          result = getRandomNumber(2).toString().padStart(2, '0');
          break;
        case 'three':
          result = getRandomNumber(3).toString();
          break;
        case 'six':
          result = getRandomNumber(6).toString().padStart(6, '0');
          break;
        case 'up':
          const up3 = getRandomNumber(3).toString();
          const up2 = getRandomNumber(2).toString().padStart(2, '0');
          result = `3 ตัวบน: ${up3}\n2 ตัวบน: ${up2}`;
          break;
        case 'down':
          result = getRandomNumber(2).toString().padStart(2, '0');
          break;
        default:
          result = 'ไม่พบประเภทหวยที่เลือก';
          break;
      }

      const embed = new EmbedBuilder()
        .setTitle('🎲 เลขหวยของคุณ')
        .setColor('#3333ff')
        .setDescription(result)
        .setTimestamp();

      return await interaction.update({
        embeds: [embed],
        components: []
      });
    }

    // 🎯 เมนูเลือกสายด่วน
    if (interaction.isStringSelectMenu() && interaction.customId === 'helpline-category-select') {
      const key = interaction.values[0];
      const info = helplineData[key];

      if (!info) {
        return interaction.reply({
          content: `❌ ไม่พบสายด่วนที่เลือก`,
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(`📞 สายด่วน: ${key}`)
        .setColor('#3333ff')
        .addFields(
          { name: 'เบอร์โทรศัพท์', value: info.number },
          { name: 'รายละเอียด', value: info.detail }
        )
        .setTimestamp();

      return await interaction.update({
        embeds: [embed],
        components: []
      });
    }
  
    // 🎯 จัดการปุ่ม Pomodoro Timer
    if (interaction.isButton()) {
      const user = interaction.user;

      if (interaction.customId === 'stop_timer') {
        await interaction.reply({
          content: `🛑 <@${user.id}> ได้หยุดการจับเวลาแล้ว`,
          ephemeral: false
        });
        return;
      }

      if (interaction.customId === 'reset_timer') {
        await interaction.reply({
          content: `🔄 <@${user.id}> ได้เริ่มใหม่อีกครั้ง โปรดตั้งเวลาใหม่โดยใช้คำสั่ง \`/worktime\``,
          ephemeral: false
        });
        return;
      }
    }


    // 🎯 รองรับ Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.error(`❌ ไม่พบคำสั่ง ${interaction.commandName}`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`❌ Error executing ${interaction.commandName}`, error);
        const errorEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('เกิดข้อผิดพลาด')
          .setDescription('ไม่สามารถดำเนินการคำสั่งได้');

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        } else {
          await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
      }
    }
  },
};
