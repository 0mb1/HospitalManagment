class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(400, message);
    }
    // Wrong JWT error
    if (err.name === "jsonWebTokenError") {
        const message = "Json Web Token is invalid. Try Again!!!";
        err = new ErrorHandler(400, message);
    }
    // JWT expired error
    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is expired. Try Again!!!";
        err = new ErrorHandler(400, message);
    }
    //
    if (err.name === "CastError") {
        const message = `Invalid: ${err.path}`;
        err = new ErrorHandler(404, message);
    }

    const errorMessage = err.errors
        ? Object.values(err.errors)
              .map((error) => error.message)
              .join(" ")
        : err.message;

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;
