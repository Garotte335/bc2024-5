const express = require('express');
const { Command } = require('commander');

const app = express();
const program = new Command();

// Налаштування командного рядка
program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <path>', 'Path to cache directory')
  .parse(process.argv);

const options = program.opts();


// Налаштування сервера
app.get('/', (req, res) => {
  res.send('Hello! you see me?');
});

// Запуск сервера
app.listen(options.port, options.host, () => {
  console.log(`Сервер запущено на http://${options.host}:${options.port}`);
});
