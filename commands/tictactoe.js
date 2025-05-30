const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('เริ่มเกม XO กับเพื่อน'),

  async execute(interaction) {
    const symbols = ['❌', '⭕'];
    let currentPlayer = 0;
    let board = Array(9).fill(null);

    const makeBoard = () => {
      const rows = [];
      for (let i = 0; i < 3; i++) {
        const row = new ActionRowBuilder();
        for (let j = 0; j < 3; j++) {
          const index = i * 3 + j;
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(index.toString())
              .setLabel(board[index] ?? '⬜')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(!!board[index])
          );
        }
        rows.push(row);
      }
      return rows;
    };

    const message = await interaction.reply({
      content: `🎮 เกมเริ่มแล้ว! ตอนนี้คือรอบของ ${interaction.user.username} (${symbols[currentPlayer]})`,
      components: makeBoard(),
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 5 * 60 * 1000, // 5 นาที
    });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: '❌ เกมนี้ไม่ใช่ของคุณ!', ephemeral: true });
      }

      const index = parseInt(i.customId);
      if (board[index]) return;

      board[index] = symbols[currentPlayer];

      // เช็กว่ามีใครชนะหรือยัง
      const winCombos = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // cols
        [0,4,8],[2,4,6]          // diagonals
      ];

      let winner = null;
      for (const combo of winCombos) {
        const [a,b,c] = combo;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
          winner = board[a];
          break;
        }
      }

      if (winner) {
        collector.stop('win');
        return i.update({
          content: `🏆 ผู้ชนะคือ ${interaction.user.username} (${symbols[currentPlayer]})`,
          components: makeBoard()
        });
      }

      if (!board.includes(null)) {
        collector.stop('draw');
        return i.update({
          content: '🤝 เกมเสมอ!',
          components: makeBoard()
        });
      }

      // เปลี่ยนผู้เล่น
      currentPlayer = 1 - currentPlayer;
      await i.update({
        content: `ตอนนี้คือรอบของ ${interaction.user.username} (${symbols[currentPlayer]})`,
        components: makeBoard()
      });
    });

    collector.on('end', async (_, reason) => {
      if (reason === 'time') {
        await interaction.editReply({ content: '⌛ หมดเวลาแล้ว เกมจบ!', components: [] });
      }
    });
  },
};
