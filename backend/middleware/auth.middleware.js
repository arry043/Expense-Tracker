const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/response');

const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return sendResponse(res, 401, false, 'Not authorized to access this route');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains id and email
        next();
    } catch (err) {
        return sendResponse(res, 401, false, 'Not authorized, token failed');
    }
};

module.exports = { protect };
