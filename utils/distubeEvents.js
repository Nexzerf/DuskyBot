const { EmbedBuilder } = require('discord.js');
const { emojis } = require('../config/emojis');
const util = require('util');

exports.handleDistubeEvents = (client) => {
  const distube = client.distube;

  // 🔁 ฟังก์ชันช่วยตรวจสอบว่า channel ส่งข้อความได้ไหม
  function isSendable(channel) {
    return channel && typeof channel.send === 'function';
  }

  // 🎵 เมื่อเริ่มเล่นเพลง
  distube.on('playSong', (queue, song) => {
    if (!isSendable(queue.textChannel)) return;

    const embed = new EmbedBuilder()
      .setColor('#3333FF')
      .setTitle(`${emojis.play} **กำลังเล่นเพลง**`)
      .setDescription(`[${song.name}](${song.url})`)
      .addFields({
        value: `🕒 ${song.formattedDuration} ・ 🙋‍♂️ ${song.user}`,
        inline: true
      })
      .setThumbnail(song.thumbnail)
      .setFooter({ text: `🔈 ความดัง: ${queue.volume}%` });

    queue.textChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // ➕ เมื่อเพิ่มเพลงเข้าคิว
  distube.on('addSong', (queue, song) => {
    if (!isSendable(queue.textChannel)) return;

    const embed = new EmbedBuilder()
      .setColor('#3333FF')
      .setTitle(`➕ **เพิ่มเพลงเข้าคิว**`)
      .setDescription(`[${song.name}](${song.url})`)
      .addFields({
        name: 'ขอเพลงโดย',
        value: `・ 🙋‍♂️ ${song.user}`,
        inline: true
      })
      .setThumbnail(song.thumbnail);

    queue.textChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // 📃 เมื่อเพิ่มเพลย์ลิสต์เข้าคิว
  distube.on('addList', (queue, playlist) => {
    if (!isSendable(queue.textChannel)) return;

    const embed = new EmbedBuilder()
      .setColor('#3333FF')
      .setTitle(`${emojis.playlist} **เพิ่มเพลย์ลิสต์เข้าคิว**`)
      .setDescription(`[${playlist.name}](${playlist.url})`)
      .addFields({
        name: 'ข้อมูลเพลย์ลิสต์',
        value: `🎵 ${playlist.songs.length} เพลง ・ 🙋‍♂️ ${playlist.user}`,
        inline: true
      })
      .setThumbnail(playlist.thumbnail);

    queue.textChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // ❌ เมื่อเกิดข้อผิดพลาด
  distube.on('error', (channelOrQueue, error) => {
    console.error(error);

    const safeMessage = typeof error?.message === 'string'
      ? error.message
      : util.inspect(error, { depth: 1 });

    const channel = channelOrQueue?.textChannel ?? channelOrQueue;

    if (isSendable(channel)) {
      const embed = new EmbedBuilder()
        .setColor('#FF6666')
        .setTitle(`${emojis.error} เกิดข้อผิดพลาด`)
        .setDescription(`🚨 ${safeMessage.slice(0, 1997)}...`);

      channel.send({ embeds: [embed] }).catch(console.error);
    } else {
      console.warn('⚠️ ไม่สามารถส่งข้อความใน channel นี้ได้:', { embeds: [safeMessage] });
    }
  });

  // 📦 เมื่อเล่นเพลงในคิวหมดแล้ว
  distube.on('finish', (queue) => {
    if (!isSendable(queue.textChannel)) return;

    const embed = new EmbedBuilder()
      .setColor('#3333ff')
      .setTitle(`💿 เล่นเพลงในคิวหมดแล้ว`);

    queue.textChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // 🛑 เมื่อบอทตัดการเชื่อมต่อ
  distube.on('disconnect', (queue) => {
    if (!isSendable(queue.textChannel)) return;

    const embed = new EmbedBuilder()
      .setColor('#3333ff')
      .setTitle('🛑 ตัดการเชื่อมต่อแล้ว')
      .setDescription('🚪 บอทได้ออกจากช่องเสียงแล้ว\n**การเชื่อมต่อถูกปิด** 🔒');

    queue.textChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // 👻 เมื่อช่องเสียงว่าง
  distube.on('empty', (queue) => {
    if (!isSendable(queue.textChannel)) return;

    const embed = new EmbedBuilder()
      .setColor('#3333ff')
      .setTitle('🌌 ช่องว่างเปล่า')
      .setDescription('👻 ไม่มีใครอยู่ในช่องเสียงแล้ว\n**กำลังปลดล็อกการเชื่อมต่อ...**');

    queue.textChannel.send({ embeds: [embed] }).catch(console.error);
  });
};
