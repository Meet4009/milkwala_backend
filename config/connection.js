const mongoose = require('mongoose');

// Connect to MongoDB
const connectLocalDatabase = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then((data) => console.log(`MongoDB Connected... ${data.connection.host}/${data.connection.port}`))
        .catch(err => console.error(err));
}
const connectAtlasDatabase = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then((data) => console.log(`MongoDB Connected... ${data.connection.host}/${data.connection.port}`))
        .catch(err => console.error(err));
}

module.exports = { connectLocalDatabase, connectAtlasDatabase }