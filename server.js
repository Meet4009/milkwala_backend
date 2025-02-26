const express = require('express');
const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');
const {connectLocalDatabase,connectAtlasDatabase} = require('./config/connection');
const customerRoutes = require('./routes/customerRoutes');
const milkRoute = require('./routes/milkRoutes');


const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5555;

// Connect to the database

// Connect to MongoDB Atlas database
// connectAtlasDatabase();

// Connect to local MongoDB database
connectLocalDatabase();


// Routes
app.use('/api/customer', customerRoutes);
app.use('/api/milk', milkRoute);

// Start the server
app.listen(port,() =>{
    console.log(`Server is running on port http://localhost:${port}`);
});