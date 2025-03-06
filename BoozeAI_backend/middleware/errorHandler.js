const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        title: getErrorTitle(statusCode),
        message: err.message || "An unexpected error occurred",
        stackTrace: process.env.NODE_ENV === "production" ? undefined : err.stack
    });
};

// Helper function to get the error title based on status code
const getErrorTitle = (statusCode) => {
    const errorTitles = {
        400: "Validation Failed",
        404: "Not Found",
        401: "Unauthorized",
        403: "Forbidden",
        500: "Server Error"
    };
    return errorTitles[statusCode] || "Unexpected Error";
};

module.exports = errorHandler;
