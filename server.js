require('dotenv').config();  // Load environment variables

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT, JWT_SECRET, MONGODB_URL } = require('./config');

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://social-media-app.onrender.com"]
}));
app.use(express.json());

global.__basedir = __dirname;

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log("DB connected");
});

mongoose.connection.on('error', (error) => {
  console.log("Error connecting to DB:", error);
});

// Models and Routes
require('./model/user_model');
require('./model/post_model');

app.use('/api', require('./routes/user_route'));
app.use('/api', require('./routes/post_route'));
app.use('/api', require('./routes/file_route'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});









