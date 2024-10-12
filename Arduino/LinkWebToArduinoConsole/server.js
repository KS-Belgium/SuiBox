const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to handle CORS
app.use(cors()); // Allow all origins (can be adjusted for enhanced security)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serial port configuration
const serialPort = new SerialPort({
  path: 'COM3', // Change this to your port
  baudRate: 115200
});

// Handle the opening of the port
serialPort.on('open', () => {
  console.log('Serial port opened');
});

// Buffer to store incoming data
let incomingData = '';
let lastMessage = ''; // Store the last received message

// Listen for incoming data from the serial port
serialPort.on('data', (data) => {
  // Convert Buffer data to string
  incomingData += data.toString();

  // Check if a newline character has been received to process the message
  if (incomingData.includes('\n')) {
    const messages = incomingData.split('\n');

    // Take all messages except the last one, which may be incomplete
    messages.slice(0, -1).forEach((message) => {
      lastMessage = message.trim(); // Update the last message
      console.log('Data received from Arduino:', lastMessage);
    });

    // The last message may be incomplete, keep it for later
    incomingData = messages[messages.length - 1];
  }
});

// Route to send messages to the Arduino
app.post('/send', (req, res) => {
  const message = req.body.message; // Ensure the message is sent in the request body
  if (message) {
    serialPort.write(`${message}\n`, (err) => {
      if (err) {
        return res.status(500).send('Error while sending: ' + err.message);
      }
      console.log('Message sent to Arduino:', message);
      res.send('Message sent: ' + message);
    });
  } else {
    res.status(400).send('Missing message');
  }
});

// Route to check the status of the serial connection
app.get('/status', (req, res) => {
  if (serialPort.isOpen) {
    res.send('The serial port is open and ready to receive data.');
  } else {
    res.status(500).send('The serial port is closed or inaccessible.');
  }
});

// Route to get the last message received from the Arduino
app.get('/last-message', (req, res) => {
  if (lastMessage) {
    res.send('Last received message: ' + lastMessage);
  } else {
    res.status(404).send('No message received at the moment.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
