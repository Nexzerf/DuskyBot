const { EmbedBuilder } = require('discord.js');
const { emojis } = require('../config/emojis');
const util = require('util');


exports.handleDistubeEvents = (client) => {
  const distube = client.distube;
  
 
 // เมื่อเริ่มเล่นเพลง
distube.on('playSong', (queue, song) => {
  const embed = new EmbedBuilder()
    .setColor('#3333FF')
    .setTitle(`${emojis.play} **กำลังเล่นเพลง**`)
    .setDescription(`[${song.name}](${song.url})`)
    .addFields(
      {
        value: `🕒 ${song.formattedDuration} ・ 🙋‍♂️ ${song.user}`,
        inline: true
      }
    )
    .setThumbnail(song.thumbnail)
    .setFooter({ text: `🔈 ความดัง: ${queue.volume}%` });

  queue.textChannel.send({ embeds: [embed] });
});

// เมื่อมีการเพิ่มเพลงเข้าคิว
distube.on('addSong', (queue, song) => {
  const embed = new EmbedBuilder()
    .setColor('#3333FF')
    .setTitle(`➕ **เพิ่มเพลงเข้าคิว**`)
    .setDescription(`[${song.name}](${song.url})`)
    .addFields(
      {
        name: 'ขอเพลงโดย',
        value: `・ 🙋‍♂️ ${song.user}`,
        inline: true
      }
    )
    .setThumbnail(song.thumbnail);

  queue.textChannel.send({ embeds: [embed] });
});

// เมื่อมีการเพิ่มเพลย์ลิสต์
distube.on('addList', (queue, playlist) => {
  const embed = new EmbedBuilder()
    .setColor('#3333FF')
    .setTitle(`${emojis.playlist} **เพิ่มเพลย์ลิสต์เข้าคิว**`)
    .setDescription(`[${playlist.name}](${playlist.url})`)
    .addFields(
      {
        name: 'ข้อมูลเพลย์ลิสต์',
        value: `🎵 ${playlist.songs.length} เพลง ・ 🙋‍♂️ ${playlist.user}`,
        inline: true
      }
    )
    .setThumbnail(playlist.thumbnail);

  queue.textChannel.send({ embeds: [embed] });
});


  
  distube.on('error', (channelOrQueue, error) => {
    console.error(error);

    const safeMessage = typeof error?.message === 'string'
      ? error.message
      : util.inspect(error, { depth: 1 });

   
    const channel = channelOrQueue?.textChannel ?? channelOrQueue;

    if (channel && typeof channel.send === 'function') {
      const embed = new EmbedBuilder()
        .setColor('#99FFFF')
        .setTitle(`${emojis.error} เกิดข้อผิดพลาด`)
        .setDescription(`เกิดข้อผิดพลาดที่: ${safeMessage.slice(0, 1997)}...`);

      channel.send({ embeds: [embed] }).catch(console.error);
    } else {
     
      console.warn('ไม่สามารถส่งข้อความ error ใน channel ได้:', safeMessage);
    }
  });

  distube.on('finish', (queue) => {
    const embed = new EmbedBuilder()
      .setColor('#3333ff')
      .setTitle(`💿 เล่นเพลงในคิวหมดแล้ว`);

    
    queue.textChannel.send({ embeds: [embed] });
  });

 
distube.on('disconnect', (queue) => {
  const embed = new EmbedBuilder()
    .setColor('#3333ff') // แดงนีออน
    .setTitle('🛑 ตัดการเชื่อมต่อแล้ว')
    .setDescription('🚪 บอทได้ออกจากช่องเสียงแล้ว\n**การเชื่อมต่อถูกปิด** 🔒');

  queue.textChannel.send({ embeds: [embed] });
});
  
client.distube
  .on('playSong', (queue, song) => {
    queue.textChannel.send(`🎶 กำลังเล่น: \`${song.name}\` - \`${song.formattedDuration}\``);
  })
  .on('error', (channel, error) => {
    console.error('❌ DisTube Error:', error);
    if (channel) channel.send(`❌ เกิดข้อผิดพลาด: \`${error.message}\``);
  });


  distube.on('empty', (queue) => {
    const embed = new EmbedBuilder()
      .setColor('#3333ff') // เขียวนีออน
      .setTitle('🌌 ช่องว่างเปล่า')
      .setDescription('👻 ไม่มีใครอยู่ในช่องเสียงแล้ว\n**กำลังปลดล็อกการเชื่อมต่อ...**');

    queue.textChannel.send({ embeds: [embed] });
  });
  };
