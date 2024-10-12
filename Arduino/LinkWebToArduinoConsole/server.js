const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport');

const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration du port série
const serialPort = new SerialPort({
  path: 'COM3', // Changez cela pour votre port
  baudRate: 115200
});

// Gérer l'ouverture du port
serialPort.on('open', () => {
  console.log('Port série ouvert');
});

// Buffer pour stocker les données entrantes
let incomingData = '';
let lastMessage = ''; // Stocke le dernier message reçu

// Écouter les données entrantes du port série
serialPort.on('data', (data) => {
  // Convertir les données Buffer en chaîne de caractères
  incomingData += data.toString();

  // Vérifier si on a reçu un saut de ligne pour traiter le message
  if (incomingData.includes('\n')) {
    const messages = incomingData.split('\n');
    
    // Prendre tous les messages sauf le dernier, qui pourrait être incomplet
    messages.slice(0, -1).forEach((message) => {
      lastMessage = message.trim(); // Mettre à jour le dernier message
      console.log('Données reçues d\'Arduino :', lastMessage);
    });

    // Le dernier message pourrait être incomplet, le garder pour plus tard
    incomingData = messages[messages.length - 1];
  }
});

// Route pour envoyer des messages à l'Arduino
app.post('/send', (req, res) => {
  const message = req.body.message; // Assurez-vous que le message est envoyé dans le corps de la requête
  if (message) {
    serialPort.write(`${message}\n`, (err) => {
      if (err) {
        return res.status(500).send('Erreur lors de l\'envoi : ' + err.message);
      }
      console.log('Message envoyé à Arduino:', message);
      res.send('Message envoyé : ' + message);
    });
  } else {
    res.status(400).send('Message manquant');
  }
});

// Route pour vérifier l'état de la connexion série
app.get('/status', (req, res) => {
  if (serialPort.isOpen) {
    res.send('Le port série est ouvert et prêt à recevoir des données.');
  } else {
    res.status(500).send('Le port série est fermé ou inaccessible.');
  }
});

// Route pour obtenir le dernier message reçu de l'Arduino
app.get('/last-message', (req, res) => {
  if (lastMessage) {
    res.send('Dernier message reçu : ' + lastMessage);
  } else {
    res.status(404).send('Aucun message reçu pour le moment.');
  }
});

// Route pour afficher l'interface
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Assurez-vous que index.html est dans le même répertoire
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});