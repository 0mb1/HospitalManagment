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
        console.log(
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            nic,
            dob,
            role
        );
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

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler(400, "Please Enter Email and Password"));
    }
    if (password !== confirmPassword) {
        return next(
            new ErrorHandler(400, "Password and Confirm Password are not same")
        );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler(400, "Invalid Email or Password"));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler(400, "Invalid Email or Password"));
    }
    if (role !== user.role) {
        return next(new ErrorHandler(400, "Invalid Role"));
    }
    res.status(200).json({
        success: true,
        message: "User loged in Successfully",
    });
});
