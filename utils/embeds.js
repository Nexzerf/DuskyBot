const { EmbedBuilder } = require('discord.js');
const { emojis } = require('../config/emojis');

exports.createEmbed = (options) => {
  const { 
    title, 
    description, 
    color = '#3333ff', 
    thumbnail = null, 
    fields = [], 
    footer = null,
    timestamp = true
  } = options;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title);

  if (description) embed.setDescription(description);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (fields.length > 0) embed.addFields(...fields);
  if (footer) embed.setFooter(footer);
  if (timestamp) embed.setTimestamp();

  return embed;
};

exports.errorEmbed = (message) => {
  return exports.createEmbed({
    title: `${emojis.error} เกิดข้อผิดพลาด`,
    description: message,
    color: '#FF0000'
  });
};

exports.successEmbed = (message) => {
  return exports.createEmbed({
    title: `${emojis.success} สำเร็จ`,
    description: message,
    color: '#3333ff'
  });
};

exports.infoEmbed = (message) => {
  return exports.createEmbed({
    title: `${emojis.info} Dusky`,
    description: message,
    color: '#3333ff'
  });
};

exports.warningEmbed = (message) => {
  return exports.createEmbed({
    title: `${emojis.warning} Dusky`,
    description: message,
    color: '#3333ff'
  });
};

exports.queueEmbed = (queue) => {
  const songs = queue.songs;
  const currentSong = songs[0];

  let queueString = '';
  const displayedSongs = songs.slice(1, 11); 

  if (displayedSongs.length === 0) {
    queueString = 'ไม่มีเพลงในคิว';
  } else {
    queueString = displayedSongs.map((song, index) => 
      `**${index + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\` - ขอโดย: ${song.user}`
    ).join('\n');

    if (songs.length > 11) {
      queueString += `\n\n*...และเพลง ${songs.length - 11} *`;
    }
  }

  return exports.createEmbed({
    title: `${emojis.queue} คิวเพลง`,
    description: `**กำลังเล่นเพลง :**\n[${currentSong.name}](${currentSong.url}) - \`${currentSong.formattedDuration}\` - ขอโดย: ${currentSong.user}\n\n**เพลงต่อไป :**\n${queueString}`,
    color: '#3333ff',
    fields: [
      { name: 'เพลงทั้งหมด', value: `${songs.length}`, inline: true },
      { name: 'ระยะเวลาทั้งหมด', value: `${queue.formattedDuration}`, inline: true },
      { name: 'ความดัง', value: `${queue.volume}%`, inline: true }
    ],
    footer: { text: `การเล่นซ้ำ: ${queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Song') : 'Off'} | เล่นเพลงอัตโนมัติ: ${queue.autoplay ? 'On' : 'Off'}` }
  });
};
