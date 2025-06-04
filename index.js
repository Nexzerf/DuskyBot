require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(port, () => {
  console.log(`🌐 Server running on port ${port}`);
});

const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const ffmpegStatic = require('ffmpeg-static');
process.env.FFMPEG_PATH = ffmpegStatic;
console.log("✅ FFmpeg Path:", ffmpegStatic);
// ✅ เรียกใช้ DisTube และ plugins
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

// 👉 สร้าง client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 👇 เก็บ Slash Commands
client.commands = new Collection();
const commands = [];

// โหลด Slash Commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[WARNING] คำสั่งที่ ${file} ไม่มี data หรือ execute`);
  }
}

// โหลด Events (พร้อมรองรับ interaction)
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin(),
    new SoundCloudPlugin(),
    new YtDlpPlugin({
      update: true,
      ytdlpOptions: {
        requestOptions: {
          headers: {
            // เพิ่ม cookies จากไฟล์ที่ export มา
            cookie: fs.readFileSync('./cookies.txt', 'utf8'),
          }
        }
      }
    }),
  ]
});


if (process.env.YT_COOKIES) {
  const cookiesPath = path.join(__dirname, 'cookies.txt');
  fs.writeFileSync(cookiesPath, process.env.YT_COOKIES);
  console.log("✅ สร้าง cookies.txt จาก Railway ENV แล้ว");
}
// ✨ โหลด DisTube Event Handler แยก
const { handleDistubeEvents } = require('./utils/distubeEvents');
handleDistubeEvents(client);

// ✅ Deploy คำสั่ง Slash
const deployCommands = async () => {
  try {
    console.log(`🚀 กำลังอัปโหลดคำสั่ง ${commands.length} คำสั่ง...`);
    const rest = new REST().setToken(process.env.TOKEN);
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log(`✅ อัปโหลดคำสั่งสำเร็จ (${data.length} คำสั่ง)`);
  } catch (error) {
    console.error('❌ อัปโหลดคำสั่งล้มเหลว:', error);
  }
};

// ▶️ เริ่มทำงาน
(async () => {
  await deployCommands();
  client.login(process.env.DISCORD_TOKEN);
})();
