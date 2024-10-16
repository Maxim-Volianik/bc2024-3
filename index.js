const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .requiredOption('-i, --input <path>', 'Input file path') // обов'язковий параметр
  .option('-o, --output <path>', 'Output file path') // необов'язковий параметр
  .option('-d, --display', 'Display result in console') // необов'язковий параметр
  .parse(process.argv);

const options = program.opts();

// Перевірка наявності обов'язкового параметру -i (input)
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Читання вхідного файлу
fs.readFile(options.input, 'utf8', (err, data) => {
  if (err) {
    console.error('Cannot find input file');
    process.exit(1);
  }

  // Якщо задано параметр -d, виводимо результат у консоль
  if (options.display) {
    console.log('File content:', data);
  }

  // Якщо задано параметр -o, записуємо результат у файл
  if (options.output) {
    fs.writeFile(options.output, data, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to output file');
        process.exit(1);
      }
      console.log(`Data has been written to ${options.output}`);
    });
  }
});

