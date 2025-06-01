const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // import auth.js

require('dotenv').config(); // to load .env variables

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes); // mount the /auth routes

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
