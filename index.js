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
  if (err.code === 'commander.missingRequiredOption') {
    console.error('Please, specify input file');
    process.exit(1);
  } else {
    throw err; // Якщо інша помилка, то вивести її
  }
});

// Парсимо аргументи
program.parse(process.argv);

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

// Функція для виводу даних
const result = JSON.stringify(data, null, 2);

if (options.display) {
  console.log(result);
}

if (options.output) {
  fs.writeFileSync(options.output, result, 'utf8');
  console.log(`Result saved to ${options.output}`);
}

if (options.output && options.display) {
  console.log('Result saved and displayed.');
}