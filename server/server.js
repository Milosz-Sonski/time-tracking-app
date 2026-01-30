const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - zapewnienie bezpieczeństwa i komunikacji z frontendem
app.use(cors());
app.use(express.json());

// Połączenie z bazą MongoDB - mitygacja ryzyka utraty danych [cite: 111]
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Połączono z bazą danych ewidencji"))
  .catch(err => console.error("Błąd połączenia z bazą:", err));

// Definicja portu
const PORT = process.env.PORT || 5000;
const timeRoutes = require('./routes/timeRoutes');
app.use('/api/time', timeRoutes);
app.listen(PORT, () => {
  console.log(`Serwer ewidencji pracuje na porcie ${PORT}`);
});