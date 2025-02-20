const jwt = require('jsonwebtoken');

exports.jwtToken = (ID) => {
    const options = {
        expiresIn: '1d',
    };
    try {
        return jwt.sign({ userId: ID }, process.env.JWT_SECRET, options);
    } catch (error) {
        console.error('Error generating JWT token:', error);
        return null;
    }
};

exports.setCookie = (res, token) => {
    const options = {
        httpOnly: true, // Cookies should only be accessible by the server
        secure: true, // Only transfer cookies over HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    };
    res.cookie('token', token, options);
};




