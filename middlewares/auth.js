import ErrorHandler from "./errorMiddleware.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new ErrorHandler(400, "Admin is not authenticated"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "admin") {
        return next(
            new ErrorHandler(
                400,
                `${req.user.role} not authorized to access this route`
            )
        );
    }
    next();
});

export const isPatientAuthenticated = catchAsyncErrors(
    async (req, res, next) => {
        const token = req.cookies.patientToken;
        if (!token) {
            return next(new ErrorHandler(400, "Patient is not authenticated"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        if (req.user.role !== "Patient") {
            return next(
                new ErrorHandler(
                    400,
                    `${req.user.role} not authorized to access this route`
                )
            );
        }
        next();
    }
);
