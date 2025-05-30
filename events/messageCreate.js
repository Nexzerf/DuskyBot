module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const musicChannelName = '🎵-Dusky-Music';

    if (message.channel.name !== musicChannelName) return;

    if (message.content.startsWith('/')) return;

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('❌ คุณต้องอยู่ในห้องเสียงก่อนจึงจะขอเพลงได้');
    }

    try {
      await message.client.distube.play(voiceChannel, message.content, {
        textChannel: message.channel,
        member: message.member,
      });
    } catch (error) {
      console.error(error);
      message.reply('❌ เกิดข้อผิดพลาดในการเล่นเพลง');
    }
  },
};
