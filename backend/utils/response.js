/**
 * Standard utility to format API responses consistently
 */
const sendResponse = (res, statusCode, success, message, data = {}, errors = null) => {
    const responsePayload = {
        success,
        message,
    };

    if (Object.keys(data).length > 0) {
        responsePayload.data = data;
    }

    if (errors) {
        responsePayload.errors = errors;
    }

    return res.status(statusCode).json(responsePayload);
};

module.exports = {
    sendResponse
};
