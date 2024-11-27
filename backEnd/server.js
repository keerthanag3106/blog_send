
// server.js
const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const ejs = require('ejs');
const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const routes = require('./routes/route'); // Import routes
const aiRoutes = require('./routes/aiRoutes');
// app.use('/', require('./routes/route'));
dotEnv.config();

const PORT = process.env.PORT || 8000;
const jwtSecret = process.env.JWT_SECRET; // Ensure JWT_SECRET is set in your .env file
// console.log("JWT Secret:", jwtSecret);
app.locals.jwtSecret = jwtSecret;
// const routes = require('./routes/route'); // Import routes

app.use((req, res, next) => {
    req.jwtSecret = process.env.JWT_SECRET;  // Pass the JWT secret to each request
    next();
});
// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/api/ai', aiRoutes);
app.use(express.static('public'));

// Database connection
mongoose.connect(process.env.MONGO_URI) // Use environment variable for MongoDB URI
    .then(() => {
        console.log("MongoDB connected successfully");
    }).catch((error) => {
        console.log(`${error}`);
    });
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/', routes); // Use routes for all paths
app.use('/ai', aiRoutes);
app.listen(PORT, () => {
    console.log(`Server connected successfully at port ${PORT}`);
});
