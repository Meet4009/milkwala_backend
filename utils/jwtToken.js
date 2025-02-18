const jwt = require('jsonwebtoken');

exports.jwtToken = (ID) => {
    try {
        return token = jwt.sign({ userId: ID }, process.env.JWT_SECRET);
    } catch (error) {
        console.error('Error generating JWT token:', error);
        return null;
    }
}

exports.setCookie = (res, token) => {
    res.cookie('token', token, { httpOnly: true });
};




