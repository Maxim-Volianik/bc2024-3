const fs = require('fs');
const { Command } = require('commander');

// Створюємо новий командер
const program = new Command();

// Налаштовуємо прийняття аргументів командного рядка
program
  .requiredOption('-i, --input <path>', 'Input file (required)')
  .option('-o, --output <path>', 'Output file (optional)')
  .option('-d, --display', 'Display result in console (optional)');

// Обробка помилок Commander.js
program.exitOverride((err) => {
  if (err.code === 'commander.missingMandatoryOptionValue' || err.code === 'commander.missingRequiredOption') {
    console.error('Please, specify input file');
    process.exit(1);
  }
});

// Парсимо аргументи
try {
  program.parse(process.argv);
} catch (err) {
  process.exit(1);
}

// Отримуємо опції з командера
const options = program.opts();

// Перевіряємо, чи існує вхідний файл
if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

// Читаємо вхідний файл
const data = JSON.parse(fs.readFileSync(options.input, 'utf8'));

// Перевіряємо, чи задані необов'язкові параметри output та display
if (!options.output && !options.display) {
  // Нічого не виводимо
  process.exit(0);
}

// Фільтруємо дані, де parent = "BS3_BanksLiab"
const filteredData = data.filter(item => item.parent === "BS3_BanksLiab");

// Форматуємо результати
const results = filteredData.map(item => {
  const name = item.txten; // Використовуємо ключ txten для назви показника
  const value = item.value;
  return `${name}: ${value}`;
}).join('\n'); // Використовуємо правильний ключ

// Виводимо результати в консоль, якщо вказано параметр --display
if (options.display) {
  console.log(results);
}

// Записуємо результати у файл, якщо вказано параметр --output
if (options.output) {
  fs.writeFileSync(options.output, results, 'utf8');
  console.log(`Result saved to ${options.output}`);
}

// Якщо вказано обидва параметри --output і --display
if (options.output && options.display) {
  console.log('Result saved and displayed.');
}
