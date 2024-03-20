const express = require('express');
const router = require('./routes/index');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

router(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
