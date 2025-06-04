const { EmbedBuilder } = require('discord.js');
const { emojis } = require('../config/emojis');
const util = require('util');

exports.handleDistubeEvents = (client) => {
  const distube = client.distube;

  const safeSend = (channel, payload) => {
    if (channel && typeof channel.send === 'function') {
      channel.send(payload).catch(console.error);
    } else {
      console.warn('⚠️ ไม่สามารถส่งข้อความใน channel นี้ได้:', payload);
    }
  };

  distube.on('playSong', (queue, song) => {
    const embed = new EmbedBuilder()
      .setColor('#3333FF')
      .setTitle(`${emojis.play} **กำลังเล่นเพลง**`)
      .setDescription(`[${song.name}](${song.url})`)
      .addFields({
        value: `🕒 ${song.formattedDuration} ・ 🙋‍♂️ ${song.user}`,
        inline: true,
      })
      .setThumbnail(song.thumbnail)
      .setFooter({ text: `🔈 ความดัง: ${queue.volume}%` });

    safeSend(queue.textChannel, { embeds: [embed] });
  });

  distube.on('addSong', (queue, song) => {
    const embed = new EmbedBuilder()
      .setColor('#3333FF')
      .setTitle(`➕ **เพิ่มเพลงเข้าคิว**`)
      .setDescription(`[${song.name}](${song.url})`)
      .addFields({
        name: 'ขอเพลงโดย',
        value: `・ 🙋‍♂️ ${song.user}`,
        inline: true,
      })
      .setThumbnail(song.thumbnail);

    safeSend(queue.textChannel, { embeds: [embed] });
  });

  distube.on('addList', (queue, playlist) => {
    const embed = new EmbedBuilder()
      .setColor('#3333FF')
      .setTitle(`${emojis.playlist} **เพิ่มเพลย์ลิสต์เข้าคิว**`)
      .setDescription(`[${playlist.name}](${playlist.url})`)
      .addFields({
        name: 'ข้อมูลเพลย์ลิสต์',
        value: `🎵 ${playlist.songs.length} เพลง ・ 🙋‍♂️ ${playlist.user}`,
        inline: true,
      })
      .setThumbnail(playlist.thumbnail);

    safeSend(queue.textChannel, { embeds: [embed] });
  });

  distube.on('error', (channelOrQueue, error) => {
    console.error(error);
    const safeMessage = typeof error?.message === 'string'
      ? error.message
      : util.inspect(error, { depth: 1 });

    const channel = channelOrQueue?.textChannel ?? channelOrQueue;

    const embed = new EmbedBuilder()
      .setColor('#FF5555')
      .setTitle(`${emojis.error || '❌'} เกิดข้อผิดพลาด`)
      .setDescription(`\`\`\`\n${safeMessage.slice(0, 1997)}\n\`\`\``);

    safeSend(channel, { embeds: [embed] });
  });

  distube.on('finish', (queue) => {
    const embed = new EmbedBuilder()
      .setColor('#3333ff')
      .setTitle(`💿 เล่นเพลงในคิวหมดแล้ว`);

    safeSend(queue.textChannel, { embeds: [embed] });
  });

  distube.on('disconnect', (queue) => {
    const embed = new EmbedBuilder()
      .setColor('#3333ff')
      .setTitle('🛑 ตัดการเชื่อมต่อแล้ว')
      .setDescription('🚪 บอทได้ออกจากช่องเสียงแล้ว\n**การเชื่อมต่อถูกปิด** 🔒');

    safeSend(queue.textChannel, { embeds: [embed] });
  });

  distube.on('empty', (queue) => {
    const embed = new EmbedBuilder()
      .setColor('#3333ff')
      .setTitle('🌌 ช่องว่างเปล่า')
      .setDescription('👻 ไม่มีใครอยู่ในช่องเสียงแล้ว\n**กำลังปลดล็อกการเชื่อมต่อ...**');

    safeSend(queue.textChannel, { embeds: [embed] });
  });
};
