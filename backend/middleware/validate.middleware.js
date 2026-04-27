const { validationResult } = require('express-validator');
const { sendResponse } = require('../utils/response');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({ [err.path || err.param]: err.msg }));

        return sendResponse(
            res,
            400,
            false,
            'Validation failed',
            {},
            extractedErrors
        );
    }
    next();
};

module.exports = { validate };
