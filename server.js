const express = require('express');
const dotenv = require('dotenv');
const {connectLocalDatabase,connectAtlasDatabase} = require('./config/connection');
const customerRoutes = require('./routes/customerRoutes');


const app = express();
dotenv.config();
app.use(express.json());
const port = process.env.PORT || 5555;

// Connect to the database

// Connect to MongoDB Atlas database
connectAtlasDatabase();

// Connect to local MongoDB database
// connectLocalDatabase();


// Routes
app.use('/api/customers', customerRoutes);

// Start the server
app.listen(port,() =>{
    console.log(`Server is running on port http://localhost:${port}`);
});