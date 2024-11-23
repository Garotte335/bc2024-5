const express = require('express');
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');


const app = express();
const program = new Command();

// Налаштування командного рядка
program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <path>', 'Path to cache directory')
  .parse(process.argv);

const options = program.opts();

const cacheDir = path.resolve(options.cache);
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

app.get('/notes/:noteName', (req, res) => {
    const notePath = path.join(cacheDir, req.params.noteName + '.txt');
    if (!fs.existsSync(notePath)) {
      return res.status(404).send('Not found');
    }
    const noteContent = fs.readFileSync(notePath, 'utf-8');
    res.send(noteContent);
  });

  app.put('/notes/:noteName', express.text(), (req, res) => {
    const notePath = path.join(cacheDir, req.params.noteName + '.txt');
    if (!fs.existsSync(notePath)) {
      return res.status(404).send('Not found');
    }
    fs.writeFileSync(notePath, req.body);
    res.send('Note updated');
  });

  app.delete('/notes/:noteName', (req, res) => {
    const notePath = path.join(cacheDir, req.params.noteName + '.txt');
    if (!fs.existsSync(notePath)) {
      return res.status(404).send('Not found');
    }
    fs.unlinkSync(notePath);
    res.send('Note deleted');
  });


// Запуск сервера
app.listen(options.port, options.host, () => {
  console.log(`Сервер запущено на http://${options.host}:${options.port}`);
});
