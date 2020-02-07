const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Express
const app = express();

// Connect Mongo
connectDB();

// Init middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/party', require('./routes/party'));
app.use('/api/aadhaaruser', require('./routes/aadhaaruser'));
app.use('/api/candidate', require('./routes/candidate'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
