const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const net = require('net');
const Location = require('./models/Location'); // No .js
const locationRoutes = require('./routes/locationRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// TCP Server for GPS data
const tcpServer = net.createServer(socket => {
  console.log('� GPS device connected');

  socket.on('data', async (data) => {
    const message = data.toString().trim();
    console.log('� Raw GPS Data:', message);

    const parts = message.split(',');
    if (parts.length === 4 && parts[0].startsWith('$ID')) {
      const deviceId = parts[0].substring(3);
      const lat = parseFloat(parts[1]);
      const lng = parseFloat(parts[2]);
      const speed = parseFloat(parts[3]);

      if (!isNaN(lat) && !isNaN(lng)) {
        const location = new Location({ deviceId, lat, lng, speed });
        await location.save();
        console.log('✅ Location saved:', location);
      }
    }
  });

  socket.on('end', () => {
    console.log('� GPS device disconnected');
  });

  socket.on('error', (err) => {
    console.error('❌ Socket error:', err);
  });
});

tcpServer.listen(5001, () => {
  console.log('�� TCP server running on port 5001');
});

app.use('/api/locations', locationRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`� HTTP API server running on port ${port}`);
});

