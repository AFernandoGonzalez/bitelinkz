const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./src/db/db');
const urlRoutes = require('./src/routes/url');
const cors = require('cors');

connectDB();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.use('', urlRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}
);


