import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        nic,
        dob,
        role,
    } = req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !nic ||
        !dob ||
        !role
    ) {
        return next(new ErrorHandler(400, "Please Fill All Fields"));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler(400, "User Already Exists"));
    }
    user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        nic,
        dob,
        role,
    });
    res.status(200).json({
        success: true,
        message: "Patient Registered Successfully",
    });
});
