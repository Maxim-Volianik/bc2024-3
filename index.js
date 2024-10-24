const fs = require('fs');
const { Command } = require('commander');

const program = new Command();

program
  .requiredOption('-i, --input <path>', 'Input file (required)')
  .option('-o, --output <path>', 'Output file (optional)')
  .option('-d, --display', 'Display result in console (optional)');

program.exitOverride((err) => {
  if (err.code === 'commander.missingMandatoryOptionValue' || err.code === 'commander.missingRequiredOption') {
    console.error('Please, specify input file');
    process.exit(1);
  }
});

try {
  program.parse(process.argv);
} catch (err) {
  process.exit(1);
}

const options = program.opts();

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(options.input, 'utf8'));

if (!options.output && !options.display) {
  process.exit(0);
}

const filteredData = data.filter(item => item.parent === "BS3_BanksLiab");

const results = filteredData.map(item => {
  const name = item.txten; 
  const value = item.value;
  return `${name}: ${value}`;
}).join('\n'); 

if (options.display) {
  console.log(results);
}

if (options.output) {
  fs.writeFileSync(options.output, results, 'utf8');
  console.log(`Result saved to ${options.output}`);
}

if (options.output && options.display) {
  console.log('Result saved and displayed.');
}