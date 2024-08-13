require('dotenv').config();

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notify', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/upload', upload.fields([{ name: 'dataset' }]), (req, res) => {
  res.send('Dataset recebido com sucesso!');
});

app.get('/dados', (req, res) => {
  const datasetPath = path.join(__dirname, 'uploads', 'dados_limpos.json');
  if (!fs.existsSync(datasetPath)) {
    return res.status(404).send('Dataset não encontrado');
  }

  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  res.json(dataset);
});

app.get('/filter', (req, res) => {
  const { posicao, nacionalidade, idade, clube, nome, email } = req.query;
  const datasetPath = path.join(__dirname, 'uploads', 'dados_limpos.json');

  if (!fs.existsSync(datasetPath)) {
    return res.status(404).send('Dataset não encontrado');
  }

  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  let filteredData = dataset;

  if (posicao) {
    filteredData = filteredData.filter(player => player['Posição'] === posicao);
  }
  if (nacionalidade) {
    filteredData = filteredData.filter(player => player['Nacionalidade'] === nacionalidade);
  }
  if (idade) {
    filteredData = filteredData.filter(player => player['Idade'] === idade);
  }
  if (clube) {
    filteredData = filteredData.filter(player => player['Time'] === clube);
  }

  if (filteredData.length > 0) {
    sendEmail(nome, email, filteredData);  // Envia o email com os resultados filtrados
    res.json(filteredData);
  } else {
    res.status(404).send('Nenhum jogador encontrado com os critérios especificados.');
  }
});

function sendEmail(nome, to, data) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,  // Substitua pelo seu email
      pass: process.env.EMAIL_PASS  // Substitua pela sua senha
    }
  });

  const jogadorInfo = data.map(player => `
    Nome do jogador: ${player['Nome do jogador']}
    Posição: ${player['Posição']}
    Idade: ${player['Idade']}
    Nacionalidade: ${player['Nacionalidade']}
    Time: ${player['Time']}
    Valor de Mercado: ${player['Valor de Mercado']}
  `).join('\n');

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Substitua pelo seu email
    to: to,
    subject: 'Resultado da Filtragem de Jogadores',
    text: `Olá, ${nome}.\nAqui estão os resultados da sua busca:\n\n${jogadorInfo}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });
}

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
