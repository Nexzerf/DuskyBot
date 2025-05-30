const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('เครื่องคิดเลขง่าย ๆ คำนวณเลข 2 ตัว')
    .addNumberOption(option =>
      option.setName('ตัวแรก')
        .setDescription('เลขตัวที่ 1')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('เครื่องหมาย')
        .setDescription('เครื่องหมายบวก ลบ คูณ หาร หรือ โมดูลัส')
        .setRequired(true)
        .addChoices(
          { name: 'บวก (+)', value: '+' },
          { name: 'ลบ (-)', value: '-' },
          { name: 'คูณ (*)', value: '*' },
          { name: 'หาร (/)', value: '/' },
          { name: 'โมดูลัส (%)', value: '%' },
        ))
    .addNumberOption(option =>
      option.setName('ตัวที่สอง')
        .setDescription('เลขตัวที่ 2')
        .setRequired(true)),

  async execute(interaction) {
    const num1 = interaction.options.getNumber('ตัวแรก');
    const operator = interaction.options.getString('เครื่องหมาย');
    const num2 = interaction.options.getNumber('ตัวที่สอง');

    // ตรวจสอบหารหรือโมดูลัสด้วย 0
    if ((operator === '/' || operator === '%') && num2 === 0) {
      return interaction.reply({ content: '❌ หารด้วยศูนย์ไม่ได้', ephemeral: true });
    }

    let result;

    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        result = num1 / num2;
        break;
      case '%':
        result = num1 % num2;
        break;
      default:
        return interaction.reply({ content: '❌ เครื่องหมายไม่ถูกต้อง', ephemeral: true });
    }

    await interaction.reply(`🧮 ผลลัพธ์ของ \`${num1} ${operator} ${num2}\` = **${result}**`);
  }
};
